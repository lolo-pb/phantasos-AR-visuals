export function isWebARSupported() {
  return Boolean(
    navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.WebGLRenderingContext
  );
}

