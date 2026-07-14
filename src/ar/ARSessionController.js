import { EventEmitter } from "../lib/EventEmitter.js";

export class ARSessionController {
  constructor({ container, tracking }) {
    this.container = container;
    this.tracking = tracking;
    this.emitter = new EventEmitter();
    this.mindarThree = null;
    this.anchor = null;
    this.running = false;
    this.ready = false;
    this.MindARThree = null;
  }

  on(eventName, handler) {
    return this.emitter.on(eventName, handler);
  }

  async start() {
    try {
      if (!this.mindarThree) {
        await this.#createSession();
      }

      if (this.running) {
        this.emitter.emit("scanning");
        return;
      }

      await this.mindarThree.start();
      this.running = true;

      if (!this.ready) {
        this.ready = true;
        this.emitter.emit("sessionready", {
          anchor: {
            group: this.anchor.group,
            scene: this.mindarThree.scene,
            camera: this.mindarThree.camera,
            renderer: this.mindarThree.renderer
          }
        });
      }

      this.emitter.emit("scanning");
    } catch (error) {
      const message = String(error?.message || error || "");
      if (message.toLowerCase().includes("permission")) {
        this.emitter.emit("permissiondenied");
      } else {
        this.emitter.emit("error", {
          message: "Unable to start the camera session."
        });
      }
    }
  }

  async stop() {
    if (!this.mindarThree || !this.running) return;
    await this.mindarThree.stop();
    this.running = false;
  }

  async restart() {
    await this.stop();
    await this.start();
  }

  async #createSession() {
    if (!this.MindARThree) {
      const runtime = await import(/* @vite-ignore */ this.tracking.runtimeUrl);
      this.MindARThree = runtime.MindARThree;
    }

    this.mindarThree = new this.MindARThree({
      container: this.container,
      imageTargetSrc: this.tracking.imageTargetSrc,
      maxTrack: this.tracking.maxTrack,
      uiLoading: "no",
      uiScanning: "no",
      uiError: "no"
    });

    this.anchor = this.mindarThree.addAnchor(this.tracking.targetIndex);
    this.anchor.onTargetFound = () => {
      this.emitter.emit("targetfound");
    };
    this.anchor.onTargetLost = () => {
      this.emitter.emit("targetlost");
    };
  }
}
