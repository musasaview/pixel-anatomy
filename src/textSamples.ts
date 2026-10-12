/** Small fixed-size teaching samples, generated only when content changes.
 * These are deliberate coverage examples, not measurements of browser/OS AA.
 */
let cached: { gray: string; color: string; grayCanvas: HTMLCanvasElement; colorCanvas: HTMLCanvasElement } | undefined;
let cachedScale = 0;

export function textSamples(scale = 1) {
  if (cached && cachedScale === scale) return cached;
  cachedScale = scale;
  const width = Math.max(1,Math.round(160*scale));
  const height = Math.max(1,Math.round(64*scale));
  const coverage = document.createElement('canvas');
  coverage.width = width * 3;
  coverage.height = height;
  const context = coverage.getContext('2d', { willReadFrequently: true })!;
  context.scale(3, 1);
  context.fillStyle = '#fff';
  context.font = `500 ${38*scale}px ${getComputedStyle(document.documentElement).fontFamily}`;
  context.textBaseline = 'middle';
  context.fillText('Aa', 17.2*scale, height / 2);
  const samples = context.getImageData(0, 0, coverage.width, height).data;
  const make = (color: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const pixels = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const input = (y * width * 3 + x * 3) * 4;
        const output = (y * width + x) * 4;
        const r = samples[input + 3];
        const g = samples[input + 7];
        const b = samples[input + 11];
        const gray = (r + g + b) / 3;
        pixels.data[output] = 255 - (color ? r : gray);
        pixels.data[output + 1] = 255 - (color ? g : gray);
        pixels.data[output + 2] = 255 - (color ? b : gray);
        pixels.data[output + 3] = 255;
      }
    }
    ctx.putImageData(pixels, 0, 0);
    return canvas;
  };
  const grayCanvas = make(false), colorCanvas = make(true);
  return cached = { gray: grayCanvas.toDataURL(), color: colorCanvas.toDataURL(), grayCanvas, colorCanvas };
}

let detailCache: { pixel: string; lcd: string; grayLcd: string; colorLcd: string } | undefined;
/** The same letter edge with grayscale and RGB subpixel antialiasing. */
export function textDetails() {
  if (detailCache) return detailCache;
  const source = textSamples(1).colorCanvas;
  const data = source.getContext('2d')!.getImageData(0,0,source.width,source.height).data;
  const row = Math.floor(source.height/2);
  let edge = 17;
  for(let x=0;x<source.width;x++) {
    const i=(row*source.width+x)*4;
    if(Math.min(data[i],data[i+1],data[i+2])<245) {edge=x;break;}
  }
  const startX=Math.max(0,edge-3),startY=row-6;
  const make=(color:boolean,lcd=false)=>{
    const image=color?source:textSamples(1).grayCanvas;
    const pixels=image.getContext('2d')!.getImageData(0,0,image.width,image.height).data;
    const c=document.createElement('canvas');c.width=168;c.height=144;
    const g=c.getContext('2d')!;
    g.fillStyle='#080808';g.fillRect(0,0,c.width,c.height);
    for(let y=0;y<12;y++)for(let x=0;x<14;x++) {
      const i=((startY+y)*source.width+startX+x)*4;
      const rgb=[pixels[i],pixels[i+1],pixels[i+2]];
      if(lcd){
        for(let channel=0;channel<3;channel++){
          const stripe=[0,0,0];stripe[channel]=rgb[channel];
          g.fillStyle=`rgb(${stripe.join(',')})`;g.fillRect(x*12+channel*4,y*12,3,11);
        }
      }else{g.fillStyle=`rgb(${rgb.join(',')})`;g.fillRect(x*12,y*12,12,12);}
    }
    return c.toDataURL('image/png');
  };
  return detailCache={pixel:make(false),lcd:make(true),grayLcd:make(false,true),colorLcd:make(true,true)};
}
