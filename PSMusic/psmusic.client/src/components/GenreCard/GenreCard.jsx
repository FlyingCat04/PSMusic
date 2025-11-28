import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GenreCard.module.css';

const GenreCard = ({ genre }) => {
    return (
        <div className={styles['genre-card']}>
            <Link to={`/category/${genre.id}`} className={styles['genre-card-link']}>
                <img src={genre.imageUrl} alt={genre.title} className={styles['genre-card-image']} />
                <h3 className={styles['genre-card-title']}>{genre.title}</h3>
            </Link>
        </div>
    );
};

export default GenreCard;
