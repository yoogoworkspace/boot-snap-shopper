import { useEffect } from "react";

export default function NativeAd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//pl27422384.profitableratecpm.com/7b07eac685c25792faed949f6fcd48cc/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    const adContainer = document.getElementById("container-7b07eac685c25792faed949f6fcd48cc");
    if (adContainer) {
      adContainer.innerHTML = ""; // clear old ad if any
      adContainer.appendChild(script);
    }
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        margin: "20px auto",
        display: "block",
      }}
    >
      <div id="container-7b07eac685c25792faed949f6fcd48cc"></div>
    </div>
  );
}
