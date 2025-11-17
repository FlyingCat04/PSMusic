import React from "react";
import styles from "./SquareCard.module.css";

const SquareCard = ({ imageUrl, title, subtitle, circle = false, onClick }) => (
    <button
        type="button"
        className={styles["result-card"]}
        onClick={onClick}
    >
        <img
            className={`${styles["result-cover"]} ${circle ? styles["result-cover-circle"] : ""
                }`}
            src={imageUrl}
            alt=""
        />
        <div className={styles["result-title"]}>{title}</div>
        {subtitle && (
            <div className={styles["result-subtitle"]}>{subtitle}</div>
        )}
    </button>
);

export default SquareCard;