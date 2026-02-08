import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./NoFavoriteState.module.css";
import brainGif from "../../assets/images/music.gif";

const NoFavoriteState = ({ message }) => {
    const { t } = useTranslation();
    const displayMessage = message || t('no_favorite_msg');
    return (
        <div className={styles.noFavoriteState}>
            <img
                src={brainGif}
                alt="No data"
                className={styles.noFavoriteImage}
            />
            <p className={styles.noFavoriteMessage}>{displayMessage}</p>
        </div>
    );
};

export default NoFavoriteState;
