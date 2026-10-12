# ピクセルの中身を覗く

[English](README.md) | 日本語

**[デモを開く → GitHub Pages](https://musasaview.github.io/pixel-anatomy/)**

ピクセルと、LCD・OLED・CRT・CMYKの構造を拡大して観察するデモ。Ctrl＋ホイール、ピンチ、または画面の＋／−で操作できます。

## 仕組み

等倍では通常のHTMLを表示し、拡大時はWebGL2の描画へ切り替えます。

1. `html-to-image` で記事を画像化し、GPUのテクスチャとして読み込みます。内容や画面サイズが変わったときに作り直し、ズーム中は同じ画像を使います。
2. カーソルや指の位置を基準に、画像のどこを何倍で表示するかを変えます。最大倍率は2048倍です。
3. 拡大すると、シェーダーが各画素の色からRGBの発光領域や印刷の網点を描きます。PIXELモードでは色を補間せず、元の画素を四角く表示します。

ゲーム画像は元解像度の専用テクスチャを使い、輪郭を保ちます。動く光は毎フレーム再計算するため、ページ全体を撮り直す必要はありません。

表示される構造は模式的なシミュレーションです。実際の画面を顕微鏡で撮影したものではありません。詳しくは[技術資料](docs/TECHNICAL_NOTES.md)を参照してください。

## ローカルで動かす

BunとWebGL2対応ブラウザーを使用します。

```sh
bun install --frozen-lockfile
bun run dev
```

<http://localhost:5173> を開きます。本番ビルドは `bun run build`。

## ライセンス

コードは[MIT License](LICENSE)。画像の出典と利用条件は[素材クレジット](public/images/CREDITS.md)を参照してください。

配布するJavaScriptに含まれる第三者コードの著作権表示とライセンス本文は[第三者ライセンス](public/THIRD_PARTY_NOTICES.txt)にまとめています。
