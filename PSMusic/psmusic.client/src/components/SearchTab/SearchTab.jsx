import React from "react";
import styles from "./SearchTab.module.css";

const SearchTabs = ({
    items = ["Tất cả", "Bài hát", "Playlists", "Nghệ sĩ", "Albums"],
    active = "Tất cả",
    onChange,
}) => {
    return (
        <div
            className={styles["sr-tabs"]}
            role="tablist"
            aria-label="Search categories"
        >
            {items.map((t) => (
                <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={active === t}
                    className={`${styles["sr-tab"]} ${active === t ? styles["sr-tab-active"] : ""
                        }`}
                    onClick={() => onChange?.(t)}
                >
                    {t}
                </button>
            ))}
        </div>
    );
};

export default SearchTabs;
