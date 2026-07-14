import * as THREE from "three";

export class HeroExperience {
  constructor({ sceneManager, shell, copy }) {
    this.sceneManager = sceneManager;
    this.shell = shell;
    this.copy = copy;
    this.state = "boot";
    this.heroGroup = null;
    this.opacity = 0;
    this.targetOpacity = 0;
    this.progress = 0;
    this.yaw = 0;
  }

  async initialize() {
    this.heroGroup = this.sceneManager.getHeroGroup();
    this.heroGroup.scale.setScalar(0.72);
    this.heroGroup.position.set(0, 0.08, 0.05);
    this.heroGroup.visible = false;
    this.sceneManager.setFrameHook((delta) => this.#tick(delta));
  }

  setState(nextState) {
    this.state = nextState;

    if (nextState === "locked") {
      this.targetOpacity = 1;
      this.heroGroup.visible = true;
      this.shell.setState("locked", { detail: this.copy.locked });
      return;
    }

    if (nextState === "lost") {
      this.targetOpacity = 0;
      this.shell.setState("lost", { detail: this.copy.hint });
      return;
    }

    if (nextState === "scanning") {
      this.targetOpacity = 0;
      this.shell.setState("scanning", { detail: this.copy.scanning });
      return;
    }

    if (nextState === "error") {
      this.targetOpacity = 0;
    }
  }

  #tick(delta) {
    if (!this.heroGroup) return;

    this.opacity = THREE.MathUtils.damp(this.opacity, this.targetOpacity, 5.5, delta);
    this.progress = THREE.MathUtils.damp(
      this.progress,
      this.targetOpacity,
      4.6,
      delta
    );
    this.yaw += delta * 0.55;

    const eased = THREE.MathUtils.smoothstep(this.progress, 0, 1);
    const scale = 0.72 + eased * 0.28;
    const lift = (1 - eased) * 0.08;

    this.heroGroup.scale.setScalar(scale);
    this.heroGroup.position.y = 0.08 + lift;
    this.heroGroup.rotation.y = this.yaw;
    this.heroGroup.rotation.x = Math.sin(this.yaw * 0.7) * 0.08;

    this.heroGroup.traverse((child) => {
      if (!child.isMesh) return;
      child.material.opacity = this.opacity;
    });

    if (this.opacity < 0.01 && this.targetOpacity === 0) {
      this.heroGroup.visible = false;
    }
  }
}
