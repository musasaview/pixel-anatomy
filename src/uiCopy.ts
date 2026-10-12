import type { Language } from './locales';
export const uiCopy: Record<Language, { settings: string; auto: string; pin: string; unpin: string }> = {
  ja: { settings: '設定', auto: '自動（ブラウザの言語）', pin: '顕微鏡の表示をピン留め', unpin: 'ピン留めを解除' },
  en: { settings: 'Settings', auto: 'Automatic (browser language)', pin: 'Pin microscope readout', unpin: 'Unpin microscope readout' },
  'zh-CN': { settings: '设置', auto: '自动（浏览器语言）', pin: '固定显微镜信息', unpin: '取消固定' },
  ko: { settings: '설정', auto: '자동 (브라우저 언어)', pin: '현미경 정보 고정', unpin: '고정 해제' },
  es: { settings: 'Ajustes', auto: 'Automático (idioma del navegador)', pin: 'Fijar información del microscopio', unpin: 'Desfijar información' },
  fr: { settings: 'Réglages', auto: 'Automatique (langue du navigateur)', pin: 'Épingler les mesures', unpin: 'Détacher les mesures' },
  de: { settings: 'Einstellungen', auto: 'Automatisch (Browsersprache)', pin: 'Mikroskopanzeige anheften', unpin: 'Anzeige lösen' },
  pt: { settings: 'Configurações', auto: 'Automático (idioma do navegador)', pin: 'Fixar informações do microscópio', unpin: 'Desafixar informações' },
};

export function browserLanguage(languages: readonly string[]): Language {
  for (const locale of languages) {
    const base = locale.toLowerCase().split('-')[0];
    if (base === 'zh') return 'zh-CN';
    if (['ja', 'en', 'ko', 'es', 'fr', 'de', 'pt'].includes(base)) return base as Language;
  }
  return 'en';
}
