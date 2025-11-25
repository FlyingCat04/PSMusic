import React from 'react';
import styles from './GenreCard.module.css';

const GenreCard = ({ genre }) => {
    return (
        <div className={styles['genre-card']}>
            <img src={genre.imageUrl} alt={genre.title} className={styles['genre-card-image']} />
            <h3 className={styles['genre-card-title']}>{genre.title}</h3>
        </div>
    );
};

export default GenreCard;
