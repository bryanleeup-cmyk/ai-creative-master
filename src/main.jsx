import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

function BootError({ error }) {
  const message = error?.message || String(error || "未知错误");
  const details = error?.stack || "";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 0% 0%, rgba(214,238,255,0.95), transparent 28%), radial-gradient(circle at 100% 0%, rgba(236,231,255,0.9), transparent 24%), #f8fbff",
        padding: "32px",
        color: "#202634",
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <div
        style={{
          width: "min(920px, 100%)",
          borderRadius: "24px",
          border: "1px solid #e3e9f5",
          background: "#ffffff",
          boxShadow: "0 18px 42px rgba(100, 118, 158, 0.12)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "28px 32px", borderBottom: "1px solid #edf1f6" }}>
          <div style={{ fontSize: "28px", fontWeight: 700 }}>页面启动失败</div>
          <div style={{ marginTop: "8px", fontSize: "14px", lineHeight: 1.8, color: "#6d778a" }}>
            页面没有正常渲染，我已经把报错信息直接展示出来，方便继续排查。
          </div>
        </div>
        <div style={{ padding: "28px 32px" }}>
          <div
            style={{
              borderRadius: "18px",
              background: "#f8faff",
              padding: "20px",
              fontSize: "15px",
              lineHeight: 1.8,
              color: "#324056",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {message}
            {details ? `\n\n${details}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

const renderBootError = (error) => {
  console.error("App boot failed:", error);
  root.render(<BootError error={error} />);
};

import("./App")
  .then(({ default: App }) => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  })
  .catch(renderBootError);
