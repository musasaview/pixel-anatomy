import { vertexShader, panelPreviewShader } from './lcdShader';
import { panels } from './panels';

let cached: Map<number, string> | undefined;

/** Render display samples once; printing uses a licensed microscope photograph. */
export async function panelPreviews() {
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 320;
  const gl = canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true });
  if (!gl) throw new Error('WebGL2');
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Preview shader');
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, vertexShader);
  const fragment = compile(gl.FRAGMENT_SHADER, panelPreviewShader);
  const program = gl.createProgram()!;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Preview program');
  gl.useProgram(program);
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const pixels = new Uint8Array(8*4*4);
  for (let y=0;y<4;y++) for (let x=0;x<8;x++) {
    const rgb = [220,220,220];
    pixels.set([...rgb,255],(y*8+x)*4);
  }
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,8,4,0,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
  gl.uniform1i(gl.getUniformLocation(program,'uPage'),0);
  gl.uniform2f(gl.getUniformLocation(program,'uResolution'),640,320);
  gl.uniform2f(gl.getUniformLocation(program,'uTextureSize'),8,4);
  gl.uniform2f(gl.getUniformLocation(program,'uSourceSize'),8,4);
  gl.uniform4f(gl.getUniformLocation(program,'uAnimationRect'),0,0,0,0);
  gl.viewport(0,0,640,320);
  const images = new Map<number,string>([[7, `${import.meta.env.BASE_URL}images/cmyk-microscope.jpg`]]);
  for (const panel of panels) {
    if (panel.mode === 7 || panel.mode === 11) continue;
    // CRT/LCD/RGB OLED use a uniform field. WOLED colors change only at cell boundaries.
    const pastels = [[255,184,142],[168,222,255],[212,255,160],[224,192,255]];
    const primaries = [[255,0,0],[0,255,0],[0,0,255],[255,255,255]];
    for(let y=0;y<4;y++) for(let x=0;x<8;x++) {
      const rgb = panel.mode===5 ? (y<2 ? pastels : primaries)[Math.max(0,Math.min(3,x-2))] : [220,220,220];
      pixels.set([...rgb,255],(y*8+x)*4);
    }
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,8,4,0,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    gl.uniform1i(gl.getUniformLocation(program,'uMode'),panel.mode);
    gl.drawArrays(gl.TRIANGLES,0,3);
    images.set(panel.mode,canvas.toDataURL('image/png'));
  }
  gl.deleteTexture(texture);
  gl.deleteProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return cached = images;
}
