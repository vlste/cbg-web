import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

import { Root } from "@/components/Root.tsx";
import { EnvUnsupported } from "@/components/error/EnvUnsupported.tsx";
import { init } from "@/init.ts";

import "./index.css";
import "./mockEnv.ts";
import "./i18n/config";

const root = ReactDOM.createRoot(document.getElementById("root")!);

try {
  init(retrieveLaunchParams().startParam === "debug" || import.meta.env.PROD);

  root.render(<Root />);
} catch (e) {
  root.render(<EnvUnsupported />);
}
