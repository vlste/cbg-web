import {
  backButton,
  viewport,
  themeParams,
  miniApp,
  initData,
  $debug,
  init as initSDK,
  disableVerticalSwipes,
  mountSwipeBehavior,
  mainButton,
  expandViewport,
  secondaryButton,
} from "@telegram-apps/sdk-react";

export function init(debug: boolean): void {
  $debug.set(debug);

  initSDK();

  if (!backButton.isSupported() || !miniApp.isSupported()) {
    throw new Error("ERR_NOT_SUPPORTED");
  }

  backButton.mount();
  miniApp.mount();
  themeParams.mount();
  initData.restore();

  mainButton.mount();
  secondaryButton.mount();

  expandViewport();

  mountSwipeBehavior();
  disableVerticalSwipes();

  miniApp;
  void viewport
    .mount()
    .catch((e) => {
      console.error("Something went wrong mounting the viewport", e);
    })
    .then(() => {
      viewport.bindCssVars();
    });

  miniApp.bindCssVars();
  themeParams.bindCssVars();
}
