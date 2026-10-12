import type { Language } from './locales';

type PixelCopy = {
  name: string;
  title: string;
  body: string;
  caption: string;
  alt: string;
  unitLabel: string;
  detailTitle: string;
  pixelView: string;
  lcdView: string;
};

export const pixelCopy: Record<Language, PixelCopy> = {
  ja: {
    name: 'ピクセル',
    title: '小さな点が、絵になる',
    body: 'デジタル画像は、色を持つ小さな点「ピクセル」が縦横に並んでできています。ひとつひとつの色と位置を変えると、細い線や曲線、表情まで描けます。',
    caption: '320 × 240 px · ドットバイドット',
    alt: '猫が主人公の横スクロールアクションゲームの画像',
    unitLabel: 'ピクセル幅',
    detailTitle: '同じ文字の輪郭 · 拡大図',
    pixelView: 'PIXEL：画素の色',
    lcdView: 'LCD：RGBの帯',
  },
  en: {
    name: 'Pixel',
    title: 'Small dots come together to make a picture',
    body: 'A digital image is made of tiny colored dots called pixels, arranged in rows and columns. Changing the color and position of each one can draw fine lines, curves, and even expressions.',
    caption: '320 × 240 px · 1:1 pixels',
    alt: 'Image from a side-scrolling action game starring a cat',
    unitLabel: 'Pixel width',
    detailTitle: 'The same letter outline · enlarged',
    pixelView: 'PIXEL: pixel colors',
    lcdView: 'LCD: RGB stripes',
  },
  'zh-CN': {
    name: '像素',
    title: '小点汇聚成图画',
    body: '数字图像由称为“像素”的彩色小点纵横排列而成。改变每个点的颜色和位置，就能画出细线、曲线，甚至表情。',
    caption: '320 × 240 像素 · 1:1 像素',
    alt: '以猫为主角的横向卷轴动作游戏图片',
    unitLabel: '像素宽度',
    detailTitle: '同一字母的轮廓 · 放大图',
    pixelView: 'PIXEL：像素颜色',
    lcdView: 'LCD：RGB条纹',
  },
  ko: {
    name: '픽셀',
    title: '작은 점이 모여 그림이 됩니다',
    body: '디지털 이미지는 ‘픽셀’이라 부르는 작은 색점이 가로세로로 배열되어 만들어집니다. 각 점의 색과 위치를 바꾸면 가는 선과 곡선, 표정까지 그릴 수 있습니다.',
    caption: '320 × 240 px · 1:1 픽셀',
    alt: '고양이가 주인공인 횡스크롤 액션 게임 이미지',
    unitLabel: '픽셀 너비',
    detailTitle: '같은 글자 윤곽 · 확대 보기',
    pixelView: 'PIXEL: 픽셀 색상',
    lcdView: 'LCD: RGB 줄무늬',
  },
  es: {
    name: 'Píxel',
    title: 'Pequeños puntos que forman una imagen',
    body: 'Una imagen digital está formada por pequeños puntos de color llamados píxeles, dispuestos en filas y columnas. Al cambiar el color y la posición de cada uno, se pueden dibujar líneas finas, curvas e incluso expresiones.',
    caption: '320 × 240 px · píxeles 1:1',
    alt: 'Imagen de un juego de acción de desplazamiento lateral protagonizado por un gato',
    unitLabel: 'Ancho del píxel',
    detailTitle: 'El contorno de la misma letra · ampliado',
    pixelView: 'PIXEL: color de los píxeles',
    lcdView: 'LCD: franjas RGB',
  },
  fr: {
    name: 'Pixel',
    title: 'De petits points qui forment une image',
    body: 'Une image numérique est composée de petits points colorés appelés pixels, disposés en lignes et en colonnes. En changeant la couleur et la position de chacun, on peut dessiner des traits fins, des courbes et même des expressions.',
    caption: '320 × 240 px · pixels 1:1',
    alt: 'Image d’un jeu d’action à défilement horizontal dont le héros est un chat',
    unitLabel: 'Largeur du pixel',
    detailTitle: 'Contour de la même lettre · agrandi',
    pixelView: 'PIXEL : couleur des pixels',
    lcdView: 'LCD : bandes RGB',
  },
  de: {
    name: 'Pixel',
    title: 'Kleine Punkte ergeben ein Bild',
    body: 'Ein digitales Bild besteht aus kleinen farbigen Punkten, den Pixeln, die in Zeilen und Spalten angeordnet sind. Ändert man Farbe und Position jedes Punkts, lassen sich feine Linien, Kurven und sogar Gesichtsausdrücke zeichnen.',
    caption: '320 × 240 px · Pixel 1:1',
    alt: 'Bild aus einem seitlich scrollenden Actionspiel mit einer Katze als Hauptfigur',
    unitLabel: 'Pixelbreite',
    detailTitle: 'Umriss desselben Buchstabens · vergrößert',
    pixelView: 'PIXEL: Pixelfarben',
    lcdView: 'LCD: RGB-Streifen',
  },
  pt: {
    name: 'Pixel',
    title: 'Pequenos pontos que formam uma imagem',
    body: 'Uma imagem digital é formada por pequenos pontos coloridos chamados pixels, dispostos em linhas e colunas. Ao mudar a cor e a posição de cada um, é possível desenhar linhas finas, curvas e até expressões.',
    caption: '320 × 240 px · pixels 1:1',
    alt: 'Imagem de um jogo de ação de deslocamento lateral protagonizado por um gato',
    unitLabel: 'Largura do pixel',
    detailTitle: 'Contorno da mesma letra · ampliado',
    pixelView: 'PIXEL: cor dos pixels',
    lcdView: 'LCD: faixas RGB',
  },
};
