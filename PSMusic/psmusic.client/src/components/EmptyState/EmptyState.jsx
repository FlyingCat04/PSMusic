import React from "react";
import styles from "./EmptyState.module.css";
import brainGif from "../../assets/images/brain.gif";

const EmptyState = ({ message = "Oops! Hiện tại không có dữ liệu :(" }) => {
    return (
        <div className={styles.emptyState}>
            <img 
                src={brainGif} 
                alt="No data" 
                className={styles.emptyImage}
            />
            <p className={styles.emptyMessage}>{message}</p>
        </div>
    );
};

export default EmptyState;
