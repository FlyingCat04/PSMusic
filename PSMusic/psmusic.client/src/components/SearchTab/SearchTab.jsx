import React from "react";
import "./SearchTab.css";

const SearchTabs = ({
  items = ["Tất cả", "Bài hát", "Playlists", "Nghệ sĩ", "Albums", "Videos"],
  active = "Tất cả",
  onChange,
}) => {
  return (
    <div className="sr-tabs" role="tablist" aria-label="Search categories">
      {items.map((t) => (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={active === t}
          className={`sr-tab ${active === t ? "is-active" : ""}`}
          onClick={() => onChange?.(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default SearchTabs;