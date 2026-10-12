import { vertexShader, pixelArtComparisonShader } from './lcdShader';
/** User-provided artwork, kept at its original resolution for the microscope. */
export const pixelArtURL=()=>`${import.meta.env.BASE_URL}images/pixel-cat-game.png`;
let cached: HTMLCanvasElement | undefined;
export function pixelArt(image: HTMLImageElement) {
  if(cached)return cached;
  const c=document.createElement('canvas');
  c.width=image.naturalWidth;c.height=image.naturalHeight;
  c.getContext('2d')!.drawImage(image,0,0);
  return cached=c;
}
let detail: string | undefined;
/** One continuous crop, comparing source pixels with the actual LCD shader. */
export function pixelArtDetailURL(image: HTMLImageElement){
  if(detail)return detail;
  const crop=document.createElement('canvas');crop.width=28;crop.height=28;
  crop.getContext('2d')!.drawImage(pixelArt(image),120,87,28,28,0,0,28,28);
  const canvas=document.createElement('canvas');canvas.width=672;canvas.height=672;
  const gl=canvas.getContext('webgl2',{antialias:false,preserveDrawingBuffer:true});
  if(!gl)throw new Error('WebGL2');
  const compile=(type:number,source:string)=>{
    const shader=gl.createShader(type)!;gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader)||'Cat comparison shader');
    return shader;
  };
  const vertex=compile(gl.VERTEX_SHADER,vertexShader),fragment=compile(gl.FRAGMENT_SHADER,pixelArtComparisonShader);
  const program=gl.createProgram()!;gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'Cat comparison program');
  gl.useProgram(program);
  const texture=gl.createTexture()!;gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,crop);
  gl.uniform1i(gl.getUniformLocation(program,'uPage'),0);
  gl.uniform2f(gl.getUniformLocation(program,'uResolution'),672,672);
  gl.uniform2f(gl.getUniformLocation(program,'uTextureSize'),28,28);
  gl.uniform2f(gl.getUniformLocation(program,'uSourceSize'),28,28);
  gl.viewport(0,0,672,672);gl.drawArrays(gl.TRIANGLES,0,3);
  const output=document.createElement('canvas');output.width=168;output.height=168;
  output.getContext('2d')!.drawImage(canvas,0,0,168,168);
  detail=output.toDataURL('image/png');
  gl.deleteTexture(texture);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return detail;
}
