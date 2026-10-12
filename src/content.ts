import type { Translation, Language } from './locales';
import { panels } from './panels';
import { commonCopy } from './commonCopy';
import { education } from './education';
import { labCopy } from './labCopy';
import { displayCopy } from './displayCopy';
import { colorScale, geometryStudy } from './motifs';
import { pixelCopy } from './pixelCopy';
import { pixelArtURL } from './pixelArt';

export function escapeHTML(value: string) {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}

export function renderPage(t: Translation, language: Language) {
  const e = education[language], c = commonCopy[language], lab = labCopy[language], d = displayCopy[language];
  const text = escapeHTML;
  const families = (['lcd','oled','crt','print'] as const).map(family => {
    const members = panels.filter(panel => panel.tag.startsWith(family.toUpperCase()));
    return `<article class="display-family"><div class="family-copy"><h3>${text(d.families[family].title)}</h3><p>${text(d.families[family].body)}</p></div><div class="family-samples">${members.map(panel => `<figure class="layout-sample"><img class="panel-preview${panel.mode === 7 ? ' print-preview' : ''}" data-mode="${panel.mode}" width="640" height="320" alt="${text(d.modeNames[panel.mode])}"/><figcaption><strong>${text(d.modeNames[panel.mode] ?? (panel.mode === 7 ? c.print : t.panelNames[panel.mode as number]))}</strong><span>${text(d.modeDescriptions[panel.mode] ?? (panel.mode === 7 ? c.printBody : t.panelDescriptions[panel.mode as number]))}</span>${panel.mode === 7 ? '<small class="print-credit">Psiĥedelisto · Wikimedia Commons · CC0 1.0</small>' : ''}</figcaption></figure>`).join('')}</div></article>`;
  }).join('');
  return `
    <header class="site-header"><div class="wordmark">${text(t.site)}</div></header>
    <div class="page-content">
      <section class="feature">
        <div class="feature-copy"><h1>${text(lab.pixelTitle)}</h1><p class="dek">${text(lab.pixelBody)}</p><p>${text(lab.rgbBody)}</p><p>${text(lab.subpixelBody)}</p></div>
        <figure class="feature-image"><div class="light-stage" id="light-stage"><canvas id="light-canvas" role="img" aria-label="${text(lab.heroTitle)}"></canvas></div><figcaption><strong>${text(lab.heroTitle)}</strong><span>${text(lab.heroBody)}</span></figcaption></figure>
      </section>
      <section class="pixel-study"><div><h2>${text(pixelCopy[language].title)}</h2><p>${text(pixelCopy[language].body)}</p></div><figure><div class="pixel-art-frame"><img id="pixel-art" src="${pixelArtURL()}" width="320" height="240" alt="${text(pixelCopy[language].alt)}"/><div class="pixel-art-comparison"><span class="pixel-art-mode pixel-art-mode-top">PIXEL</span><span class="pixel-art-mode pixel-art-mode-bottom">LCD</span><img id="pixel-art-detail" class="pixel-art-detail" width="168" height="168" alt="${text(pixelCopy[language].alt)} — PIXEL / LCD"/></div></div></figure></section>
      <section class="reading-section display-section"><div class="section-label">02 / DISPLAYS</div><h2>${text(lab.displayTitle)}</h2>${families}<p class="model-note">${text(lab.modelNote)}</p></section>
      <aside class="reading-section subpixel-tip" id="pixel-explanation"><div class="tip-copy"><div class="section-label">TIPS</div><h3>${text(d.tipTitle)}</h3><p>${text(d.tipBody)}</p></div><div class="tip-samples"><figure><figcaption>${text(e.gray)}</figcaption><div class="text-image"><img id="gray-sample" alt="${text(e.gray)}" width="160" height="64"/></div><img id="pixel-text-detail" class="text-detail" width="168" height="144" alt="${text(e.gray)} · ${text(pixelCopy[language].detailTitle)}"/><img id="gray-lcd-detail" class="text-detail" width="168" height="144" alt="LCD · ${text(e.gray)}"/></figure><figure><figcaption>${text(e.color)}</figcaption><div class="text-image"><img id="color-sample" alt="${text(e.color)}" width="160" height="64"/></div><img id="lcd-text-detail" class="text-detail" width="168" height="144" alt="${text(e.color)} · ${text(pixelCopy[language].detailTitle)}"/><img id="color-lcd-detail" class="text-detail" width="168" height="144" alt="LCD · ${text(e.color)}"/></figure></div></aside>
      <section class="reading-section gallery-section"><h2>GALLERY</h2><div class="gallery-grid"><figure class="photo-figure"><img id="photo-sample" src="${import.meta.env.BASE_URL}images/cat.jpg" width="800" height="600" alt="${text(lab.catAlt)}"/><figcaption id="photo-credit">Roc0ast3r · Wikimedia Commons · CC0 1.0</figcaption></figure><figure class="gallery-pattern"><img id="color-scale" src="${colorScale}" width="800" height="480" alt="${text(lab.colorScaleAlt)}"/></figure><figure class="gallery-pattern"><img id="geometry-study" src="${geometryStudy}" width="800" height="480" alt="${text(d.geometryAlt)}"/></figure></div><div id="photo-actions-slot"></div></section>
      <footer class="site-footer"><span>© musasaview</span></footer>
    </div>`;
}
