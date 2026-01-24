import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
    const artists = song.artists || [];

    const handlePlayClick = (e) => {
        e.stopPropagation();
        
        if (song.mp3Url) {
            const songData = {
                ...song,
                audioUrl: song.mp3Url
            };
            playSong(songData);
        }
        
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
                <Play className={styles['play-icon']} fill="currentColor" />
            </button>
            </div>
        </div>

        {/* Info */}
        <div className={styles['item-info']}>
            <Link 
                to={`/song/${song.id}`}
                className={styles['item-title']}
            >
                {song.title}
            </Link>
            <p className={styles['item-artist']}>
                {artists.length > 0 ? (
                    artists.map((artist, index) => (
                        <React.Fragment key={artist.id || index}>
                            <Link 
                                to={`/artist/${artist.id}`}
                                className={styles['artist-link']}
                            >
                                {artist.name}
                            </Link>
                            {index < artists.length - 1 && <span>, </span>}
                        </React.Fragment>
                    ))
                ) : (
                    'Unknown Artist'
                )}
            </p>
        </div>

        {/* Action Buttons */}
        <div className={`${styles['action-buttons']} ${isHovered ? styles['show'] : ''}`}>
            <button 
                className={styles['action-btn']}
                onClick={handleFavoriteClick}
                aria-label="Like"
            >
                <Heart size={20} />
            </button>
        </div>
    </div>
    );
};

export default ItemTopCharts;