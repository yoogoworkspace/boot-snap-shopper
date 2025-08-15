import { useEffect } from "react";

export default function Ad() {
  useEffect(() => {
    // Ad settings
    window.atOptions = {
      key: "f2a67666eb0d88a27db84396457aaa9a",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };

    // Load ad script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//www.highperformanceformat.com/f2a67666eb0d88a27db84396457aaa9a/invoke.js";
    script.async = true;

    const container = document.getElementById("ad-container");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "20px auto",
      }}
    >
      <div
        id="ad-container"
        style={{
          maxWidth: "100%",
          overflow: "hidden",
        }}
      ></div>
    </div>
  );
}
