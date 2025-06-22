import React from "react";

const Spinner = ({ size = 48, color = "#2563eb", className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div
      className="animate-spin rounded-full border-t-2 border-b-2"
      style={{
        width: size,
        height: size,
        borderColor: `${color} transparent ${color} transparent`,
        borderWidth: size / 12,
      }}
    ></div>
  </div>
);

export default Spinner;
