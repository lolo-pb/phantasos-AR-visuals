import * as THREE from "three";
import { HeroAssetFactory } from "./HeroAssetFactory.js";

export class SceneManager {
  constructor({ renderRoot, heroAsset }) {
    this.renderRoot = renderRoot;
    this.heroAssetFactory = new HeroAssetFactory(heroAsset);
    this.anchor = null;
    this.heroGroup = null;
    this.running = false;
    this.clock = new THREE.Clock();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.frameHook = null;
    this.mindarRenderer = null;
    this.mindarScene = null;
    this.mindarCamera = null;
  }

  async initialize() {
    this.heroGroup = await this.heroAssetFactory.load();
  }

  attachToAnchor(anchor) {
    this.anchor = anchor.group;

    if (!this.renderer) {
      this.#bootstrapFromMindARScene(anchor);
    }

    this.anchor.add(this.heroGroup);
  }

  start() {
    if (!this.renderer || !this.scene || !this.camera || this.running) return;
    this.running = true;
    this.renderer.setAnimationLoop(() => {
      const delta = this.clock.getDelta();
      if (this.frameHook) this.frameHook(delta);
      this.renderer.render(this.scene, this.camera);
    });
  }

  pause() {
    if (!this.renderer) return;
    this.running = false;
    this.renderer.setAnimationLoop(null);
  }

  setFrameHook(frameHook) {
    this.frameHook = frameHook;
  }

  getHeroGroup() {
    return this.heroGroup;
  }

  #bootstrapFromMindARScene(anchor) {
    const { scene, camera, renderer } = anchor;

    if (!scene || !camera || !renderer) {
      throw new Error("MindAR scene bridge is unavailable.");
    }

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.#addLights();
    window.addEventListener("resize", () => {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  #addLights() {
    const ambient = new THREE.HemisphereLight(0xb9ebff, 0x06131f, 1.15);
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(1.6, 2.2, 1.8);
    const fill = new THREE.DirectionalLight(0x7cdcff, 0.45);
    fill.position.set(-1.4, 1.0, 1.2);

    this.scene.add(ambient, key, fill);
  }
}
