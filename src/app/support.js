export function getWebARSupportReport() {
  const hasSecureContext = window.isSecureContext;
  const hasCameraApi = Boolean(
    navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  );
  const hasWebGL = canCreateWebGLContext();

  if (!hasSecureContext) {
    return {
      supported: false,
      reason: "insecure-context",
      message:
        "Camera access only works on HTTPS or localhost. Open this over HTTPS on your phone, not a plain HTTP LAN URL."
    };
  }

  if (!hasCameraApi) {
    return {
      supported: false,
      reason: "camera-api",
      message:
        "This browser is not exposing camera access. Check browser permissions or try Chrome/Safari directly instead of an in-app browser."
    };
  }

  if (!hasWebGL) {
    return {
      supported: false,
      reason: "webgl",
      message:
        "WebGL is not available in this browser session. Check browser settings or hardware acceleration."
    };
  }

  return {
    supported: true,
    reason: "ok",
    message: "WebAR support checks passed."
  };
}

function canCreateWebGLContext() {
  const canvas = document.createElement("canvas");
  return Boolean(
    window.WebGLRenderingContext &&
      (canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl") ||
        canvas.getContext("webgl2"))
  );
}
