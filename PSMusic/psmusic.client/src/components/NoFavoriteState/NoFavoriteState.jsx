import React from "react";
import styles from "./NoFavoriteState.module.css";
import brainGif from "../../assets/images/music.gif";

const NoFavoriteState = ({ message = "Thêm bài hát yêu thích để xem ở đây!" }) => {
    return (
        <div className={styles.noFavoriteState}>
            <img 
                src={brainGif} 
                alt="No data" 
                className={styles.noFavoriteImage}
            />
            <p className={styles.noFavoriteMessage}>{message}</p>
        </div>
    );
};

export default NoFavoriteState;
