import React from "react";

const Sidebar = ({ sheets, onSheetSelect }) => {
  return (
    <div
      style={{
        background: "var(--sidebar-bg)",
        width: "250px",
        padding: "20px",
      }}
    >
      <h2>Sheets</h2>
      <ul>
        {sheets.map((sheet) => (
          <li
            key={sheet.id}
            style={{
              cursor: "pointer",
              padding: "10px",
              color: "var(--text-color)",
            }}
            onClick={() => onSheetSelect(sheet.id)}
          >
            {sheet.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
