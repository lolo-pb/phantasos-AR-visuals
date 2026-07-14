import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class HeroAssetFactory {
  constructor({ modelUrl }) {
    this.modelUrl = modelUrl;
    this.loader = new GLTFLoader();
  }

  async load() {
    try {
      const group = await this.#loadModel();
      return this.#prepareGroup(group);
    } catch (error) {
      console.warn("Falling back to procedural hero asset.", error);
      return this.#buildFallbackHero();
    }
  }

  async #loadModel() {
    const response = await fetch(this.modelUrl, { method: "HEAD" });
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok || contentType.includes("text/html")) {
      throw new Error(`Model asset not found: ${this.modelUrl}`);
    }

    const gltf = await this.loader.loadAsync(this.modelUrl);
    return gltf.scene;
  }

  #prepareGroup(group) {
    group.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = false;
      child.receiveShadow = false;
      child.material = child.material.clone();
      child.material.transparent = true;
      child.material.opacity = 0;
    });
    group.visible = false;
    return group;
  }

  #buildFallbackHero() {
    const group = new THREE.Group();
    const shellMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#6ee7ff"),
      emissive: new THREE.Color("#12314d"),
      roughness: 0.25,
      metalness: 0.4,
      clearcoat: 0.8,
      transparent: true,
      opacity: 0
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#8ff2d8"),
      emissive: new THREE.Color("#1e4b45"),
      roughness: 0.35,
      metalness: 0.15,
      transparent: true,
      opacity: 0
    });
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0d1c2c"),
      roughness: 0.5,
      metalness: 0.55,
      transparent: true,
      opacity: 0
    });

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.22, 3),
      shellMaterial
    );
    const ringA = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.018, 24, 96),
      accentMaterial
    );
    ringA.rotation.x = Math.PI / 2.4;
    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.01, 18, 96),
      darkMaterial
    );
    ringB.rotation.set(Math.PI / 3, 0.4, 0.25);

    const plume = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.56, 24),
      accentMaterial
    );
    plume.position.set(0, 0.06, 0);
    plume.rotation.z = Math.PI / 8;

    group.add(core, ringA, ringB, plume);
    group.visible = false;

    group.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });

    return group;
  }
}
