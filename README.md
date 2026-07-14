# Phantasos AR Visuals

Mobile-first WebAR MVP using MindAR for image tracking and Three.js for rendering.

## Current state vvv

| Detection | 3D Ray ayanami |
| :---: | :---: |
| ![WhatsApp Image 2026-07-14 at 00 29 36 (1)](https://github.com/user-attachments/assets/f81a3daf-d170-4c93-9d05-55474dca39ab) | ![WhatsApp Image 2026-07-14 at 00 29 36](https://github.com/user-attachments/assets/d11a5cc5-b79d-48cd-8c86-40ec82f4ceb8) |


## Stack

- `MindAR` for image target tracking and camera session lifecycle
- `Three.js` for scene rendering, lighting, and hero content
- `Vite` for local development and bundling

## Quick start

1. Install dependencies:
   `npm install`
2. Start local development:
   `npm run dev`
3. Open the shown local URL on a mobile device or desktop browser with camera access.

## Current MVP defaults

- One target is configured in [src/config/experience.js](C:\lolo\dev\phantasos-AR-visuals\src\config\experience.js).
- The default target points to MindAR's sample `card.mind` file so the app works before you compile your own target.
- The hero asset loader first tries `/assets/models/hero.glb`.
- If `hero.glb` is missing, the app falls back to a polished procedural hero object so the runtime still works.

## Replace with your own target

1. Compile your image using the MindAR compiler:
   [MindAR compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile/)
2. Put the compiled target file under `public/assets/targets/`.
3. Update `imageTargetSrc` in [src/config/experience.js](C:\lolo\dev\phantasos-AR-visuals\src\config\experience.js).

## Replace with your own 3D hero model

1. Add an optimized `hero.glb` at `public/assets/models/hero.glb`.
2. Keep it lightweight for mobile:
   - low-to-medium polycount
   - compressed textures where possible
   - tight material set

## Project structure

- `src/app` app shell, overlays, and browser support checks
- `src/ar` MindAR adapter and session control
- `src/scene` Three.js scene, renderer, and hero asset loading
- `src/experience` stateful reveal behavior on top of the scene
- `src/config` asset and UX defaults

## Notes

- Production should be served over HTTPS.
- The default sample target is useful for development only. Replace it before shipping.
- I could not install dependencies or run the app in this environment, so after `npm install` the first validation step should be `npm run build`.

