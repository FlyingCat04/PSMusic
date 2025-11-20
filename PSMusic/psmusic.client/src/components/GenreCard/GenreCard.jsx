import React from 'react';
import styles from './GenreCard.module.css';

const GenreCard = ({ genre }) => {
    return (
        <div className={styles['genre-card']}>
            <img src={"https://image-cdn.nct.vn/radio/2025/10/17/d/S/F/Z/1760692180800_300.png"} alt={genre.title} className={styles['genre-card-image']} />
            <h3 className={styles['genre-card-title']}>{genre.title}</h3>
        </div>
    );
};

export default GenreCard;
