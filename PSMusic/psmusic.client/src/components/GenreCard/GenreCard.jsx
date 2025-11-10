import React from 'react';
import styles from './GenreCard.module.css';

const GenreCard = ({ genre, variant = 'default' }) => {
    const gradients = {
        default: `linear-gradient(135deg, ${genre.color}, ${genre.color}80)`,
        soft: `linear-gradient(145deg, ${genre.color}55, #ffffff22)`,
        glow: `radial-gradient(circle at top left, ${genre.color}, #00000088)`,
        glass: `linear-gradient(135deg, ${genre.color}99, #453f3f33)`,
        vibrant: `conic-gradient(from 90deg, ${genre.color}, #ff8a00, #e52e71, ${genre.color})`,
    };

    return (
        <div
            className={styles['genre-card']}
            style={{ background: gradients[variant] || gradients.default }}
        >
            <h3 className={styles['genre-card-title']}>{genre.title}</h3>
            <img src={genre.imageUrl} alt={genre.title} className={styles['genre-card-image']} />
        </div>
    );
};

export default GenreCard;
