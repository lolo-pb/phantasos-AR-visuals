import "./styles.css";
import { appConfig } from "./config/experience.js";
import { AppShell } from "./app/AppShell.js";
import { isWebARSupported } from "./app/support.js";
import { ARSessionController } from "./ar/ARSessionController.js";
import { SceneManager } from "./scene/SceneManager.js";
import { HeroExperience } from "./experience/HeroExperience.js";

const mountNode = document.querySelector("#app");

const shell = new AppShell({ mountNode, appConfig });
shell.render();

if (!isWebARSupported()) {
  shell.setState("unsupported", {
    detail:
      "This experience needs a modern browser with camera access and WebGL."
  });
} else {
  bootstrap().catch((error) => {
    console.error(error);
    shell.setState("error", {
      detail: "The AR experience failed to initialize. Please try again."
    });
  });
}

async function bootstrap() {
  const session = new ARSessionController({
    container: shell.getCameraMount(),
    tracking: appConfig.tracking
  });

  const sceneManager = new SceneManager({
    renderRoot: shell.getCameraMount(),
    heroAsset: appConfig.heroAsset
  });

  const heroExperience = new HeroExperience({
    sceneManager,
    shell,
    copy: appConfig.copy
  });

  wireEvents({ session, sceneManager, heroExperience, shell });
  await sceneManager.initialize();
  shell.setRetryHandler(async () => {
    shell.setRetryHandler(null);
    shell.setState("permission", {
      detail: appConfig.copy.permissionPrompt
    });
    await session.start();
  });
  shell.setState("permission", {
    detail: appConfig.copy.permissionPrompt
  });
  await session.start();
}

function wireEvents({ session, sceneManager, heroExperience, shell }) {
  session.on("sessionready", async ({ anchor }) => {
    sceneManager.attachToAnchor(anchor);
    await heroExperience.initialize();
    heroExperience.setState("scanning");
  });

  session.on("scanning", () => {
    sceneManager.start();
    heroExperience.setState("scanning");
  });

  session.on("targetfound", () => {
    heroExperience.setState("locked");
  });

  session.on("targetlost", () => {
    heroExperience.setState("lost");
  });

  session.on("permissiondenied", () => {
    heroExperience.setState("error");
    shell.setState("permissionDenied", {
      detail: appConfig.copy.permissionDenied
    });
    shell.setRetryHandler(async () => {
      shell.setRetryHandler(null);
      await session.start();
    });
  });

  session.on("error", ({ message }) => {
    heroExperience.setState("error");
    shell.setState("error", { detail: message || appConfig.copy.genericError });
    shell.setRetryHandler(async () => {
      shell.setRetryHandler(null);
      await session.restart();
    });
  });

  document.addEventListener("visibilitychange", async () => {
    if (document.hidden) {
      sceneManager.pause();
      await session.stop();
    } else {
      shell.setState("permission", {
        detail: appConfig.copy.resumePrompt
      });
      await session.start();
    }
  });
}
