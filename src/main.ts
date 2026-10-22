import { panelPreviews } from './panelPreviews';
import './style.css';
import { toCanvas } from 'html-to-image';
import { Interaction } from './interaction';
import { LCDRenderer } from './renderer';
import { panels, panelIcon } from './panels';
import type { Panel } from './panels';
import { languageNames, translations } from './locales';
import type { Language, Translation } from './locales';
import { escapeHTML, renderPage } from './content';
import { commonCopy, dotLabels } from './commonCopy';
import { education } from './education';
import { textSamples, textDetails } from './textSamples';
import { labCopy } from './labCopy';
import { displayCopy } from './displayCopy';
import { browserLanguage, uiCopy } from './uiCopy';
import { viewportWidth } from './viewport';
import { pixelCopy } from './pixelCopy';
import { pixelArt, pixelArtDetailURL } from './pixelArt';

const element = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const source = element<HTMLElement>('source-page');
const canvas = element<HTMLCanvasElement>('display');
const status = element<HTMLElement>('status');
const languageSelect = element<HTMLSelectElement>('language-select');
let localImage: string | null = null;
let imageBusy = false;
let languagePreference = 'auto';
try {
  const saved = localStorage.getItem('pixel-atlas-language');
  if (saved === 'auto' || saved && Object.hasOwn(languageNames, saved)) languagePreference = saved;
} catch { /* Optional browser storage. */ }
let language: Language = languagePreference === 'auto'
  ? browserLanguage(navigator.languages.length ? navigator.languages : [navigator.language])
  : languagePreference as Language;
let t = translations[language];
let activePanel: Panel = panels.find(panel => panel.id === 'lcd')!;
let decimals = new Intl.NumberFormat(language, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });
let tenths = new Intl.NumberFormat(language, { minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: false });

function setText(id: string, text: string) { element(id).textContent = text; }
function panelName(panel: Panel) {
  return panel.mode === 11 ? pixelCopy[language].name : panel.mode === 7 ? commonCopy[language].print
    : (displayCopy[language].modeNames[panel.mode] ?? t.panelNames[panel.mode as number]);
}
function updatePanelUI() {
  document.title = t.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', commonCopy[language].intro);
  setText('emitter-label', activePanel.mode === 11 ? pixelCopy[language].unitLabel : activePanel.mode === 7 ? dotLabels[language] : t.metrics[3]);
  setText('panel-name', panelName(activePanel));
  const groups = ['PIXEL', 'LCD', 'OLED', 'CRT', 'CMYK'];
  element('panel-options').innerHTML = groups.map(group => {
    const members = panels.filter(panel => panel.tag.startsWith(group === 'CMYK' ? 'PRINT' : group));
    return `<div class="panel-icon-group" role="group" aria-label="${group}"><span class="panel-group-label">${group}</span><div>${members.map(panel => {
      const name = panelName(panel);
      return `<button class="panel-icon-button" data-panel="${panel.id}" title="${escapeHTML(name)}" aria-label="${escapeHTML(name)}" aria-pressed="${panel.mode === activePanel.mode}">${panelIcon(panel.pattern)}</button>`;
    }).join('')}</div></div>`;
  }).join('');

}

function applyLanguage() {
  t = translations[language];
  decimals = new Intl.NumberFormat(language, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });
  tenths = new Intl.NumberFormat(language, { minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: false });
  document.documentElement.lang = language;
  source.innerHTML = renderPage(t, language);
  if (localImage) {
    element<HTMLImageElement>('photo-sample').src = localImage;
    element<HTMLImageElement>('photo-sample').alt = labCopy[language].ownImage;
    setText('photo-credit', '');
  }
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(node => {
    const key = node.dataset.i18n as keyof Translation;
    const value = t[key];
    if (typeof value === 'string') node.textContent = value;
  });
  setText('choose-image', labCopy[language].chooseImage);
  element('choose-image').title = labCopy[language].localNote;
  setText('restore-cat', labCopy[language].restoreCat);
  element('restore-cat').hidden = !localImage;
  languageSelect.value = languagePreference;
  languageSelect.options[0].textContent = uiCopy[language].auto;
  setText('settings-title', uiCopy[language].settings);
  element('settings-toggle').setAttribute('aria-label', uiCopy[language].settings);
  languageSelect.setAttribute('aria-label', t.language);
  element('help-body').textContent = `${education[language].scrollHelp} · ${education[language].zoomHelp}`;
  ['distance-label', 'pixel-label', 'emitter-label'].forEach((id, i) => setText(id, t.metrics[i + 1]));
  element('distance-label').title = t.distanceTip;
  element('instrument').setAttribute('aria-label', t.microscope);
  canvas.setAttribute('aria-label', `${t.microscope}. ${education[language].scrollHelp}. ${education[language].zoomHelp}. R: ${t.reset}`);
  element('zoom-in').setAttribute('aria-label', t.zoomIn);
  element('zoom-out').setAttribute('aria-label', t.zoomOut);
  element('reset').title = t.reset;
  element('reset').setAttribute('aria-label', t.reset);
  element('help-shortcuts').innerHTML = `<dt>${escapeHTML(education[language].scrollHelp)}</dt><dd>↕</dd>` + t.helpKeys.map((key, i) => `<dt>${escapeHTML(i === 0 ? 'Ctrl + ' + key : key)}</dt><dd>${escapeHTML(t.helpActions[i])}</dd>`).join('');
  updatePanelUI();
}

languageSelect.innerHTML = '<option value="auto"></option>' + Object.entries(languageNames).map(([code, name]) => `<option value="${code}" lang="${code}">${name}</option>`).join('');
applyLanguage();

async function start() {
  const renderer = new LCDRenderer(canvas);
  const interaction = new Interaction(canvas);
  const compactTouch = matchMedia('(pointer:coarse) and (max-width:960px)');
  const metrics = document.querySelector<HTMLElement>('.microscope-metrics')!;
  const hud = document.querySelector<HTMLElement>('.microscope-hud')!;
  const placeMetrics = () => {
    if (compactTouch.matches) element('settings-popover').append(metrics);
    else hud.append(metrics);
  };
  compactTouch.addEventListener('change', placeMetrics);
  placeMetrics();
  const photoControls = element('photo-controls');
  const fileInput = element<HTMLInputElement>('local-image-input');
  const updateImageControls = () => {
    element<HTMLButtonElement>('choose-image').disabled = imageBusy;
    element<HTMLButtonElement>('restore-cat').disabled = imageBusy;
  };
  let photoRect = { x: 0, y: 0, width: 0 };
  const motionButton = element<HTMLButtonElement>('motion-toggle');
  const updateMotionUI = () => {
    motionButton.textContent = renderer.paused ? '▶' : 'Ⅱ';
    motionButton.title = renderer.paused ? labCopy[language].play : labCopy[language].pause;
    motionButton.setAttribute('aria-label', motionButton.title);
    motionButton.setAttribute('aria-pressed', String(renderer.paused));
  };
  const placePhotoControls = () => {
    const y = photoRect.y-interaction.view.y+innerHeight/2;
    photoControls.hidden = interaction.view.zoom !== 1 || !canvas.classList.contains('ready') || y < -80 || y > innerHeight;
    if (photoControls.hidden) return;
    photoControls.style.transform = 'translate('+photoRect.x+'px,'+y+'px)';
    photoControls.style.width = photoRect.width+'px';
  };
  element('choose-image').addEventListener('click', () => fileInput.click());
  element('restore-cat').addEventListener('click', () => {
    localImage = null;
    fileInput.value = '';
    applyLanguage();
    void capture();
  });
  motionButton.addEventListener('click', () => { renderer.toggleMotion(); updateMotionUI(); requestRender(); });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file || imageBusy) return;
    imageBusy = true;
    updateImageControls();
    status.textContent = labCopy[language].imageBusy;
    try {
      // Decode a local File, then flatten it to bounded pixels. No network or storage.
      if (!/^image\/(jpeg|png|webp|gif|bmp|avif)$/.test(file.type)) throw new Error('Unsupported image');
      const bitmap = await createImageBitmap(file);
      const ratio = Math.min(1,2048/Math.max(bitmap.width,bitmap.height));
      const preview = document.createElement('canvas');
      preview.width = Math.max(1,Math.round(bitmap.width*ratio));
      preview.height = Math.max(1,Math.round(bitmap.height*ratio));
      const ctx = preview.getContext('2d')!;
      ctx.fillStyle = '#f8f8f3';
      ctx.fillRect(0,0,preview.width,preview.height);
      ctx.drawImage(bitmap,0,0,preview.width,preview.height);
      bitmap.close();
      localImage = preview.toDataURL('image/png');
      applyLanguage();
      await capture();
    } catch {
      status.textContent = labCopy[language].imageError;
    } finally {
      imageBusy = false;
      updateImageControls();
      fileInput.value = '';
    }
  });
  let frame = 0;
  let previousTime = 0;
  let lastHUD = '';
  let snapshot: HTMLCanvasElement | null = null;
  let snapshotLayout = { width: 0, height: 0, pixelRatio: 0 };
  let snapshotRegions: { element: HTMLElement; x: number; y: number; width: number; height: number }[] = [];
  let capturing = false;
  let recapture: boolean | null = null;
  let captureRevision = 0;
  const zoomValue = element<HTMLOutputElement>('zoom-value');
  const distanceValue = element<HTMLOutputElement>('distance-value');
  const pixelValue = element<HTMLOutputElement>('pixel-value');
  const subpixelValue = element<HTMLOutputElement>('subpixel-value');

  const updateHUD = () => {
    const zoom = interaction.view.zoom;
    const pixel = zoom / renderer.sourceScale;
    const value = zoom.toFixed(2);
    document.body.classList.toggle('zoomed', zoom > 1.15);
    document.body.classList.toggle('native-view', zoom === 1);
    const key = `${language}:${activePanel.mode}:${renderer.sourceScale}:${value}`;
    if (lastHUD === key) return;
    lastHUD = key;
    zoomValue.innerHTML = `${decimals.format(zoom)}<span>×</span>`;
    pixelValue.innerHTML = `${decimals.format(pixel)} <small>px</small>`;
    subpixelValue.innerHTML = `${decimals.format(pixel * activePanel.metricScale)} <small>px</small>`;
    const mm = 600 / zoom;
    distanceValue.innerHTML = mm >= 10 ? `${tenths.format(mm / 10)} <small>cm</small>`
      : mm >= 1 ? `${decimals.format(mm)} <small>mm</small>` : `${Math.round(mm * 1000)} <small>μm</small>`;
  };

  const tick = (time: number) => {
    frame = 0;
    const dt = previousTime ? Math.min((time - previousTime) / 1000, .05) : 1 / 60;
    previousTime = time;
    const moving = interaction.update(dt);
    if (snapshot) renderer.render(interaction.view);
    updateHUD();
    placePhotoControls();
    if (moving || renderer.transitioning || renderer.animationVisible(interaction.view)) frame = requestAnimationFrame(tick);
    else previousTime = 0;
  };
  const requestRender = () => { if (!frame) frame = requestAnimationFrame(tick); };
  interaction.onChange = requestRender;

  const measureRegions = () => [source, ...source.querySelectorAll<HTMLElement>('header, section, aside, figure, img, h1, h2, h3, p, #light-stage, footer')]
    .map(element => {
      const rect = element.getBoundingClientRect();
      return { element, x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height };
    })
    .filter(rect => rect.width > 0 && rect.height > 0)
    .sort((a, b) => a.width * a.height - b.width * b.height);

  const resizedCenter = () => {
    const { x, y } = interaction.view;
    // Prefer the image under the microscope to its containing section or page.
    const region = snapshotRegions.find(rect => rect.element.isConnected
      && x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height);
    if (!region) return;
    const rect = region.element.getBoundingClientRect();
    return {
      x: rect.left + scrollX + (x - region.x) / region.width * rect.width,
      y: rect.top + scrollY + (y - region.y) / region.height * rect.height,
    };
  };

  async function capture(preserveView = false) {
    const revision = ++captureRevision;
    if (capturing) { recapture = preserveView; return; }
    capturing = true;
    status.textContent = t.loading;
    try {
      // Force layout before waiting for the selected language’s fonts to settle.
      source.getBoundingClientRect();
      await document.fonts.ready;
      // Leave the footer reachable even when the mode buttons wrap on small screens.
      source.style.paddingBottom = `${Math.ceil(element('instrument').getBoundingClientRect().height+56)}px`;
      const artImage = element<HTMLImageElement>('pixel-art');
      await artImage.decode();
      element<HTMLImageElement>('pixel-art-detail').src = pixelArtDetailURL(artImage);
      const screenRatio = window.devicePixelRatio || 1;
      artImage.style.width = `${Math.min(artImage.naturalWidth/screenRatio, artImage.parentElement!.clientWidth-22)}px`;
      artImage.style.height = 'auto';
      artImage.style.transform = '';
      const artBox = artImage.getBoundingClientRect();
      artImage.style.transform = `translate(${Math.round(artBox.left*screenRatio)/screenRatio-artBox.left}px,${Math.round((artBox.top+scrollY)*screenRatio)/screenRatio-(artBox.top+scrollY)}px)`;
      const width = viewportWidth();
      const height = Math.ceil(source.getBoundingClientRect().height);
      const ratio = Math.min(window.devicePixelRatio || 1, 2, renderer.maxTextureSize / Math.max(width, height), Math.sqrt(32_000_000 / (width * height)));
      const previews = await panelPreviews();
      source.querySelectorAll<HTMLImageElement>('.panel-preview').forEach(image => {
        image.src = previews.get(Number(image.dataset.mode))!;
      });
      const samples = textSamples(ratio);
      element<HTMLImageElement>('gray-sample').src = samples.gray;
      element<HTMLImageElement>('color-sample').src = samples.color;
      const details = textDetails();
      element<HTMLImageElement>('pixel-text-detail').src = details.pixel;
      element<HTMLImageElement>('lcd-text-detail').src = details.lcd;
      element<HTMLImageElement>('gray-lcd-detail').src = details.grayLcd;
      element<HTMLImageElement>('color-lcd-detail').src = details.colorLcd;
      await Promise.all([...source.querySelectorAll('img')].map(image => image.decode()));
      // Capture a bounded full article only when its content changes. Native
      // scrolling and zoom move the camera; animation is entirely shader-driven.
      const nextSnapshot = await toCanvas(source, {
        width, height, pixelRatio: ratio, backgroundColor: '#f8f8f3',
        style: { visibility: 'visible', opacity: '1', height: `${height}px`, minHeight: '0px' },
      });
      if (revision !== captureRevision) return; // Discard a stale language/resize.
      // Bypass DOM interpolation for the AA comparison. Each source sample lands
      // on exactly one texture texel, whose R/G/B drive one simulated LCD cell.
      const ctx = nextSnapshot.getContext('2d')!;
      const sx = nextSnapshot.width/width, sy = nextSnapshot.height/height;
      const alignedSamples = textSamples(sx);
      for (const [id, image] of [['gray-sample',alignedSamples.grayCanvas],['color-sample',alignedSamples.colorCanvas]] as const) {
        const rect = element(id).getBoundingClientRect();
        const clip = element(id).parentElement!.getBoundingClientRect();
        ctx.save();
        ctx.beginPath();
        ctx.rect(Math.round(clip.left*sx)+1,Math.round((clip.top+window.scrollY)*sy)+1,Math.floor(clip.width*sx)-2,Math.floor(clip.height*sy)-2);
        ctx.clip();
        ctx.drawImage(image,Math.round(rect.left*sx),Math.round((rect.top+window.scrollY)*sy));
        ctx.restore();
      }
      snapshot = nextSnapshot;
      snapshotLayout = { width, height, pixelRatio: screenRatio };
      renderer.upload(snapshot, width, height);
      const artRect = artImage.getBoundingClientRect();
      renderer.setPixelArt(pixelArt(artImage), [artRect.left+scrollX, artRect.top+scrollY, artRect.width, artRect.height]);
      renderer.resize();
      const lightRect = element('light-stage').getBoundingClientRect();
      renderer.setAnimationCanvas(element<HTMLCanvasElement>('light-canvas'));
      renderer.setAnimationRect([lightRect.left+window.scrollX, lightRect.top+window.scrollY, lightRect.width, lightRect.height]);
      const printRect = source.querySelector<HTMLImageElement>('.print-preview')!.getBoundingClientRect();
      renderer.setPrintPhotoRect([printRect.left+window.scrollX, printRect.top+window.scrollY, printRect.width, printRect.height]);
      const slot = element('photo-actions-slot').getBoundingClientRect();
      photoRect = { x: slot.left+window.scrollX, y: slot.top+window.scrollY, width: slot.width };
      const center = preserveView ? resizedCenter() : undefined;
      interaction.setContentSize(width, height);
      if (preserveView) interaction.resize(center);
      else interaction.reset(true);
      snapshotRegions = measureRegions();
      lastHUD = '';
      requestRender();
      canvas.classList.add('ready');
      source.classList.add('captured');
      updateMotionUI();
      placePhotoControls();
      status.textContent = '';
    } catch (error) {
      if (revision !== captureRevision) return;
      status.textContent = t.captureError;
      if (!snapshot) {
        source.classList.remove('captured');
        source.removeAttribute('inert');
      }
      console.error(error);
    } finally {
      capturing = false;
      if (recapture !== null) {
        const preserveNextView = recapture;
        recapture = null;
        void capture(preserveNextView);
      }
    }
  }

  const closeMenu = () => {
    const menu = element('settings-popover');
    if (menu.contains(document.activeElement)) element('settings-toggle').focus({ preventScroll: true });
    menu.hidden = true;
    element('settings-toggle').setAttribute('aria-expanded', 'false');
  };
  element('settings-toggle').addEventListener('click', () => {
    const menu = element('settings-popover');
    menu.hidden = !menu.hidden;
    element('settings-toggle').setAttribute('aria-expanded', String(!menu.hidden));
    if (!menu.hidden) languageSelect.focus({ preventScroll: true });
  });
  element('panel-options').addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-panel]');
    if (!button) return;
    activePanel = panels.find(panel => panel.id === button.dataset.panel)!;
    renderer.setPanel(activePanel.mode);
    updatePanelUI();
    element<HTMLButtonElement>('panel-options').querySelector<HTMLButtonElement>(`[data-panel="${activePanel.id}"]`)?.focus({ preventScroll: true });
    requestRender();
  });
  document.addEventListener('pointerdown', event => {
    if (!(event.target as Element).closest('#instrument')) closeMenu();
  });
  languageSelect.addEventListener('change', () => {
    languagePreference = languageSelect.value;
    language = languagePreference === 'auto' ? browserLanguage(navigator.languages) : languagePreference as Language;
    try { localStorage.setItem('pixel-atlas-language', languagePreference); } catch { /* Optional. */ }
    applyLanguage();
    closeMenu();
    requestRender();
    void capture();
  });
  element('zoom-in').addEventListener('click', () => interaction.setZoom(interaction.targetZoom * 1.8));
  element('zoom-out').addEventListener('click', () => interaction.setZoom(interaction.targetZoom / 1.8));
  element('reset').addEventListener('click', () => interaction.reset());
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      element<HTMLDetailsElement>('shortcut-details').open = false;
    }
    if (event.code === 'Space' && event.target === canvas) {
      event.preventDefault(); renderer.toggleMotion(); updateMotionUI(); requestRender();
    }
  });
  window.addEventListener('languagechange', () => {
    if (languagePreference !== 'auto') return;
    language = browserLanguage(navigator.languages);
    applyLanguage();
    void capture();
  });
  window.addEventListener('scroll', () => interaction.scrollTo(window.scrollY), { passive: true });
  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    renderer.resize();
    interaction.resize();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // A viewport height change may leave the article layout unchanged.
      // Reuse its texture unless the actual source layout or pixel density changed.
      if (snapshot
        && snapshotLayout.width === viewportWidth()
        && snapshotLayout.height === Math.ceil(source.getBoundingClientRect().height)
        && snapshotLayout.pixelRatio === (devicePixelRatio || 1)) return;
      void capture(true);
    }, 200);
  });
  renderer.onRestore = () => {
    if (snapshot) renderer.upload(snapshot);
    renderer.resize();
    requestRender();
    status.textContent = '';
  };
  canvas.addEventListener('webglcontextlost', () => { status.textContent = t.gpuLost; });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) requestRender(); });
  await capture();
}

start().catch(error => {
  status.textContent = error instanceof Error && error.message === 'WebGL2' ? t.webglError : t.captureError;
  canvas.style.display = 'none';
  console.error(error);
});
