import React, { useState } from "react";

function Description({ text }) {
  const [expanded, setExpanded] = useState(false);
  const showButton = text?.length > 100;
  return (
    <div
      className={`relative ${
        expanded ? "h-48" : "h-12"
      } overflow-auto px-2 py-1`}
    >
      <p
        className={`text-sm text-gray-300 whitespace-pre-line ${
          expanded ? "" : "line-clamp-1"
        } `}
      >
        {text}
      </p>
      {showButton && (
        <button
          className="text-xs text-White mt-1 hover:underline"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show less" : "...more"}
        </button>
      )}
    </div>
  );
}

export default Description;
