export const appConfig = {
  tracking: {
    runtimeUrl:
      "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js",
    imageTargetSrc:
      "https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind",
    targetIndex: 0,
    maxTrack: 1
  },
  heroAsset: {
    modelUrl: "/assets/models/hero.glb",
    revealScale: 0.9
  },
  copy: {
    eyebrow: "Phantasos AR",
    title: "Point your camera at the printed graphic",
    intro:
      "Allow camera access, then aim at the selected artwork on a wall, card, label, or overhead print. The hero visual appears once the target locks.",
    hint:
      "Keep the full graphic in view and move closer slowly if tracking does not lock right away.",
    permissionPrompt:
      "Allow camera access to begin scanning for the target artwork.",
    resumePrompt:
      "Camera paused while the app was in the background. Restarting the scanner now.",
    scanning: "Scanning for artwork",
    locked: "Artwork recognized",
    lost: "Tracking lost",
    permissionDenied:
      "Camera permission was denied. Allow camera access in the browser and try again.",
    genericError:
      "The camera session could not start. Reload the page or try again."
  }
};
