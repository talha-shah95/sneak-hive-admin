// src/components/MenuIcon.jsx
import React from "react";
// import { MenuIcons } from "../../../../assets/images/index";

const MenuIcon = ({ svgDataUrl, size = 18, color = "#fff" }) => {
  if (!svgDataUrl) return null;

  if (!svgDataUrl.startsWith("data:image/svg+xml")) {
    return (
      <img
        src={svgDataUrl}
        alt=""
        style={{ width: size, height: size, display: "inline-block" }}
      />
    );
  }

  // Decode URI
  const svgContent = decodeURIComponent(
    svgDataUrl.replace("data:image/svg+xml,", "")
  );

  // Replace hardcoded fill colors with currentColor
  const styledSvg = svgContent.replace(
    /fill=['"][^'"]+['"]/g,
    `fill="${color}"`
  );

  return (
    <span
      style={{ width: size, height: size, display: "inline-block" }}
      dangerouslySetInnerHTML={{ __html: styledSvg }}
    />
  );
};

export default MenuIcon;
