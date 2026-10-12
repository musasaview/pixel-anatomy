export const vertexShader = `#version 300 es
precision highp float;
// One fullscreen triangle; source geometry and textures never grow with zoom.
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export const fragmentShader = `#version 300 es
precision highp float;
uniform sampler2D uPage;
uniform sampler2D uPixelArt;
uniform vec4 uPixelArtRect;
uniform vec2 uResolution;
uniform vec2 uViewport;
uniform vec2 uTextureSize;
uniform vec2 uCenter;
uniform float uZoom;
uniform int uMode;
uniform int uPreviousMode;
uniform float uPanelMix;
uniform vec2 uSourceSize;
uniform vec4 uAnimationRect;
uniform vec4 uPrintPhotoRect;
uniform vec2 uLightR;
uniform vec2 uLightG;
uniform vec2 uLightB;
uniform int uNativeView;
uniform float uPrintPitch;
out vec4 fragColor;
const float TAU = 6.283185307;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
vec3 pageAt(vec2 p) {
  vec2 source = p * uSourceSize / uTextureSize;
  if (uPixelArtRect.z > 0.0 && all(greaterThanEqual(source,uPixelArtRect.xy))
    && all(lessThan(source,uPixelArtRect.xy+uPixelArtRect.zw))) {
    ivec2 size = textureSize(uPixelArt,0);
    ivec2 cell = ivec2(floor((source-uPixelArtRect.xy)/uPixelArtRect.zw*vec2(size)));
    return texelFetch(uPixelArt,clamp(cell,ivec2(0),size-1),0).rgb;
  }
  vec2 local = (source - uAnimationRect.xy) / max(uAnimationRect.zw, vec2(1.0));
  if (uAnimationRect.z > 0.0 && all(greaterThanEqual(local,vec2(0.0))) && all(lessThanEqual(local,vec2(1.0)))) {
    vec2 q = (local-vec2(.5,.40))*vec2(uAnimationRect.z/uAnimationRect.w,1.0);
    // Centers are computed once per frame on the CPU, not per fragment.
    vec3 distance = vec3(length(q-uLightR),length(q-uLightG),length(q-uLightB));
    vec3 light = 1.0-smoothstep(vec3(.182),vec3(.189),distance);
    // Three moving, gently curved RGB lines share the same animation clock.
    vec3 centers = vec3(uLightR.x,uLightG.x,uLightB.x);
    vec3 lineY = vec3(.80) + centers*.22 + (local.x-.5)*(local.x-.5)*vec3(.24,-.20,.12);
    vec3 lines = 1.0-smoothstep(vec3(.003),vec3(.007),abs(vec3(local.y)-lineY));
    return max(vec3(.009,.016,.020),max(light,lines));
  }
  return texture(uPage, p / uTextureSize).rgb;
}
vec3 flatPixelAt(vec2 p) {
  vec2 source = p*uSourceSize/uTextureSize;
  bool art = uPixelArtRect.z > 0.0 && all(greaterThanEqual(source,uPixelArtRect.xy))
    && all(lessThan(source,uPixelArtRect.xy+uPixelArtRect.zw));
  return pageAt(art ? p : floor(p)+.5);
}
vec3 pixelAt(vec2 cell) {
  return pageAt(clamp(cell, vec2(0.0), uTextureSize - 1.0) + .5);
}
vec3 sampleAt(vec2 p) {
  return pageAt(clamp(p, vec2(0.0), uTextureSize));
}
float aperture(float distance, float aa) {
  return 1.0 - smoothstep(-aa, aa, distance);
}
float glow(vec2 offset, vec2 radius) {
  vec2 q = offset / radius;
  return exp(-dot(q, q) * 2.0);
}
vec3 primary(vec3 c, int stripe) {
  return stripe == 0 ? vec3(c.r, 0.0, 0.0)
       : stripe == 1 ? vec3(0.0, c.g, 0.0) : vec3(0.0, 0.0, c.b);
}

// Rotated AM screens. The ink absorbs reflected light, never emits RGB.
float paperNoise(vec2 p) {
  vec2 cell = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  return mix(mix(hash(cell),hash(cell+vec2(1,0)),f.x),
             mix(hash(cell+vec2(0,1)),hash(cell+vec2(1,1)),f.x),f.y);
}
float inkScreen(vec2 p, float angle, float coverage, float aa) {
  mat2 rotation = mat2(cos(angle),sin(angle),-sin(angle),cos(angle));
  vec2 screen = rotation*p/max(uPrintPitch,1.0);
  // A periodic spot function grows round dots into connected midtones and
  // round paper holes in shadows. No clipping against square cell borders.
  if (coverage <= 0.0) return 0.0;
  if (coverage >= .9999) return 1.0;
  const float thresholds[33] = float[33](2.0000000, 1.8079446, 1.6264585, 1.4533688, 1.2893628, 1.1338702, 0.9873902, 0.8492351, 0.7195945, 0.5989634, 0.4851729, 0.3803090, 0.2841806, 0.1961510, 0.1187028, 0.0504321, 0.0000000, -0.0505882, -0.1187028, -0.1962301, -0.2842234, -0.3803259, -0.4852196, -0.5989634, -0.7196222, -0.8493057, -0.9876601, -1.1338702, -1.2893628, -1.4535592, -1.6264585, -1.8082785, -2.0000000);
  float index = clamp(coverage*32.0,0.0,32.0);
  int lower = min(int(floor(index)),31);
  float threshold = mix(thresholds[lower],thresholds[lower+1],index-float(lower));
  vec2 grainPosition = p/max(uPrintPitch,1.0);
  screen += .018*vec2(paperNoise(grainPosition*13.0)-.5,paperNoise(grainPosition*17.0+31.0)-.5);
  float spot = cos(TAU*screen.x)+cos(TAU*screen.y);
  float gradient = max(TAU*length(sin(TAU*screen)),1.0);
  float distance = (spot-threshold)/gradient;
  float roughness = (paperNoise(grainPosition*32.0)-.5)*.009;
  // Ink edges have a physical transition width, not just a one-screen-pixel AA fringe.
  float edge = max(aa/max(uPrintPitch,1.0),.035);
  float core = smoothstep(-edge,edge,distance+roughness);
  float spread = smoothstep(-edge*2.8,edge,distance+roughness);
  return mix(core,spread,.24);
}
vec3 decodeSRGB(vec3 rgb) {
  return mix(rgb/12.92,pow((rgb+.055)/1.055,vec3(2.4)),step(vec3(.04045),rgb));
}
vec3 encodeSRGB(vec3 light) {
  light = max(light,vec3(0));
  return mix(light*12.92,1.055*pow(light,vec3(1.0/2.4))-.055,step(vec3(.0031308),light));
}
vec4 printInks(vec2 p) {
  // Screen the continuous image, not a block-averaged version of it.
  // This preserves text outlines and counters across halftone cell boundaries.
  float pitch = max(uPrintPitch,1.0);
  vec2 q = p + pitch*.018*vec2(paperNoise(p/pitch*19.0)-.5,paperNoise(p/pitch*23.0+47.0)-.5);
  vec2 spread = vec2(pitch*.035,0.0);
  // A small paper-space filter also softens the printed letter boundary.
  vec3 source = sampleAt(q)*.4 + .15*(sampleAt(q+spread)+sampleAt(q-spread)
    +sampleAt(q+spread.yx)+sampleAt(q-spread.yx));
  vec3 rgb = decodeSRGB(clamp(source,vec3(0.0),vec3(1.0)));
  // Neutral text uses K only; chromatic inks carry the remaining color.
  float k = clamp((1.0-max(rgb.r,max(rgb.g,rgb.b)))/.975,0.0,1.0);
  float chroma = (max(rgb.r,max(rgb.g,rgb.b))-min(rgb.r,min(rgb.g,rgb.b))) / max(max(rgb.r,max(rgb.g,rgb.b)),.0001);
  // Preserve K-only neutral lettering; retain more color ink in photographs.
  k *= 1.0-.35*smoothstep(0.0,.5,chroma);
  vec3 cmy = clamp((vec3(1.0)-rgb/max(1.0-.975*k,.0001))/.96,vec3(0),vec3(1));
  return vec4(cmy,k);
}
vec3 printPanel(vec2 p, float aa, float macroLOD) {
  vec4 inks = printInks(p);
  float c = inkScreen(p,.261799,inks.x,aa);
  float m = inkScreen(p,1.308997,inks.y,aa);
  float y = inkScreen(p,0.0,inks.z,aa);
  float black = inkScreen(p,.785398,inks.w,aa);
  vec2 paperPosition = p/max(uPrintPitch,1.0);
  float detail = 1.0-smoothstep(.03,.12,aa/max(uPrintPitch,1.0));
  float grain = (paperNoise(paperPosition*42.0)-.5)*.065
    +(paperNoise(paperPosition*vec2(9.0,85.0))-.5)*.028;
  vec3 paper = vec3(.97,.957,.932)*(1.0+grain*detail);
  // Ink is not an ideal RGB complement: neighboring wavelengths are absorbed too.
  vec3 reflectance = paper * mix(vec3(1),vec3(.055,.86,.93),c)
    * mix(vec3(1),vec3(.94,.045,.72),m)
    * mix(vec3(1),vec3(.98,.94,.035),y)
    * mix(vec3(1),vec3(.022,.024,.025),black);
  return encodeSRGB(reflectance);
}

vec3 simulatePanel(int mode, vec2 p, vec2 derivatives, float macroLOD) {
  if (mode == 11) return flatPixelAt(p);
  if (mode == 7) {
    vec2 source = p*uSourceSize/uTextureSize;
    // The photographed ink dots are already real halftones; never screen them again.
    if (uPrintPhotoRect.z > 0.0 && all(greaterThanEqual(source,uPrintPhotoRect.xy))
      && all(lessThan(source,uPrintPhotoRect.xy+uPrintPhotoRect.zw))) return pageAt(p);
    return printPanel(p,max(derivatives.x,derivatives.y)*.65,macroLOD);
  }
  vec2 cell = floor(p);
  vec2 f = fract(p);
  vec3 color = pixelAt(cell);
  float aa = max(derivatives.x, derivatives.y) * .65;
  vec3 emission = vec3(0.0);
  vec3 halo = vec3(0.0);
  float dark = .006;
  bool crt = mode == 2 || mode == 3 || mode == 9;

  if (mode == 5) {
    // Representative four-channel WOLED. Neutral energy is shared with W;
    // this is illustrative, not a manufacturer's proprietary drive algorithm.
    int stripe = int(floor(f.x*4.0));
    // Split neutral energy in linear light. A neutral input drives W alone.
    vec3 linearRGB = pow(max(color,vec3(0.0)),vec3(2.2));
    float neutral = min(linearRGB.r,min(linearRGB.g,linearRGB.b));
    float white = pow(neutral,1.0/2.2);
    vec3 rgb = pow(max(linearRGB-vec3(neutral),vec3(0.0)),vec3(1.0/2.2));
    vec3 light = stripe == 0 ? vec3(rgb.r,0,0) : stripe == 1 ? vec3(white) : stripe == 2 ? vec3(0,0,rgb.b) : vec3(0,rgb.g,0);
    vec2 local = vec2(fract(f.x*4.0)-.5,f.y-.5);
    float d = roundedBox(local,vec2(.40,.44),.07);
    emission = light*aperture(d,aa*4.0)*(.84+.16*smoothstep(0.0,.065,-d));
    halo = light*glow(local,vec2(.58,.58));
    dark = .0008;
  } else if (mode == 8) {
    vec2 r = f-vec2(.27,.25), g = f-vec2(.27,.75), b = f-vec2(.76,.5);
    vec3 d = vec3(roundedBox(r,vec2(.20,.19),.04),roundedBox(g,vec2(.20,.19),.04),roundedBox(b,vec2(.17,.44),.04));
    emission = color*vec3(aperture(d.r,aa),aperture(d.g,aa),aperture(d.b,aa));
    halo = color*vec3(glow(r,vec2(.26,.25)),glow(g,vec2(.26,.25)),glow(b,vec2(.24,.52)));
    dark = .0008;
  } else if (mode == 10) {
    // The aperture itself bends, unlike the internal electrode slits of VA.
    float bend = .12*abs(f.y-.5)/.5;
    float shiftedX = p.x-bend;
    float channel = floor(shiftedX*3.0);
    vec2 sampleCell = vec2(floor(shiftedX),cell.y);
    vec3 light = primary(pixelAt(sampleCell),int(mod(channel,3.0)));
    vec2 local = vec2(fract(shiftedX*3.0)-.5,f.y-.5);
    float d = roundedBox(local,vec2(.385,.42),.025);
    float edge = .80+.20*smoothstep(0.0,.08,-d);
    float contact = aperture(roundedBox(local-vec2(.28,.34),vec2(.065,.03),.008),aa*3.0);
    emission = light*aperture(d,aa*3.0)*edge*(1.0-contact*.65*macroLOD);
    halo = light*glow(local,vec2(.53,.52));
  } else if (mode == 9) {
    // Elongated phosphors with staggered horizontal bridges: slot shadow mask.
    float column = floor(p.x*3.0);
    float offset = mod(floor(p.x),2.0)*.5;
    vec2 local = vec2(fract(p.x*3.0)-.5,fract(p.y+offset)-.5);
    vec3 light = primary(sampleAt(p),int(mod(column,3.0)));
    float d = roundedBox(local,vec2(.39,.42),.13);
    emission = light*aperture(d,aa*3.0)*(.88+.12*cos(p.y*TAU));
    halo = light*glow(local,vec2(.6,.58));
    dark = .005;
  } else if (mode == 1) {
    // Diamond PenTile: green at every cell center; alternating red/blue vertices.
    // Per two source samples: one R, two G, one B (RG/BG), not three stripes.
    // The bilinear sample at a shared vertex reconstructs adjacent source colors.
    vec2 vertex = floor(p + .5);
    vec2 d = p - vertex;
    bool red = mod(vertex.x + vertex.y, 2.0) < .5;
    vec3 shared = sampleAt(vertex);
    vec2 rbRadius = red ? vec2(.32, .34) : vec2(.37, .39);
    float rbDistance = (dot(abs(d) / rbRadius, vec2(1.0)) - 1.0) * min(rbRadius.x, rbRadius.y);
    vec2 g = f - .5;
    float gDistance = (abs(g.x)/.21 + abs(g.y)/.27 - 1.0) * .21;
    float rbMask = aperture(rbDistance, aa);
    float gMask = aperture(gDistance, aa);
    float rbBevel = .84 + .16 * smoothstep(0.0, .05, -rbDistance);
    float gBevel = .86 + .14 * smoothstep(0.0, .045, -gDistance);
    vec3 rb = red ? vec3(shared.r,0.0,0.0) : vec3(0.0,0.0,shared.b);
    emission = rb * rbMask * rbBevel + vec3(0.0,color.g,0.0) * gMask * gBevel;
    halo = rb * glow(d, rbRadius * 1.4) + vec3(0.0,color.g,0.0) * glow(g,vec2(.29,.36));
    dark = .0008;
  } else if (mode == 2) {
    // Shadow-mask CRT: circular phosphor triads on staggered rows. The phosphor
    // pitch is an illustrative reference, not a one-to-one physical image pixel.
    float row = floor(p.y / .90);
    float shift = mod(row, 2.0) * .5;
    vec2 tile = vec2(floor(p.x - shift), row);
    vec2 origin = vec2(tile.x + shift, row * .90);
    vec2 local = p-origin;
    vec2 r = local - vec2(.18,.32*.90);
    vec2 g = local - vec2(.50,.68*.90);
    vec2 b = local - vec2(.82,.32*.90);
    // Beam brightness follows the source continuously, separate from the mask.
    vec3 cr = sampleAt(origin + vec2(.18,.32*.90));
    vec3 cg = sampleAt(origin + vec2(.50,.68*.90));
    vec3 cb = sampleAt(origin + vec2(.82,.32*.90));
    vec3 masks = vec3(aperture(length(r)-.15,aa), aperture(length(g)-.15,aa), aperture(length(b)-.15,aa));
    vec3 beam = vec3(cr.r,cg.g,cb.b);
    vec3 radial = .80 + .20 * exp(-vec3(dot(r,r),dot(g,g),dot(b,b)) / .0225);
    emission = beam * masks * radial;
    halo = beam * vec3(glow(r,vec2(.24)),glow(g,vec2(.24)),glow(b,vec2(.24)));
    float scan = .88 + .12 * cos(p.y * TAU);
    emission *= scan;
    dark = .005;
  } else if (mode == 6) {
    // Representative QD-OLED triangle: G above R/B, in three distinct apertures.
    // Quantum-dot conversion changes emission physics, not the source RGB data.
    vec2 r = f - vec2(.24,.70);
    vec2 g = f - vec2(.50,.23);
    vec2 b = f - vec2(.76,.70);
    float rd = roundedBox(r, vec2(.17,.125), .045);
    float gd = roundedBox(g, vec2(.21,.12), .045);
    float bd = roundedBox(b, vec2(.18,.13), .045);
    vec3 masks = vec3(aperture(rd,aa),aperture(gd,aa),aperture(bd,aa));
    vec3 bevel = .84 + .16 * smoothstep(vec3(0.0),vec3(.045),-vec3(rd,gd,bd));
    emission = color * masks * bevel;
    halo = color * vec3(glow(r,vec2(.26,.20)),glow(g,vec2(.31,.20)),glow(b,vec2(.27,.21)));
    dark = .0008;
  } else {
    // RGB stripe family: LCD, RGB OLED, VA LCD and CRT aperture grille each have
    // different internal structures and black levels, not just different colors.
    int stripe = int(floor(f.x * 3.0));
    vec2 local = vec2(fract(f.x * 3.0) - .5, f.y - .5);
    vec3 light = primary(color, stripe);
    float distance;
    float stripeAA = aa * 3.0;
    if (mode == 3) {
      // Continuous vertical phosphor strips, modulated by a horizontal raster.
      // No LCD-style horizontal black-matrix gaps. Two thin stabilizing wires.
      light = primary(sampleAt(vec2(cell.x+.5,p.y)), stripe);
      distance = abs(local.x) - .425;
      float beam = .70 + .30 * pow(.5 + .5*cos(p.y*TAU), .6);
      float wireDistance = min(abs(p.y-uTextureSize.y*.33),abs(p.y-uTextureSize.y*.67));
      float wire = .68 + .32 * smoothstep(.016,.035+aa,wireDistance);
      emission = light * aperture(distance,stripeAA) * beam * wire;
      dark = .005;
    } else {
      float halfWidth = .425;
      distance = roundedBox(local, vec2(halfWidth,.438), .065);
      float mask = aperture(distance,stripeAA);
      float bevel = .79 + .21 * smoothstep(0.0,.085,-distance);
      float center = .91 + .09 * (1.0-pow(abs(local.y)/.5,2.0));
      float electrode = 1.0;
      if (mode == 4) {
        // Multi-domain VA: repeating chevron slits and a central domain boundary.
        float chevron = abs(fract((local.y-abs(local.x)*.30)*5.0+.5)-.5)/5.0;
        electrode = (.38+.62*smoothstep(.007,.018+aa,chevron))
                  * (.55+.45*smoothstep(.008,.023+stripeAA,abs(local.x)));
      } else if (mode == 0) {
        electrode = 1.0-.10*macroLOD*(1.0-smoothstep(.001,.006+aa,abs(local.y)));
      }
      // A small transistor/contact occupies one corner of LCD apertures; the
      // channel darkens gradually with material detail, without changing geometry.
      if (mode == 0 || mode == 4) {
        float contact = aperture(roundedBox(local-vec2(.31,.365),vec2(.075,.035),.006),stripeAA);
        electrode *= 1.0-contact*.72*macroLOD;
      }
      emission = light * mask * bevel * center * electrode;
    }
    vec3 left = pixelAt(cell - vec2(1.0,0.0));
    vec3 right = pixelAt(cell + vec2(1.0,0.0));
    halo = vec3(
      color.r*exp(-pow((f.x-1.0/6.0)*5.0,2.0)) + right.r*exp(-pow((f.x-7.0/6.0)*5.0,2.0)),
      color.g*exp(-pow((f.x-.5)*5.0,2.0)),
      color.b*exp(-pow((f.x-5.0/6.0)*5.0,2.0)) + left.b*exp(-pow((f.x+1.0/6.0)*5.0,2.0))
    );
    if (mode != 3) halo *= exp(-pow(max(abs(f.y-.5)-.36,0.0)*9.0,2.0));
  }

  // Material detail remains attached to the panel, never to the viewport.
  // Keep texture band-limited: unresolved random grains must not sparkle in motion.
  vec2 grainCell = p*vec2(crt ? 44.0 : 72.0,crt ? 60.0 : 96.0);
  vec2 gf = fract(grainCell); gf = gf*gf*(3.0-2.0*gf);
  vec2 gi = floor(grainCell);
  float noise = mix(mix(hash(gi),hash(gi+vec2(1,0)),gf.x),mix(hash(gi+vec2(0,1)),hash(gi+vec2(1,1)),gf.x),gf.y)-.5;
  float grainLOD = 1.0-smoothstep(.25,.8,max(derivatives.x,derivatives.y)*(crt ? 60.0 : 96.0));
  float grain = noise*(crt ? .085 : .024)*macroLOD*grainLOD;
  float conductor = smoothstep(.001,.004,abs(fract(p.y)-.035));
  if (mode == 0 || mode == 4 || mode == 10) emission *= mix(1.0,.86+.14*conductor,macroLOD);
  // Optical spread is broader for phosphors; unlit OLED apertures stay dark.
  vec3 result = vec3(dark) + emission*(1.0+grain) + halo*(crt ? .12 : .022);

  return result;
}

void main() {
  vec2 screen = vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y)/uResolution*uViewport;
  vec2 p = ((screen-uViewport*.5)/uZoom+uCenter)*uTextureSize/uSourceSize;
  vec2 uv = p/uTextureSize;
  if (any(lessThan(uv,vec2(0.0))) || any(greaterThan(uv,vec2(1.0)))) {
    fragColor = vec4(.055,.07,.06,1.0);
    return;
  }
  float pixelScale = uZoom*uSourceSize.x/uTextureSize.x;
  if (uMode == 11) { fragColor = vec4(flatPixelAt(p),1.0); return; }
  vec3 normal = pageAt(p);
  float rasterLOD = smoothstep(1.4,7.0,pixelScale);
  // Finish removing the composite image before apertures are clearly resolved.
  // The antialiased physical masks then carry all channel color themselves.
  float structureLOD = smoothstep(2.2,9.0,pixelScale);
  float macroLOD = smoothstep(25.0,120.0,pixelScale);
  vec2 derivatives = max(fwidth(p),vec2(.00015));
  vec3 raster = uMode == 7 ? normal : mix(normal,pixelAt(floor(p)),rasterLOD);

  // Full-color texture dominates at low magnification. No subpixel pattern or
  // moire is calculated until it can be resolved. Every transition is continuous.
  if (structureLOD <= 0.0) {
    fragColor = vec4(raster,1.0);
    return;
  }
  float opticalGain = mix(1.75,1.0,smoothstep(3.0,22.0,pixelScale));
  vec3 panel = simulatePanel(uMode,p,derivatives,macroLOD);
  if (uMode != 7 && uMode != 11) panel *= opticalGain;
  // A brief crossfade keeps switching panels smooth while preserving the camera.
  // Only the two selected models run during this transition, never all eight.
  if (uPanelMix < 1.0) {
    vec3 previous = simulatePanel(uPreviousMode,p,derivatives,macroLOD);
    if (uPreviousMode != 7 && uPreviousMode != 11) previous *= opticalGain;
    panel = mix(previous,panel,smoothstep(0.0,1.0,uPanelMix));
  }
  // Close viewing reduces optical integration: gently lower the gain as the
  // gaps become resolved. No full-color fill remains behind visible emitters.
  fragColor = vec4(mix(raster,panel,structureLOD),1.0);
}`;

// Normal reading never evaluates aperture geometry. A separate small program
// avoids the register/branch cost of the microscope shader on integrated GPUs.
export const normalFragmentShader = fragmentShader.slice(0, fragmentShader.indexOf('vec3 pixelAt')) + `
void main() {
  vec2 screen = vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y)/uResolution*uViewport;
  vec2 p = ((screen-uViewport*.5)/uZoom+uCenter)*uTextureSize/uSourceSize;
  if (any(lessThan(p,vec2(0))) || any(greaterThan(p,uTextureSize))) {
    fragColor = vec4(.055,.07,.06,1.0);
    return;
  }
  if (uNativeView == 1) {
    vec2 source = p*uSourceSize/uTextureSize;
    bool light = all(greaterThanEqual(source,uAnimationRect.xy)) && all(lessThan(source,uAnimationRect.xy+uAnimationRect.zw));
    if (!light) discard;
  }
  if (uMode == 11) { fragColor = vec4(flatPixelAt(p),1.0); return; }
  vec3 color = pageAt(p);
  float pixelScale = uZoom*uSourceSize.x/uTextureSize.x;
  if (uNativeView == 0 && uMode != 7 && pixelScale > 1.4) {
    color = mix(color,pageAt(floor(p)+.5),smoothstep(1.4,7.0,pixelScale));
  }
  fragColor = vec4(color,1.0);
}`;

// The article samples use exactly the same physical model as the microscope.
export const panelPreviewShader = fragmentShader.slice(0, fragmentShader.indexOf('\nvoid main()')) + `
void main() {
  vec2 uv = vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y)/uResolution;
  if (uMode == 7) {
    vec2 p = uv*uTextureSize;
    fragColor = vec4(printPanel(p,max(uTextureSize.x/uResolution.x,uTextureSize.y/uResolution.y)*.65,0.0),1.0);
    return;
  }
  vec2 span = vec2(4.0,2.0);
  vec2 p = uv*span+vec2(2.0,1.0);
  vec2 derivatives = span/uResolution;
  fragColor = vec4(simulatePanel(uMode,p,derivatives,1.0),1.0);
}`;

// A continuous cat crop: unchanged pixels above, the shared LCD model below.
export const pixelArtComparisonShader = fragmentShader.slice(0, fragmentShader.indexOf('\nvoid main()')) + `
void main() {
  vec2 uv = vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y)/uResolution;
  vec2 p = uv*uTextureSize;
  vec3 color = uv.y < .5 ? pixelAt(floor(p)) : simulatePanel(0,p,uTextureSize/uResolution,1.0);
  fragColor = vec4(color,1.0);
}`;
