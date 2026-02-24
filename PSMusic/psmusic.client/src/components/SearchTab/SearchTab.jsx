import React from "react";
import styles from "./SearchTab.module.css";

// items: [{ type: string, label: string }]
// active: type key (ví dụ "all", "songs", "artists")
const SearchTabs = ({
    items = [],
    active = "all",
    onChange,
}) => {
    return (
        <div
            className={styles["sr-tabs"]}
            role="tablist"
            aria-label="Search categories"
        >
            {items.map(({ type, label }) => (
                <button
                    key={type}
                    type="button"
                    role="tab"
                    aria-selected={active === type}
                    className={`${styles["sr-tab"]} ${active === type ? styles["sr-tab-active"] : ""
                        }`}
                    onClick={() => onChange?.(type)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default SearchTabs;
