# Inside the Pixel

English | [日本語](README.ja.md)

**[Open the demo → GitHub Pages](https://musasaview.github.io/pixel-anatomy/)**

An interactive demo for zooming into pixels and exploring the structures of LCD, OLED, CRT, and CMYK printing. Zoom with Ctrl + mouse wheel, a pinch gesture, or the on-screen +/− controls.

## How it works

At normal size, the page uses regular HTML. When you zoom in, it switches to WebGL2 rendering.

1. `html-to-image` captures the article as an image and loads it as a GPU texture. The image is rebuilt when the content or viewport size changes and reused while zooming.
2. Zooming adjusts the visible area and magnification around the cursor or touch position, up to 2048×.
3. As you zoom in, shaders use each pixel's color to draw RGB light-emitting regions or print halftone dots. PIXEL mode displays the original pixels as squares without color interpolation.

The game image uses a dedicated texture at its original resolution to preserve its edges. Animated light is recalculated every frame, so the entire page does not need to be captured again.

The structures shown are illustrative simulations, not microscope photographs of actual displays. See the [technical notes (Japanese)](docs/TECHNICAL_NOTES.md) for details.

## Run locally

Use Bun and a browser with WebGL2 support.

```sh
bun install --frozen-lockfile
bun run dev
```

Open <http://localhost:5173>. To create a production build, run `bun run build`.

## License

The code is licensed under the [MIT License](LICENSE). See the [image credits](public/images/CREDITS.md) for image sources and usage terms.

Copyright notices and license texts for third-party code included in the distributed JavaScript are provided in [Third-party notices](public/THIRD_PARTY_NOTICES.txt).
