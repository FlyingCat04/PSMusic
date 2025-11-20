import React from 'react';
import { Play } from 'lucide-react';
import styles from './ItemCardColumn.module.css';

const PLACEHOLDER_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='#374151'/></svg>`;
const PLACEHOLDER_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(PLACEHOLDER_SVG)}`;

const handleImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = PLACEHOLDER_DATA_URL;
  e.currentTarget.classList.add(styles['image-placeholder']);
};

const ItemCardColumn = ({ item, type = 'song' }) => {
    // If no item data, show skeleton
    if (!item) {
        return (
            <div className={styles['item-card-column']}>
                <div className={styles['item-card-column-image-skeleton']}></div>
                <div className={styles['item-card-column-title-skeleton']}></div>
                <div className={styles['item-card-column-artist-skeleton']}></div>
            </div>
        );
    }

    const imageUrl = item.imageUrl || item.avatarUrl || PLACEHOLDER_DATA_URL;
    const title = item.title || item.name || 'Unknown';
    const subtitle = type === 'artist' ? (item.bio || 'Artist') : (item.artist || item.artistName || 'Unknown Artist');

    return (
        <div className={styles['item-card-column']}>
            <div className={styles['image-wrapper']}>
                <img 
                    src={imageUrl} 
                    alt={title} 
                    className={styles['item-card-column-image']}
                    onError={handleImgError}
                />
                <div className={styles['play-button-overlay']}>
                    <Play className={styles['play-icon']} fill="currentColor" />
                </div>
            </div>
            <h4 className={styles['item-card-column-title']}>{title}</h4>
            {type !== 'artist' && <p className={styles['item-card-column-artist']}>{subtitle}</p>}
        </div>
    );
};

export default ItemCardColumn;