import { viewportWidth } from './viewport';
import { vertexShader, fragmentShader, normalFragmentShader } from './lcdShader';
import type { View } from './interaction';

export class LCDRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private normalProgram: WebGLProgram;
  private normalUniforms: Record<string, WebGLUniformLocation | null> = {};
  private texture: WebGLTexture;
  private pixelArtTexture: WebGLTexture;
  private pixelArtRect = [0, 0, 0, 0];
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private textureWidth = 1;
  private textureHeight = 1;
  private lost = false;
  private sourceWidth = viewportWidth();
  private sourceHeight = innerHeight;
  private animationRect = [0, 0, 0, 0];
  private printPhotoRect = [0, 0, 0, 0];
  private animationCanvas: HTMLCanvasElement | null = null;
  private clockZoom = 1;
  private reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  private animationTime = 0;
  private lastAnimationTime = performance.now();
  paused = this.reduceMotion.matches;
  private mode = 0;
  private previousMode = 0;
  private transitionStart = -Infinity;
  readonly maxTextureSize: number;
  onRestore?: () => void;

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' });
    if (!gl) throw new Error('WebGL2');
    this.gl = gl;
    this.maxTextureSize = Math.min(16384, gl.getParameter(gl.MAX_TEXTURE_SIZE));
    this.program = this.createProgram();
    this.normalProgram = this.createProgram(normalFragmentShader, this.normalUniforms);
    this.texture = this.createTexture();
    this.pixelArtTexture = this.createTexture();
    canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); this.lost = true; });
    canvas.addEventListener('webglcontextrestored', () => {
      this.lost = false;
      this.program = this.createProgram();
      this.normalProgram = this.createProgram(normalFragmentShader, this.normalUniforms);
      this.texture = this.createTexture();
      this.pixelArtTexture = this.createTexture();
      this.onRestore?.();
    });
  }

  private createProgram(fragmentSource = fragmentShader, uniforms = this.uniforms) {
    const gl = this.gl;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`LCD shader: ${log}`);
      }
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexShader);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Could not link the LCD shader.');
    for (const name of ['uPage', 'uPixelArt', 'uPixelArtRect', 'uResolution', 'uViewport', 'uTextureSize', 'uCenter', 'uZoom', 'uMode', 'uPreviousMode', 'uPanelMix', 'uSourceSize', 'uAnimationRect', 'uPrintPhotoRect', 'uLightR', 'uLightG', 'uLightB', 'uNativeView', 'uPrintPitch']) {
      uniforms[name] = gl.getUniformLocation(program, name);
    }
    gl.useProgram(program);
    gl.uniform1i(uniforms.uPage, 0);
    gl.uniform1i(uniforms.uPixelArt, 1);
    return program;
  }

  private createTexture() {
    const gl = this.gl;
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  }

  upload(source: HTMLCanvasElement, width = this.sourceWidth, height = this.sourceHeight) {
    if (this.lost) return;
    this.sourceWidth = width;
    this.sourceHeight = height;
    this.textureWidth = source.width;
    this.textureHeight = source.height;
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  }

  resize() {
    // Native DOM keeps 1× text sharp; cap the microscope work for fluid movement.
    const ratio = this.mode === 11
      ? Math.min(window.devicePixelRatio || 1,this.maxTextureSize/viewportWidth(),this.maxTextureSize/innerHeight)
      : Math.min(window.devicePixelRatio || 1, 1.5, 2560 / viewportWidth(), 1600 / innerHeight, Math.sqrt(2_500_000 / (viewportWidth() * innerHeight)));
    this.canvas.width = Math.max(1, Math.round(viewportWidth() * ratio));
    this.canvas.height = Math.max(1, Math.round(innerHeight * ratio));
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  get sourceScale() { return this.textureWidth / this.sourceWidth; }

  setPixelArt(source: HTMLCanvasElement, rect: number[]) {
    this.pixelArtRect = rect;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D,this.pixelArtTexture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
    gl.activeTexture(gl.TEXTURE0);
  }

  setAnimationCanvas(canvas: HTMLCanvasElement) {
    this.animationCanvas = canvas;
  }

  private drawNativeAnimation() {
    const canvas = this.animationCanvas;
    if (!canvas) return;
    const [, , width, height] = this.animationRect;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(width*ratio), h = Math.round(height*ratio);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#020405'; ctx.fillRect(0,0,width,height);
    ctx.globalCompositeOperation = 'lighter';
    for (let i=0;i<3;i++) {
      const phase = i*Math.PI*2/3;
      const x = Math.sin(this.animationTime*.4+phase)*.19;
      const y = Math.cos(this.animationTime*.3+phase)*.15;
      ctx.fillStyle = ctx.strokeStyle = ['#f00','#0f0','#00f'][i];
      ctx.beginPath(); ctx.arc(width*.5+x*height,height*.4+y*height,height*.186,0,Math.PI*2); ctx.fill();
      ctx.lineWidth = height*.009;
      ctx.beginPath();
      for (let j=0;j<=80;j++) {
        const u=j/80;
        const v=.8+x*.22+(u-.5)*(u-.5)*[.24,-.20,.12][i];
        if(j===0) ctx.moveTo(u*width,v*height); else ctx.lineTo(u*width,v*height);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  setAnimationRect(rect: number[]) {
    this.animationRect = rect;
  }

  setPrintPhotoRect(rect: number[]) {
    this.printPhotoRect = rect;
  }

  animationVisible(view: View) {
    if (this.paused) return false;
    const halfWidth = viewportWidth() / (2 * view.zoom);
    const halfHeight = innerHeight / (2 * view.zoom);
    const [x,y,width,height] = this.animationRect;
    return width > 0 && x < view.x+halfWidth && x+width > view.x-halfWidth
      && y < view.y+halfHeight && y+height > view.y-halfHeight;
  }

  toggleMotion() {
    this.advanceTime();
    this.paused = !this.paused;
  }

  private advanceTime(zoom = this.clockZoom) {
    const now = performance.now();
    if (!this.paused) this.animationTime += Math.min((now - this.lastAnimationTime) / 1000, .1)*1.15/Math.sqrt(Math.max(1,zoom));
    this.lastAnimationTime = now;
    this.clockZoom = zoom;
  }

  setPanel(mode: number) {
    if (mode === this.mode) return;
    this.previousMode = this.mode;
    this.mode = mode;
    this.canvas.style.imageRendering = mode === 11 ? 'pixelated' : 'auto';
    this.resize();
    this.transitionStart = performance.now();
  }

  get transitioning() { return performance.now() - this.transitionStart < 320; }

  render(view: View) {
    if (this.lost) return;
    const gl = this.gl;
    // The reading view is an ordinary canvas in the document flow. Browser
    // scrolling positions it synchronously, without a fixed overlay chasing it.
    this.advanceTime(view.zoom);
    if (view.zoom === 1) {
      gl.disable(gl.SCISSOR_TEST);
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this.drawNativeAnimation();
      return;
    }
    const normal = this.mode === 11 || view.zoom / this.sourceScale <= 2.2;
    const uniforms = normal ? this.normalUniforms : this.uniforms;
    gl.useProgram(normal ? this.normalProgram : this.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.pixelArtTexture);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform4fv(uniforms.uPixelArtRect, this.pixelArtRect);
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1i(uniforms.uNativeView, view.zoom === 1 ? 1 : 0);
    gl.uniform2f(uniforms.uResolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(uniforms.uViewport, viewportWidth(), innerHeight);
    gl.uniform2f(uniforms.uTextureSize, this.textureWidth, this.textureHeight);
    gl.uniform2f(uniforms.uSourceSize, this.sourceWidth, this.sourceHeight);
    gl.uniform4fv(uniforms.uAnimationRect, this.animationRect);
    gl.uniform4fv(uniforms.uPrintPhotoRect, this.printPhotoRect);
    for (const [i,name] of ['uLightR','uLightG','uLightB'].entries()) {
      const phase = i*Math.PI*2/3;
      gl.uniform2f(uniforms[name],Math.sin(this.animationTime*.4+phase)*.19,Math.cos(this.animationTime*.3+phase)*.15);
    }
    gl.uniform2f(uniforms.uCenter, view.x, view.y);
    gl.uniform1f(uniforms.uZoom, view.zoom);
    gl.uniform1f(uniforms.uPrintPitch, 2.0);
    gl.uniform1i(uniforms.uMode, this.mode);
    gl.uniform1i(uniforms.uPreviousMode, this.previousMode);
    gl.uniform1f(uniforms.uPanelMix, Math.min(1, (performance.now() - this.transitionStart) / 320));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disable(gl.SCISSOR_TEST);
  }
}
