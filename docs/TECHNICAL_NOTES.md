# 技術資料と確認記録

[READMEに戻る](../README.md)

## 技術内容の確認（2026-10-05）

公開本文、配列図、文字比較、拡大処理を照合し、以下を修正・確認しました。

| 項目 | 確認内容・反映 | 主な資料 |
| --- | --- | --- |
| RGBと白・黒 | 白はRGBの適切なバランスで作る。LCDでは黒にも光漏れがあり、単純な「消灯」と区別する。 | [UNSW：加法混色](https://animations.physics.unsw.edu.au/jw/light/colour-mixing.htm) |
| LCD | カラーフィルターと液晶が光を調整し、ブラックマトリクスは遮光する。TFTは電圧制御用。 | [EIZO技術資料](https://www.eizo.com/prodeizo/media/contentassets/2022/01/28/BNeYJih_WP18-001.pdf) |
| くの字LCD | 折れ曲がる電極による複数配向と視野角改善を説明。外形と液晶方式を同一視しない。 | [UCFのMD-IPS特許](https://patents.google.com/patent/WO2006118752A2/en) |
| Diamond PenTile | スマートフォンでの2013年採用、緑が赤・青それぞれの2倍という配置を確認。 | [Samsung Display](https://global.samsungdisplay.com/29043/) |
| Sストライプ | 2010年代初めのスマートフォンの独立RGB要素を確認。左右・上下の向きは模式例として扱う。 | [実測比較](https://www.displaymate.com/Galaxy_Note3_ShootOut_1.htm)、[撮影者による顕微鏡写真](https://commons.wikimedia.org/wiki/File:Samsung_Galaxy_Note_2_subpixels.jpg) |
| WOLED | 白色発光＋RGBフィルターとW区画を説明。RWBGは配列の一例で、WOLED全製品の定義にしない。 | [LG Display](https://www.lgdisplay.com/eng/technology/tandem-woled)、[実機配列写真](https://www.rtings.com/monitor/learn/woled-vs-qd-oled) |
| QD-OLED | 青色OLEDから赤・緑への変換を確認。三角配列だけでなく縦ストライプ製品もある。 | [Samsung：QD変換](https://news.samsungdisplay.com/25699)、[V-Stripe製品](https://global.samsungdisplay.com/31411) |
| CRT | マスクは電子線を選別する金属部品。ダンパー線は蛍光体ではなくグリルを支える。画像画素と蛍光体の組は1対1ではない。 | [Sony：ダンパー線](https://www.sony.co.kr/electronics/support/articles/S500081251)、[スロットマスク特許](https://patents.google.com/patent/US7098583B2/en) |
| CMYK | 反射光とインクによる減法混色。網点は大きさや密度で階調を表す。写真と生成シミュレーションを区別する。 | [Adobe：印刷設定](https://helpx.adobe.com/ph_en/acrobat/using/advanced-pdf-print-settings.html)、[写真の出典](https://commons.wikimedia.org/wiki/File:CMYK_under_a_microscope.jpg) |
| 文字描画 | ClearTypeは現在も存在し、利用はOS・アプリ依存。配列の向き・順序が重要。比較図はClearTypeの出力ではない。 | [Microsoft](https://learn.microsoft.com/en-us/windows/win32/gdi/cleartype-antialiasing)、[FreeType](https://freetype.org/freetype2/docs/reference/ft2-lcd_rendering.html) |

### シミュレーションの範囲

- 配列や色の作り方を理解するための模型であり、分光特性・輝度・実寸・視野角を校正した測定器ではありません。観察距離は60cmを基準に倍率から算出する説明用の値です。
- WOLEDは無彩色成分をWに割り当てる簡略モデルです。実製品のRGBW変換や輝度制御を再現するものではありません。
- CRTは蛍光体配列と走査線の見た目を示し、電子ビームの時間応答や残光を再現しません。
- CMYKモードは規則的なAM網点と簡略化した反射率を使い、ICCプロファイル・実インク・用紙ごとの印刷結果を予測しません。
- 文字サンプルは横方向3サンプルをRGBへ割り当てる説明図です。ClearTypeのヒンティング、色にじみ低減フィルターなどを再現していません。

### 採用年代の資料

本文は個別の製品名を出さず、機器の種類と年代で説明します。発表・量産・採用は区別します。

- LCD：1970年代の電卓への利用は[Sharpの歴史資料](https://global.sharp/corporate/info/his/h_company/1973_1975/index.html)、1990年代のカラーTFTノートPCは[Computer History Museumの年表](https://www.computerhistory.org/timeline/computers/)を参照。
- MVA：1997年の技術発表は[当時のプレスリリース](https://info.archives.global.fujitsu/jp/news/1997/Sep/16-2e.html)。IPS系の1990年代後半の広視野角化は[1999年の技術発表](https://www.hitachi.com/New/cnews/E/1999/991020B.html)を参照。個々の開口形状の発明年とは区別。
- CRT：1950年代のシャドーマスクと1970年代のスロット型は[技術史論文](https://sid.onlinelibrary.wiley.com/doi/full/10.1002/j.2637-496X.1991.tb06009.x)、1968年のアパーチャーグリル採用は[Sonyの歴史資料](https://www.sony.com/en/SonyInfo/CorporateInfo/History/sonyhistory-c.html)を参照。
- WOLED：大型テレビ用パネルの2013年量産開始は[LG Display](https://www.lgdisplay.com/eng/technology/tandem-woled)。QD-OLEDの2022年市場投入は[Samsung Display](https://news.samsungdisplay.com/34031)、2026年モデルでの縦ストライプ採用は[同社の発表](https://global.samsungdisplay.com/31411)を参照。
- サブピクセル文字描画：2000年代のPCでの利用は[開発元の研究資料](https://www.microsoft.com/en-us/research/project/cleartype/)、[2007年の技術解説](https://www.microsoft.com/en-us/research/uploads/prod/2021/06/Larson-2007-the-technology-of-text.pdf)を参照。技術そのものの発明年としては扱わない。

## 描画仕様と補足資料

LCD・OLED・CRTのプレビューは、拡大表示と同じ `simulatePanel` シェーダーから生成します。WOLEDはパステル色、赤・緑・青・白の入力を使います。CMYKのサンプルだけは、Psiĥedelistoによる実物の顕微鏡写真（CC0）を使用します。軽量化した画像をローカル配信し、CSSで中央部分を表示します。出典と利用条件は `public/images/CREDITS.md` に記載しています。CMYKの分版と反射率の計算は線形光で行い、表示時にsRGBへ戻します。印刷モードには液晶のピクセル格子を重ねません。LCD RGBストライプの小点は、サブピクセルの電圧を制御するTFTと配線を示します。シェブロンLCDはRGB開口が曲がる例です。電極の折れ曲がりで複数の液晶配向を作る設計はIPSなどに見られ、外形だけからIPS・VAを判別するものではありません。

WOLEDの図は、白色OLEDとRGBフィルターにフィルターなしのW要素を加えたRWBGの模式例です。WOLEDの各要素の順序や駆動方法は製品・世代によって異なります。[RTINGSのWOLEDとQD-OLEDの解説](https://www.rtings.com/monitor/learn/woled-vs-qd-oled)では、実機の配列例としてRWBGやRGWBを確認できます。Diamond PenTileの歴史と配列については[2013年のInformation Display誌](https://archive.informationdisplay.org/Portals/InformationDisplay/IssuePDF/02_2013.pdf)と[US20060244885A1](https://patents.google.com/patent/US20060244885A1/en)、[Samsung Displayの資料](https://global.samsungdisplay.com/29043/)を参照しています。QD-OLEDの説明は[Samsung Displayの資料](https://global.samsungdisplay.com/31114)も参考にしています。

追加の構造資料： [LG Display WOLED](https://www.lgdisplay.com/eng/technology/tandem-woled)、[Samsung S-stripe patent US9870727B2](https://patents.google.com/patent/US9870727B2/en)、[CRT slot-mask patent US7098583B2](https://patents.google.com/patent/US7098583B2/en)。図はこれらを含む代表例の模式表現で、特定製品の完全な再現ではありません。

CMYKの説明は [CMYK color model](https://en.wikipedia.org/wiki/CMYK_color_model) の網点・黒版・デバイス依存の説明を確認しています。CMYKサンプルの実写部分は、印刷モードで拡大しても再び網点化せず、そのまま拡大表示します。

サブピクセルレンダリングの説明は [Microsoft ClearType](https://learn.microsoft.com/en-us/typography/cleartype/)、[DirectWrite](https://learn.microsoft.com/en-us/windows/win32/directwrite/introducing-directwrite)、[FreeTypeのサブピクセル描画](https://freetype.org/freetype2/docs/reference/ft2-lcd_rendering.html) を参考にしています。画素配列との相性とOS・アプリごとの採用の違いを説明し、技術全体が廃止されたとは扱いません。


## タッチ端末の操作改善（2026-10-12）

等倍時にタッチのPointer Eventsを除外していたため、ピンチがアプリの拡大処理に入らなかった。タッチだけをTouch Eventsへ分離し、2本指操作と拡大時の移動で既定操作を抑止する。等倍の1本指スクロールとマウス・ホイール・キーボードの処理は維持する。イベント処理は[MDNのマルチタッチ解説](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Multi-touch_interaction)を参照。

`(pointer:coarse) and (max-width:960px)` の端末では方式一覧を横スクロールにし、数値の詳細を設定内へ移す。390px幅の操作部は高さ314pxから136pxになった。専用Chromiumのタッチエミュレーションで等倍スクロール、繰り返しピンチによる2048倍、リセット、320/390px幅と横向き844px幅、デスクトップのボタン寸法・数値表示・ボタンとキーボードの倍率を確認した。320px幅・2048倍で8言語の設定内数値に重なりがないことも確認した。iPhone実機のSafariは未検証。


## 写真とフォントの軽量化（2026-10-12）

猫写真はEXIFの向きを画像へ適用して900×1200px、JPEG品質84に縮小し、2,754,176バイトから92,041バイトへ軽量化。CMYK写真は網点の寸法を変えず1600×1200pxを維持し、JPEG品質90・4:4:4で再圧縮して1,854,295バイトから932,335バイトへ軽量化した。両方の画像からメタデータを除去し、ゲーム画像は変更していない。圧縮前後の見た目と画像の読み込みを確認した。文字比較Canvasも本文のシステムフォントを使い、旧フォント名の指定を除去した。

## スクロール中のアニメーション負荷（2026-10-12）

等倍の更新処理が毎フレーム `window.scrollTo()` を呼び、透明な全画面WebGLキャンバスも毎回消去していた。さらにタッチ端末の表示領域の高さだけが変わった場合も、記事全体を再画像化してGPUへ転送していた。iPhoneの慣性スクロールへの干渉と、ブラウザーのアドレスバー伸縮に伴う負荷の原因候補として修正した。

- 等倍ではブラウザーのスクロール位置を読み取るだけにし、拡大から等倍へ戻る際だけ位置を合わせる。リセット操作は元の読み位置を維持する。
- WebGL画面の消去は等倍へ戻る際の1回だけとする。出力キャンバスの内部サイズも、寸法が変わったときだけ更新する。
- タッチ端末のresizeでは記事の幅・高さ・DPRを最後のキャプチャと比較し、同じならテクスチャを再利用する。表示領域とカメラだけを更新し、倍率は保持する。幅や記事サイズ、言語、画像、DPRが変わった場合は従来どおり再画像化する。

専用Chromium（390px幅、DPR 3、タッチ有効）で変更前後を比較した。700msの等倍アニメーション中の `scrollTo()` とWebGL消去はそれぞれ42回から0回、高さだけの変更による記事のGPU転送は1回から0回、同一サイズのresizeでのキャンバス寸法設定は4回から0回になった。Canvas 2Dのアニメーションと1本指スクロールは継続する。

ピンチ、拡大から等倍への1回だけの位置合わせ・消去、高さ変更時の倍率保持、画面回転、リセット、一時停止・再開、画面外での停止と復帰、言語切替、デスクトップのキーボード操作を確認した。SVG化や解像度・フレームレートの引き下げは行っていない。これは処理回数の検証であり、iPhone 13 Pro実機のFPS改善は未検証。
