import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

// サンドボックス環境のみMSWを有効にする
const setupMocks = async () => {
  if (outputs.custom.isSandbox) {
    const { setupMSW } = await import("./mocks/browser");
    await setupMSW();
  }
  
  Amplify.configure(outputs);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// 関数を実行
setupMocks();
