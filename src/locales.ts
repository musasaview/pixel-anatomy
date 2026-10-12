export const languageNames = {
    ja: '日本語', en: 'English', 'zh-CN': '简体中文', ko: '한국어',
    es: 'Español', fr: 'Français', de: 'Deutsch', pt: 'Português',
} as const;
export type Language = keyof typeof languageNames;
export interface Translation {
    title: string;
    site: string;
    footer: string;
    microscope: string;
    metrics: [
        string,
        string,
        string,
        string
    ];
    distanceTip: string;
    stages: [
        string,
        string,
        string,
        string,
        string
    ];
    scale: [
        string,
        string,
        string,
        string,
        string
    ];
    reset: string;
    controls: [
        string,
        string,
        string,
        string
    ];
    helpKeys: [
        string,
        string,
        string,
        string,
        string,
        string
    ];
    helpActions: [
        string,
        string,
        string,
        string,
        string,
        string
    ];
    approximation: string;
    loading: string;
    captureError: string;
    gpuLost: string;
    webglError: string;
    panelLabel: string;
    panelNames: [
        string,
        string,
        string,
        string,
        string,
        string,
        string
    ];
    panelDescriptions: [
        string,
        string,
        string,
        string,
        string,
        string,
        string
    ];
    language: string;
    zoomIn: string;
    zoomOut: string;
    helpLabel: string;
}
export const translations: Record<Language, Translation> = {
    ja: {
        title: 'ピクセルの中身を覗く', site: 'ピクセルの中身を覗く',
        footer: '見ることは、小さな発見の始まり。', microscope: 'ディスプレイ顕微鏡',
        metrics: ['拡大倍率', '観察距離（目安）', '基準画素ピッチ', '色の区画の幅（目安）'], distanceTip: '距離は説明用の目安で、実際の測定値ではありません。',
        stages: ['いつもの画面', '画素が見える', '色の構造', '色の区画', '顕微鏡の世界'], scale: ['ページ', '画素', '色の構造', '色の区画', '顕微鏡'],
        reset: 'リセット', controls: ['スクロールで拡大', 'ドラッグで移動', 'ダブルクリックで近づく', 'Shift＋ダブルクリック／右クリックで離れる'],
        helpKeys: ['ホイール／トラックパッド', 'ドラッグ／矢印キー', 'ダブルクリック／＋', 'Shift＋ダブルクリック／−', '右クリック', 'R／0'],
        helpActions: ['カーソルを中心に拡大', '画面を移動', '近づく', '離れる', '離れる', '最初の表示に戻る'],
        approximation: '各方式の代表的な構造を模したモデルです。寸法・配列は製品や世代により異なります。CRTの蛍光体と画像の画素は、厳密な1対1対応ではありません。',
        loading: '画面を準備しています…', captureError: 'ページを読み込めませんでした。再読み込みしてください。', gpuLost: 'GPUへの接続を待っています…', webglError: 'WebGL2が使えるブラウザで開いてください。',
        panelLabel: '観察するパネル',
        panelNames: ['LCD・RGBストライプ', 'OLED・ダイヤモンドPenTile', 'CRT・シャドーマスク', 'CRT・アパーチャーグリル', 'LCD・VAマルチドメイン', 'OLED・RGBストライプ', 'QD-OLED・三角RGB'],
        panelDescriptions: [
            'バックライトの光を液晶で調整。縦に並ぶRGBと、光を遮るブラックマトリクスが見えます。',
            '有機EL素子が自ら発光。緑を多く配置し、赤と青を共有するRG／BGの格子。大きさの違う菱形の発光領域を観察できます。',
            '電子線がRGBの蛍光体ドットを光らせるブラウン管。千鳥状のドット配列、走査線、柔らかな発光が特徴です。',
            'ブラウン管の縦長の蛍光体ストライプ。水平方向の走査線と、グリルを支える細いダンパー線も見えます。',
            '液晶の向きを複数の領域に分けるVA方式の一例。RGBの内部に、山形の電極・スリット構造が現れます。',
            '独立したRGBの有機EL素子を縦に配置。液晶のバックライトとは異なり、暗い部分では素子自体がほとんど光りません。',
            '青色OLEDの光を量子ドットで赤・緑に変換。緑を上、赤と青を下に置く三角形の配置を模しています。',
        ], language: '表示言語', zoomIn: '拡大', zoomOut: '縮小', helpLabel: '操作の説明'
    },
    en: {
        title: 'Inside the Pixel', site: 'Inside the Pixel',
        footer: 'Every discovery starts with a closer look.', microscope: 'DISPLAY MICROSCOPE',
        metrics: ['MAGNIFICATION', 'VIEWING DISTANCE ≈', 'REFERENCE PIXEL PITCH', 'COLOR AREA WIDTH ≈'], distanceTip: 'An illustrative distance, not a physical measurement.', stages: ['SURFACE VIEW', 'RASTER PIXELS', 'COLOR STRUCTURE', 'COLOR AREAS', 'MICROSCOPIC VIEW'], scale: ['PAGE', 'PIXELS', 'COLOR', 'COLOR AREAS', 'MICROSCOPIC'],
        reset: 'Reset', controls: ['Scroll to zoom', 'Drag to pan', 'Double-click to dive in', 'Shift + double-click / right-click to pull back'],
        helpKeys: ['Wheel / trackpad', 'Drag / arrow keys', 'Double-click / +', 'Shift + double-click / −', 'Right-click', 'R / 0'], helpActions: ['Zoom at the cursor', 'Pan the screen', 'Zoom in', 'Zoom out', 'Zoom out', 'Reset view'],
        approximation: 'Representative structures, not measurements of a specific product. Layouts vary by model and generation. CRT phosphors do not correspond exactly one-to-one with image pixels.',
        loading: 'Preparing the display…', captureError: 'Could not capture the page. Please reload.', gpuLost: 'Waiting for the GPU to reconnect…', webglError: 'Please use a browser with WebGL2 enabled.', panelLabel: 'DISPLAY PANEL',
        panelNames: ['LCD · RGB stripe', 'OLED · Diamond PenTile', 'CRT · Shadow mask', 'CRT · Aperture grille', 'LCD · Multi-domain VA', 'OLED · RGB stripe', 'QD-OLED · Triangle RGB'],
        panelDescriptions: ['Liquid crystals regulate a backlight. Vertical RGB apertures are separated by a light-blocking black matrix.', 'Self-emitting organic LEDs. An RG/BG lattice has more green emitters and shares red and blue. Notice the diamond shapes and different emitter sizes.', 'An electron beam excites RGB phosphor dots. Staggered dot triads, scan lines, and soft phosphor glow distinguish this CRT model.', 'Vertical phosphor stripes in a CRT, with horizontal scan lines and fine damper wires that support the grille.', 'A representative VA LCD divides liquid-crystal alignment into domains. Chevron electrode slits appear inside the RGB apertures.', 'Independent RGB organic LEDs in vertical stripes. Unlike a backlit LCD, the emitters themselves produce almost no light in dark areas.', 'Blue OLED light is converted to red and green by quantum dots. This model places green above red and blue in a triangular arrangement.'],
        language: 'Language', zoomIn: 'Zoom in', zoomOut: 'Zoom out', helpLabel: 'Show controls'
    },
    'zh-CN': {
        title: '像素之内', site: '像素之内',
        footer: '每一个发现，都从仔细观察开始。',
        microscope: '显示器显微镜', metrics: ['放大倍率', '观察距离（约）', '参考像素间距', '色彩区域宽度（约）'], distanceTip: '距离仅供说明，并非实际测量值。', stages: ['日常屏幕', '栅格像素', '色彩结构', '色彩区域', '显微世界'], scale: ['页面', '像素', '色彩', '色彩区域', '显微'],
        reset: '重置', controls: ['滚动缩放', '拖动平移', '双击靠近', 'Shift＋双击／右键拉远'], helpKeys: ['滚轮／触控板', '拖动／方向键', '双击／＋', 'Shift＋双击／−', '右键', 'R／0'], helpActions: ['以光标为中心缩放', '平移屏幕', '放大', '缩小', '缩小', '恢复初始视图'],
        approximation: '这些是代表性结构的模型，并非特定产品的精确测量。不同型号和世代的排列有所不同。CRT荧光体与图像像素并非严格一一对应。', loading: '正在准备屏幕…', captureError: '无法捕获页面，请重新加载。', gpuLost: '正在等待GPU重新连接…', webglError: '请使用支持WebGL2的浏览器。', panelLabel: '观察的面板',
        panelNames: ['LCD · RGB条纹', 'OLED · 菱形PenTile', 'CRT · 荫罩式', 'CRT · 孔栅式', 'LCD · 多畴VA', 'OLED · RGB条纹', 'QD-OLED · 三角RGB'],
        panelDescriptions: ['液晶调节背光。纵向RGB发光区域之间，是阻挡光线的黑矩阵。', '有机发光二极管自行发光。RG／BG格子中绿色元素更多，红色和蓝色共享。可观察大小不同的菱形发光区域。', '电子束激发RGB荧光体圆点。交错排列的点阵、扫描线和柔和的发光是其特点。', 'CRT中的纵向荧光体条纹，同时呈现水平扫描线和支撑栅格的细阻尼线。', '一种多畴VA液晶结构。RGB区域内部可见人字形电极与狭缝。', '独立的RGB有机发光元素纵向排列。与背光LCD不同，暗处的元素自身几乎不发光。', '量子点把蓝色OLED的光转换为红光和绿光。模型采用绿色在上、红蓝在下的三角排列。'],
        language: '语言', zoomIn: '放大', zoomOut: '缩小', helpLabel: '操作说明'
    },
    ko: {
        title: '픽셀 속으로', site: '픽셀 속으로',
        footer: '작은 발견은 자세히 보는 데서 시작됩니다.', microscope: '디스플레이 현미경', metrics: ['확대 배율', '관찰 거리 ≈', '기준 픽셀 간격', '색 영역 폭 ≈'], distanceTip: '설명을 위한 거리이며 실제 측정값이 아닙니다.', stages: ['익숙한 화면', '래스터 픽셀', '색의 구조', '색 영역', '현미경의 세계'], scale: ['페이지', '픽셀', '색', '색 영역', '현미경'],
        reset: '초기화', controls: ['스크롤로 확대', '드래그로 이동', '더블클릭으로 다가가기', 'Shift＋더블클릭／우클릭으로 멀어지기'], helpKeys: ['휠／트랙패드', '드래그／방향키', '더블클릭／＋', 'Shift＋더블클릭／−', '우클릭', 'R／0'], helpActions: ['커서를 중심으로 확대', '화면 이동', '확대', '축소', '축소', '처음으로 돌아가기'],
        approximation: '대표적인 구조를 모사한 모델입니다. 제품과 세대에 따라 크기와 배열이 다릅니다. CRT의 형광체와 이미지 픽셀은 정확한 일대일 관계가 아닙니다.', loading: '화면을 준비하고 있습니다…', captureError: '페이지를 불러올 수 없습니다. 새로고침해 주세요.', gpuLost: 'GPU 재연결을 기다리고 있습니다…', webglError: 'WebGL2를 지원하는 브라우저를 사용해 주세요.', panelLabel: '관찰할 패널',
        panelNames: ['LCD · RGB 스트라이프', 'OLED · 다이아몬드 PenTile', 'CRT · 섀도 마스크', 'CRT · 애퍼처 그릴', 'LCD · 멀티도메인 VA', 'OLED · RGB 스트라이프', 'QD-OLED · 삼각 RGB'], panelDescriptions: ['액정이 백라이트를 조절합니다. 수직 RGB 영역 사이에 빛을 차단하는 블랙 매트릭스가 있습니다.', '유기 LED가 스스로 빛을 냅니다. RG／BG 격자는 초록 요소가 더 많고 빨강과 파랑을 공유합니다. 크기가 다른 마름모 발광 영역을 살펴보세요.', '전자빔이 RGB 형광체 점을 발광시킵니다. 엇갈린 점 배열, 주사선, 부드러운 발광이 특징입니다.', 'CRT의 수직 형광체 줄무늬. 수평 주사선과 그릴을 지탱하는 가느다란 댐퍼 와이어도 보입니다.', '액정 방향을 여러 영역으로 나누는 VA 구조의 예입니다. RGB 영역 안에 갈매기 모양 전극과 슬릿이 나타납니다.', '독립적인 RGB 유기 LED를 수직으로 배열합니다. 백라이트 LCD와 달리 어두운 영역의 요소는 자체적으로 거의 빛을 내지 않습니다.', '양자점이 청색 OLED의 빛을 빨강과 초록으로 변환합니다. 초록을 위, 빨강과 파랑을 아래에 둔 삼각 배열을 모사합니다.'],
        language: '표시 언어', zoomIn: '확대', zoomOut: '축소', helpLabel: '조작 설명'
    },
    es: {
        title: 'Dentro del píxel', site: 'Dentro del píxel',
        footer: 'Todo descubrimiento empieza por mirar de cerca.', microscope: 'MICROSCOPIO DE PANTALLAS',
        metrics: ['AUMENTO', 'DISTANCIA APROX.', 'PASO DE PÍXEL DE REFERENCIA', 'ANCHO DEL ÁREA DE COLOR ≈'], distanceTip: 'Distancia ilustrativa, no una medida física.', stages: ['VISTA GENERAL', 'PÍXELES', 'ESTRUCTURA DEL COLOR', 'ÁREAS DE COLOR', 'VISTA MICROSCÓPICA'], scale: ['PÁGINA', 'PÍXELES', 'COLOR', 'ÁREAS DE COLOR', 'MICROSCOPIO'], reset: 'Restablecer', controls: ['Rueda para ampliar', 'Arrastra para mover', 'Doble clic para acercarte', 'Mayús + doble clic / clic derecho para alejarte'], helpKeys: ['Rueda / panel táctil', 'Arrastrar / flechas', 'Doble clic / +', 'Mayús + doble clic / −', 'Clic derecho', 'R / 0'], helpActions: ['Ampliar desde el cursor', 'Mover la pantalla', 'Acercar', 'Alejar', 'Alejar', 'Restablecer la vista'],
        approximation: 'Modelos de estructuras representativas, no medidas de un producto concreto. Las disposiciones varían según el modelo y la generación. Los fósforos CRT no corresponden exactamente a los píxeles de imagen.', loading: 'Preparando la pantalla…', captureError: 'No se pudo capturar la página. Vuelve a cargarla.', gpuLost: 'Esperando a que la GPU se reconecte…', webglError: 'Usa un navegador con WebGL2 habilitado.', panelLabel: 'PANEL DE PANTALLA', panelNames: ['LCD · Franjas RGB', 'OLED · PenTile diamante', 'CRT · Máscara de sombra', 'CRT · Rejilla de apertura', 'LCD · VA multidominio', 'OLED · Franjas RGB', 'QD-OLED · RGB triangular'],
        panelDescriptions: ['Los cristales líquidos regulan la luz de fondo. Una matriz negra separa las aperturas RGB verticales.', 'LED orgánicos que emiten luz propia. La retícula RG/BG tiene más emisores verdes y comparte los rojos y azules. Observa los rombos de distintos tamaños.', 'Un haz de electrones excita puntos de fósforo RGB. Presenta tríadas escalonadas, líneas de barrido y un resplandor suave.', 'Franjas verticales de fósforo en un CRT, con líneas de barrido horizontales y finos hilos de soporte para la rejilla.', 'Un ejemplo de LCD VA divide la orientación de los cristales en dominios. Dentro de las aperturas RGB aparecen ranuras en espiga.', 'LED orgánicos RGB independientes en franjas verticales. A diferencia de un LCD retroiluminado, apenas emiten luz en las zonas oscuras.', 'Los puntos cuánticos convierten la luz OLED azul en roja y verde. Este modelo sitúa el verde sobre el rojo y el azul formando un triángulo.'], language: 'Idioma', zoomIn: 'Acercar', zoomOut: 'Alejar', helpLabel: 'Mostrar controles'
    },
    fr: {
        title: 'Au cœur du pixel', site: 'Au cœur du pixel',
        footer: 'Toute découverte commence par un regard attentif.', microscope: 'MICROSCOPE D’ÉCRAN', metrics: ['GROSSISSEMENT', 'DISTANCE APPROX.', 'PAS DU PIXEL DE RÉFÉRENCE', 'LARGEUR DE LA ZONE DE COULEUR ≈'], distanceTip: 'Distance illustrative, pas une mesure physique.', stages: ['VUE D’ENSEMBLE', 'PIXELS', 'STRUCTURE DES COULEURS', 'ZONES DE COULEUR', 'VUE MICROSCOPIQUE'], scale: ['PAGE', 'PIXELS', 'COULEUR', 'ZONES DE COULEUR', 'MICROSCOPE'],
        reset: 'Réinitialiser', controls: ['Molette pour zoomer', 'Glisser pour déplacer', 'Double-clic pour approcher', 'Maj + double-clic / clic droit pour reculer'], helpKeys: ['Molette / pavé tactile', 'Glisser / flèches', 'Double-clic / +', 'Maj + double-clic / −', 'Clic droit', 'R / 0'], helpActions: ['Zoomer autour du curseur', 'Déplacer l’écran', 'Zoom avant', 'Zoom arrière', 'Zoom arrière', 'Réinitialiser la vue'], approximation: 'Des structures représentatives, pas les mesures d’un produit précis. Les agencements varient selon le modèle et la génération. Les phosphores CRT ne correspondent pas exactement aux pixels d’image.', loading: 'Préparation de l’écran…', captureError: 'Impossible de capturer la page. Rechargez-la.', gpuLost: 'En attente de reconnexion du GPU…', webglError: 'Utilisez un navigateur compatible avec WebGL2.', panelLabel: 'TYPE D’ÉCRAN', panelNames: ['LCD · Bandes RGB', 'OLED · PenTile diamant', 'CRT · Masque perforé', 'CRT · Grille d’ouverture', 'LCD · VA multidomaine', 'OLED · Bandes RGB', 'QD-OLED · RGB triangulaire'],
        panelDescriptions: ['Les cristaux liquides modulent le rétroéclairage. Une matrice noire sépare les ouvertures RGB verticales.', 'Des LED organiques autoémissives. La grille RG/BG comporte davantage d’éléments verts et partage le rouge et le bleu. Observez les losanges de tailles différentes.', 'Un faisceau d’électrons excite des points de phosphore RGB. Les triades décalées, les lignes de balayage et la lueur douce caractérisent ce CRT.', 'Des bandes de phosphore verticales dans un CRT, avec des lignes de balayage horizontales et de fins fils stabilisant la grille.', 'Un exemple de LCD VA répartit l’orientation des cristaux en domaines. Des fentes d’électrodes en chevrons apparaissent dans les ouvertures RGB.', 'Des LED organiques RGB indépendantes disposées en bandes verticales. Contrairement au LCD rétroéclairé, les zones sombres émettent très peu de lumière.', 'Les points quantiques convertissent la lumière OLED bleue en rouge et en vert. Ce modèle place le vert au-dessus du rouge et du bleu, en triangle.'], language: 'Langue', zoomIn: 'Zoom avant', zoomOut: 'Zoom arrière', helpLabel: 'Afficher les commandes'
    },
    de: {
        title: 'Im Pixel', site: 'Im Pixel', footer: 'Jede Entdeckung beginnt mit einem genaueren Blick.', microscope: 'DISPLAY-MIKROSKOP', metrics: ['VERGRÖSSERUNG', 'ABSTAND CA.', 'REFERENZ-PIXELABSTAND', 'FARBBEREICHSBREITE CA.'], distanceTip: 'Ein beispielhafter Abstand, keine physische Messung.', stages: ['GESAMTANSICHT', 'RASTERPIXEL', 'FARBSTRUKTUR', 'FARBBEREICHE', 'MIKROSKOPANSICHT'], scale: ['SEITE', 'PIXEL', 'FARBE', 'FARBBEREICHE', 'MIKROSKOP'], reset: 'Zurücksetzen', controls: ['Mausrad zum Zoomen', 'Ziehen zum Verschieben', 'Doppelklick zum Annähern', 'Umschalt + Doppelklick / Rechtsklick zum Entfernen'],
        helpKeys: ['Mausrad / Trackpad', 'Ziehen / Pfeiltasten', 'Doppelklick / +', 'Umschalt + Doppelklick / −', 'Rechtsklick', 'R / 0'], helpActions: ['Am Mauszeiger zoomen', 'Bild verschieben', 'Vergrößern', 'Verkleinern', 'Verkleinern', 'Ansicht zurücksetzen'], approximation: 'Modelle typischer Strukturen, keine Messungen eines bestimmten Produkts. Anordnungen variieren je nach Modell und Generation. CRT-Leuchtstoffe entsprechen nicht exakt den Bildpixeln.', loading: 'Display wird vorbereitet…', captureError: 'Die Seite konnte nicht erfasst werden. Bitte neu laden.', gpuLost: 'Warte auf die erneute GPU-Verbindung…', webglError: 'Bitte einen Browser mit aktiviertem WebGL2 verwenden.', panelLabel: 'DISPLAYTYP', panelNames: ['LCD · RGB-Streifen', 'OLED · Diamond PenTile', 'CRT · Lochmaske', 'CRT · Streifenmaske', 'LCD · Multidomain-VA', 'OLED · RGB-Streifen', 'QD-OLED · RGB-Dreieck'],
        panelDescriptions: ['Flüssigkristalle regeln das Hintergrundlicht. Eine lichtundurchlässige schwarze Matrix trennt die vertikalen RGB-Öffnungen.', 'Selbstleuchtende organische LEDs. Das RG/BG-Gitter enthält mehr grüne Elemente und teilt rote und blaue. Beachte die unterschiedlich großen Rauten.', 'Ein Elektronenstrahl regt RGB-Leuchtstoffpunkte an. Versetzte Punkttriaden, Rasterzeilen und weiches Leuchten kennzeichnen dieses CRT-Modell.', 'Vertikale Leuchtstoffstreifen einer Bildröhre, mit horizontalen Rasterzeilen und feinen Haltedrähten für die Streifenmaske.', 'Ein typisches VA-LCD teilt die Kristallausrichtung in mehrere Bereiche. In den RGB-Öffnungen werden winkelförmige Elektrodenschlitze sichtbar.', 'Unabhängige organische RGB-LEDs in vertikalen Streifen. Anders als bei einem hinterleuchteten LCD geben dunkle Bereiche fast kein Licht ab.', 'Quantenpunkte wandeln blaues OLED-Licht in Rot und Grün um. Dieses Modell ordnet Grün über Rot und Blau in einem Dreieck an.'], language: 'Sprache', zoomIn: 'Vergrößern', zoomOut: 'Verkleinern', helpLabel: 'Bedienung anzeigen'
    },
    pt: {
        title: 'Dentro do pixel', site: 'Dentro do pixel', footer: 'Cada descoberta começa com um olhar mais atento.', microscope: 'MICROSCÓPIO DE ECRÃS', metrics: ['AMPLIAÇÃO', 'DISTÂNCIA APROX.', 'PASSO DO PIXEL DE REFERÊNCIA', 'LARGURA DA ÁREA DE COR ≈'], distanceTip: 'Distância ilustrativa, não uma medição física.', stages: ['VISTA GERAL', 'PIXELS', 'ESTRUTURA DA COR', 'ÁREAS DE COR', 'VISTA MICROSCÓPICA'], scale: ['PÁGINA', 'PIXELS', 'COR', 'ÁREAS DE COR', 'MICROSCÓPIO'],
        reset: 'Repor', controls: ['Roda para ampliar', 'Arraste para mover', 'Duplo clique para aproximar', 'Shift + duplo clique / botão direito para afastar'], helpKeys: ['Roda / trackpad', 'Arrastar / setas', 'Duplo clique / +', 'Shift + duplo clique / −', 'Botão direito', 'R / 0'], helpActions: ['Ampliar no cursor', 'Mover o ecrã', 'Aproximar', 'Afastar', 'Afastar', 'Repor a vista'], approximation: 'Modelos de estruturas representativas, não medições de um produto específico. As disposições variam por modelo e geração. Os fósforos CRT não correspondem exatamente aos pixels de imagem.', loading: 'A preparar o ecrã…', captureError: 'Não foi possível capturar a página. Recarregue-a.', gpuLost: 'A aguardar a reconexão da GPU…', webglError: 'Use um navegador com WebGL2 ativado.', panelLabel: 'PAINEL DO ECRÃ', panelNames: ['LCD · Faixas RGB', 'OLED · PenTile diamante', 'CRT · Máscara de sombra', 'CRT · Grelha de abertura', 'LCD · VA multidomínio', 'OLED · Faixas RGB', 'QD-OLED · RGB triangular'],
        panelDescriptions: ['Os cristais líquidos regulam a retroiluminação. Uma matriz negra separa as aberturas RGB verticais.', 'LED orgânicos autoemissores. A grelha RG/BG tem mais elementos verdes e partilha o vermelho e o azul. Observe os losangos de tamanhos diferentes.', 'Um feixe de eletrões excita pontos de fósforo RGB. Tríades alternadas, linhas de varrimento e um brilho suave distinguem este CRT.', 'Faixas verticais de fósforo num CRT, com linhas horizontais de varrimento e finos fios de suporte da grelha.', 'Um exemplo de LCD VA divide a orientação dos cristais em domínios. Surgem ranhuras de elétrodos em espinha nas aberturas RGB.', 'LED orgânicos RGB independentes em faixas verticais. Ao contrário de um LCD retroiluminado, quase não emitem luz nas zonas escuras.', 'Os pontos quânticos convertem luz OLED azul em vermelho e verde. Este modelo dispõe o verde acima do vermelho e do azul, formando um triângulo.'], language: 'Idioma', zoomIn: 'Aproximar', zoomOut: 'Afastar', helpLabel: 'Mostrar controlos'
    }
};
