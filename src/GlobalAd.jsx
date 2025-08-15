import { useEffect } from "react";

export default function Ad() {
  useEffect(() => {
    // Define the atOptions object globally so the ad script can access it
    window.atOptions = {
      key: "f2a67666eb0d88a27db84396457aaa9a",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };

    // Create and append the ad script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//www.highperformanceformat.com/f2a67666eb0d88a27db84396457aaa9a/invoke.js";
    script.async = true;

    const container = document.getElementById("ad-container");
    if (container) {
      container.innerHTML = ""; // Clear old ad if it re-renders
      container.appendChild(script);
    }
  }, []);

  return (
    <div
      id="ad-container"
      style={{
        textAlign: "center",
        margin: "20px auto",
      }}
    ></div>
  );
}
