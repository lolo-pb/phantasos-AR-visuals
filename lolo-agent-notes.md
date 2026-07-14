# Phantasos AR Visuals Notes

## What This Is

Mobile WebAR MVP.

Current working flow:

1. User opens the site from a link or QR code.
2. Browser asks for camera access.
3. App looks for the MindAR sample card image.
4. When the card is recognized, a small rotating cube appears on top of it.

For now the QR only opens the page. It is not the AR marker unless that exact QR image is later compiled into a MindAR `.mind` target.

## Current Stack

- `Vite` is only used to run/build the static page.
- `@vitejs/plugin-basic-ssl` lets `npm run dev:https` serve local HTTPS.
- `A-Frame` loads from CDN in `index.html`.
- `MindAR` image tracking loads from CDN in `index.html`.

There are currently no runtime npm dependencies. This avoids the Windows `canvas` / `node-gyp` install problem.

## Current Project Shape

- `index.html` is the active app.
- `package.json` has only Vite-related dev dependencies.
- `public/assets/targets` is where future local `.mind` target files should go.
- `public/assets/models` is where future local models can go.
- `src/` still contains the older custom Three.js app, but it is not used by the current MVP page.

## Current Runtime Details

`index.html` loads:

```text
https://aframe.io/releases/1.5.0/aframe.min.js
https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js
```

The current target is MindAR's sample card:

```text
https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind
```

The image to point the camera at is:

```text
https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.png
```

## Scripts

- `npm install` installs only the Vite dev tooling.
- `npm run dev` starts normal local HTTP.
- `npm run dev:https` starts local HTTPS for camera testing.
- `npm run build` builds the static page.
- `npm run preview` serves the production build.

Camera access needs HTTPS or localhost. For phone testing, a public HTTPS deploy/tunnel is usually easier than LAN/WSL networking.

## Next Real MVP Steps

1. Decide if the QR is only the link or also the AR marker.
2. Pick the real printed marker image.
3. Compile that image into a MindAR `.mind` file.
4. Put the `.mind` file in `public/assets/targets`.
5. Change `imageTargetSrc` in `index.html` to the local `.mind` file.
6. Replace the cube with the real model or visual.
7. Deploy to a public HTTPS URL.
8. Generate the QR code pointing to that URL.

## Suggestions / Uncertainty

- Keep the current simple A-Frame/MindAR page until the phone + marker + cube loop is reliable.
- After the AR loop works, decide whether to delete the unused `src/` custom Three.js app or revive it for a more controlled experience.
