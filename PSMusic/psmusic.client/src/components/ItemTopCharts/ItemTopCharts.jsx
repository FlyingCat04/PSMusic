import React, { useState } from 'react';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import styles from './ItemTopCharts.module.css';
import { usePlayer } from '../../contexts/PlayerContext';

const PLACEHOLDER_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%' height='100%'/></svg>`;
const PLACEHOLDER_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(PLACEHOLDER_SVG)}`;

const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = PLACEHOLDER_DATA_URL;
    e.currentTarget.classList.add(styles['image-placeholder']);
};

const ItemTopCharts = ({ song, rank, onPlay, onFavorite, onMenu }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { playSong } = usePlayer();

    const handlePlayClick = (e) => {
        e.stopPropagation();
        
        if (song.mp3Url) {
            const songData = {
                ...song,
                audioUrl: song.mp3Url
            };
            playSong(songData);
        }
        

        const handlePlayClick = (e) => {
            e.stopPropagation();
            if (onPlay) onPlay(song);
        };

        const handleFavoriteClick = (e) => {
            e.stopPropagation();
            if (onFavorite) onFavorite(song);
        };

        const handleMenuClick = (e) => {
            e.stopPropagation();
            if (onMenu) onMenu(song);
        };

        return (
            <div
                className={styles['item-top-charts']}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Rank Number */}
                {rank && (
                    <span className={`${styles['rank-number']} ${rank <= 3 ? styles[`rank-${rank}`] : ''}`}>
                        {rank}
                    </span>
                )}

                {/* Image với Play Button */}
                <div className={styles['image-container']}>
                    <img
                        src={song.imageUrl}
                        alt={song.title}
                        className={styles['item-image']}
                        onError={handleImgError}
                    />
                    <div className={`${styles['play-overlay']} ${isHovered ? styles['show'] : ''}`}>
                        <button
                            className={styles['play-button']}
                            onClick={handlePlayClick}
                            aria-label="Play"
                        >
                            <Play size={24} fill="currentColor" />
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className={styles['item-info']}>
                    <h4
                        className={styles['item-title']}
                        onClick={handlePlayClick}
                    >
                        {song.title}
                    </h4>
                    <h4 className={styles['item-title']}>{song.title}</h4>
                    <p className={styles['item-artist']}>{song.artist}</p>
                </div>

                {/* Premium Badge */}
                {song.premium && (
                    <span className={styles['premium-badge']}>PREMIUM</span>
                )}

                {/* Action Buttons */}
                <div className={`${styles['action-buttons']} ${isHovered ? styles['show'] : ''}`}>
                    <button
                        className={styles['action-btn']}
                        onClick={handleFavoriteClick}
                        aria-label="Like"
                    >
                        <Heart size={20} />
                    </button>
                    <button
                        className={styles['action-btn']}
                        onClick={handleMenuClick}
                        aria-label="More"
                    >
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>
        );
    }
};

export default ItemTopCharts;
