/** Representative layouts. Dimensions are illustrative, not vendor specifications. */
export const panels = [
  { id: 'pixel', mode: 11, tag: 'PIXEL', metricScale: 1, pattern: 'pixel' },
  { id: 'lcd', mode: 0, tag: 'LCD · RGB STRIPE', metricScale: .85 / 3, pattern: 'stripe' },
  { id: 'lcd-bent', mode: 10, tag: 'LCD · CHEVRON', metricScale: .78 / 3, pattern: 'bent' },
  { id: 'lcd-va', mode: 4, tag: 'LCD · MULTI-DOMAIN', metricScale: .85 / 3, pattern: 'chevron' },
  { id: 'pentile', mode: 1, tag: 'OLED · RG · BG', metricScale: .42, pattern: 'diamond' },
  { id: 'qd-oled', mode: 6, tag: 'OLED · TRIANGLE RGB', metricScale: .42, pattern: 'triangle' },
  { id: 's-stripe', mode: 8, tag: 'OLED · S-STRIPE', metricScale: .36, pattern: 'sstripe' },
  { id: 'woled', mode: 5, tag: 'OLED · RWBG', metricScale: .20, pattern: 'wrgb' },
  { id: 'crt-slot', mode: 9, tag: 'CRT · SLOT MASK', metricScale: .26, pattern: 'slots' },
  { id: 'crt-dot', mode: 2, tag: 'CRT · DOT TRIAD', metricScale: .30, pattern: 'dots' },
  { id: 'crt-grille', mode: 3, tag: 'CRT · APERTURE GRILLE', metricScale: .85 / 3, pattern: 'grille' },
  { id: 'print', mode: 7, tag: 'PRINT · CMYK', metricScale: 2, pattern: 'print' },
] as const;
export type Panel = (typeof panels)[number];

export function panelIcon(pattern: Panel['pattern']) {
  // These small diagrams explain the arrangement; the main simulation is GLSL.
  const colors = ['#ff0000', '#00ff00', '#0000ff'];
  let shapes = '';
  if (pattern === 'pixel') {
    shapes = '<rect x="5" y="3" width="12" height="11" fill="#ff0000"/><rect x="17" y="3" width="12" height="11" fill="#00ff00"/><rect x="29" y="3" width="12" height="11" fill="#0000ff"/><rect x="5" y="14" width="12" height="11" fill="#ffff00"/><rect x="17" y="14" width="12" height="11" fill="#00ffff"/><rect x="29" y="14" width="12" height="11" fill="#ff00ff"/>';
  } else if (pattern === 'print') {
    shapes = '<rect width="46" height="28" fill="white"/><circle cx="12" cy="11" r="8" fill="#00ffff"/><circle cx="23" cy="17" r="8" fill="#ff00ff"/><circle cx="34" cy="10" r="8" fill="#ffff00"/><circle cx="23" cy="8" r="3" fill="#000"/>';
  } else if (pattern === 'bent') {
    shapes = colors.map((c,i)=>`<path d="M${9+i*12} 3h7l-4 11 4 11h-7l-4-11z" fill="${c}"/>`).join('');
  } else if (pattern === 'wrgb') {
    shapes = ['#f00','#fff','#00f','#0f0'].map((c,i)=>`<rect x="${4+i*10}" y="3" width="7" height="22" rx="2" fill="${c}"/>`).join('');
  } else if (pattern === 'sstripe') {
    shapes = '<rect x="7" y="3" width="15" height="10" rx="2" fill="#f00"/><rect x="7" y="15" width="15" height="10" rx="2" fill="#0f0"/><rect x="25" y="3" width="14" height="22" rx="2" fill="#00f"/>';
  } else if (pattern === 'slots') {
    shapes = Array.from({length:6},(_,i)=>`<rect x="${3+i*7}" y="${Math.floor(i/3)%2? -5:2}" width="5" height="13" rx="2" fill="${colors[i%3]}"/><rect x="${3+i*7}" y="${Math.floor(i/3)%2? 11:18}" width="5" height="13" rx="2" fill="${colors[i%3]}"/>`).join('');
  } else if (pattern === 'diamond') {
    shapes = '<path fill="#ff0000" d="M10 4l7 8-7 8-7-8z"/><path fill="#0000ff" d="M35 4l8 8-8 8-8-8z"/><path fill="#00ff00" d="M22 2l4 5-4 5-4-5zM22 15l4 5-4 5-4-5z"/>';
  } else if (pattern === 'triangle') {
    shapes = '<rect x="16" y="3" width="13" height="8" rx="3" fill="#00ff00"/><rect x="7" y="17" width="13" height="8" rx="3" fill="#ff0000"/><rect x="26" y="17" width="13" height="8" rx="3" fill="#0000ff"/>';
  } else if (pattern === 'dots') {
    shapes = '<circle cx="10" cy="10" r="6" fill="#ff0000"/><circle cx="23" cy="20" r="6" fill="#00ff00"/><circle cx="36" cy="10" r="6" fill="#0000ff"/>';
  } else {
    shapes = colors.map((color, i) => `<rect x="${7 + i * 12}" y="${pattern === 'grille' ? 0 : 3}" width="8" height="${pattern === 'grille' ? 28 : 22}" rx="2" fill="${color}"/>`).join('');
    if (pattern === 'chevron') shapes += '<path d="M7 9l4 3 4-3m4 0l4 3 4-3m4 0l4 3 4-3M7 17l4 3 4-3m4 0l4 3 4-3m4 0l4 3 4-3" fill="none" stroke="#1e2822" stroke-width="1.5"/>';
    if (pattern === 'grille') shapes += '<path d="M0 19h46" stroke="#1e2822" stroke-width="1"/>';
  }
  return `<svg viewBox="0 0 46 28" width="46" height="28" aria-hidden="true">${shapes}</svg>`;
}
