import React from "react";
import styles from "./SectionHeader.module.css";
import { useTranslation } from "react-i18next";


const SectionHeader = ({ title, onMore }) => {
    const { t } = useTranslation();
    return (
        <div className={styles["section-header"]}>
            <h2 className={styles["section-title"]}>{title}</h2>
            {onMore && (
                <button
                    type="button"
                    className={styles["see-all-link"]}
                    onClick={onMore}
                >
                    {t('see_all')}
                    <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginLeft: 4 }}>
                        <path fill="currentColor" d="M9 18l6-6-6-6v12z" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SectionHeader;