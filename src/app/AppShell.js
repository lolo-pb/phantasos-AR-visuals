const STATUS_MAP = {
  boot: { label: "Preparing experience", dot: "" },
  permission: { label: "Waiting for camera access", dot: "" },
  scanning: { label: "Scanning for artwork", dot: "" },
  locked: { label: "Target locked", dot: "ready" },
  lost: { label: "Target lost", dot: "" },
  unsupported: { label: "Unsupported browser", dot: "error" },
  permissionDenied: { label: "Camera blocked", dot: "error" },
  error: { label: "Something went wrong", dot: "error" }
};

export class AppShell {
  constructor({ mountNode, appConfig }) {
    this.mountNode = mountNode;
    this.appConfig = appConfig;
    this.elements = {};
    this.retryHandler = null;
  }

  render() {
    this.mountNode.innerHTML = `
      <div class="app-shell">
        <div class="camera-root" data-camera-root></div>
        <section class="overlay overlay--top">
          <p class="eyebrow">${this.appConfig.copy.eyebrow}</p>
          <h1 class="headline">${this.appConfig.copy.title}</h1>
          <p class="copy">${this.appConfig.copy.intro}</p>
        </section>
        <section class="hint-strip">
          <div class="hint-card">${this.appConfig.copy.hint}</div>
        </section>
        <section class="overlay overlay--bottom">
          <div class="status-row">
            <div class="status-label">
              <span class="status-dot" data-status-dot></span>
              <span data-status-label></span>
            </div>
            <button class="button" type="button" data-retry hidden>Retry</button>
          </div>
          <p class="status-detail" data-status-detail></p>
        </section>
      </div>
    `;

    this.elements.cameraRoot = this.mountNode.querySelector("[data-camera-root]");
    this.elements.statusDot = this.mountNode.querySelector("[data-status-dot]");
    this.elements.statusLabel = this.mountNode.querySelector("[data-status-label]");
    this.elements.statusDetail = this.mountNode.querySelector("[data-status-detail]");
    this.elements.retryButton = this.mountNode.querySelector("[data-retry]");
    this.elements.retryButton.addEventListener("click", async () => {
      if (!this.retryHandler) return;
      const handler = this.retryHandler;
      this.setRetryHandler(null);
      await handler();
    });

    this.setState("boot", { detail: "Loading the AR runtime." });
  }

  getCameraMount() {
    return this.elements.cameraRoot;
  }

  setRetryHandler(handler) {
    this.retryHandler = handler;
    this.elements.retryButton.hidden = !handler;
  }

  setState(state, { detail = "" } = {}) {
    const mapping = STATUS_MAP[state] || STATUS_MAP.error;
    this.elements.statusLabel.textContent = mapping.label;
    this.elements.statusDetail.textContent = detail;
    this.elements.statusDot.className = `status-dot ${mapping.dot}`.trim();
  }
}

