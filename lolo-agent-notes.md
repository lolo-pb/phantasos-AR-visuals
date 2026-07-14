# Phantasos AR Visuals Notes

## What This Is

Mobile-first WebAR MVP.

The intended flow is:

1. User scans a QR code.
2. QR opens this web app over HTTPS.
3. User allows camera access.
4. App scans for an image target.
5. When the target is recognized, a Three.js 3D object appears anchored on top of that target.

For the MVP, the QR code is just a link to the hosted HTTPS page. The QR graphic is not automatically the AR tracking target unless its printed image is also compiled into a MindAR `.mind` target file.

## Stack

- `Vite` runs and builds the web app.
- `Three.js` renders the 3D object.
- `MindAR` handles camera image tracking.
- `@vitejs/plugin-basic-ssl` allows local HTTPS testing with `npm run dev:https`.

MindAR is currently loaded from jsDelivr at runtime, not installed as a local package.
The SSL plugin is pinned to a Vite 5 compatible version so `npm install` works reproducibly.

## Project Shape

- `index.html` mounts the app.
- `src/main.js` wires the app shell, support checks, AR session, scene manager, and hero behavior.
- `src/app` owns the visible UI overlays and browser support checks.
- `src/ar/ARSessionController.js` owns MindAR startup, stop/restart, target found, and target lost events.
- `src/scene` owns the Three.js scene bridge and hero asset loading.
- `src/experience/HeroExperience.js` owns the reveal/fade/rotation behavior after tracking locks.
- `src/config/experience.js` is the main place to change target URLs, model URLs, and user-facing copy.
- `public/assets/targets` is where compiled MindAR `.mind` targets should go.
- `public/assets/models` is where `hero.glb` should go.

## Current Runtime Flow

`src/main.js` renders the shell, checks secure context/camera/WebGL support, then starts the AR session.

`ARSessionController` dynamically imports the MindAR runtime from:

`https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js`

It currently tracks MindAR's remote sample card target:

`https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind`

When MindAR creates an anchor, `SceneManager` attaches the hero object to that anchor. If `/assets/models/hero.glb` does not exist, the app shows a procedural fallback object instead.

## Scripts

- `npm install` installs dependencies.
- `npm run dev` starts Vite over normal local HTTP.
- `npm run dev:https` starts Vite with a local HTTPS certificate.
- `npm run build` builds the app.
- `npm run preview` serves the production build locally.

Camera access requires HTTPS or localhost. A phone opening a LAN URL usually needs HTTPS.

## MVP Gaps

- There is no local `hero.glb` yet, so the app uses the procedural fallback.
- There is no local compiled `.mind` target yet, so the app uses MindAR's sample target.
- There is no deployment config yet for a real public HTTPS URL.
- There is no generated QR code asset in the repo yet.
- npm dependencies install and the production build passes.

## Simple Path To A Real MVP

1. Pick the printed tracking image. If the QR itself should hold the object, compile that same QR image as the MindAR target.
2. Use the MindAR compiler to create a `.mind` file.
3. Put the `.mind` file in `public/assets/targets`.
4. Update `imageTargetSrc` in `src/config/experience.js`.
5. Put the model at `public/assets/models/hero.glb`, or keep the fallback while testing.
6. Deploy the Vite build to any static HTTPS host.
7. Generate a QR code pointing to that HTTPS URL.
8. Test on a real phone browser, not an in-app browser first.

## Suggestions / Uncertainty

- Decide whether the QR code itself is the tracking marker or only the link that opens the app. Those are different assets and workflows.
- For fewer runtime surprises, consider serving MindAR and the `.mind` target locally instead of depending on CDN URLs.
