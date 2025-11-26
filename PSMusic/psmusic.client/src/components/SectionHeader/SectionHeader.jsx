import React from "react";
import styles from "./SectionHeader.module.css";


const SectionHeader = ({ title, onMore }) => (
    <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>{title}</h2>
        {onMore && (
            <button
                type="button"
                className={styles["see-all-link"]}
                onClick={onMore}
            >
                Xem tất cả
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginLeft: 4 }}>
                    <path fill="currentColor" d="M9 18l6-6-6-6v12z" />
                </svg>
            </button>
        )}
    </div>
);

export default SectionHeader;