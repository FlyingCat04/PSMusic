import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import styles from './ItemCardRow.module.css';
import { usePlayer } from '../../contexts/PlayerContext';

const PLACEHOLDER_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%' height='100%'/></svg>`;
const PLACEHOLDER_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(PLACEHOLDER_SVG)}`;

const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = PLACEHOLDER_DATA_URL;
    e.currentTarget.classList.add(styles['image-placeholder']);
};

const ItemCardRow = ({ song }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { currentSong, isPlaying, togglePlay, startNewSession } = usePlayer();
    const artists = song.artists || [];

    const isCurrentPlaying = currentSong?.id === song.id;

    const handlePlayClick = (e) => {
        e.stopPropagation();

        // if (song.mp3Url) {
        if (isCurrentPlaying) {
            togglePlay();
        } else if (song.mp3Url || song.audioUrl) {
            const url = song.mp3Url || song.audioUrl;
            const songData = {
                ...song,
                audioUrl: url,
                mp3Url: url
            };
            startNewSession(songData);
        }
    };

    return (
        <div 
            className={`${styles['item-card-row']} ${isCurrentPlaying && isPlaying ? styles['active'] : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image với Play Button */}
            <div className={styles['image-container']}>
                <img
                    src={song.imageUrl}
                    alt={song.title}
                    className={styles['item-card-row-image']}
                    onError={handleImgError}
                />
                {/* Hiển thị equalizer khi đang phát */}
                {isCurrentPlaying && isPlaying ? (
                    <div className={styles['cover-playing']}>
                        <div className={styles['eq']}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                ) : (
                    /* Hiển thị play button khi hover */
                    <div className={`${styles['play-overlay']} ${isHovered ? styles['show'] : ''}`}>
                        <button 
                            className={styles['play-button']}
                            onClick={handlePlayClick}
                            aria-label="Play"
                        >
                            <Play className={styles['play-icon']} fill="currentColor" />
                        </button>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className={styles['item-card-row-info']}>
                <Link
                    to={`/song/${song.id}`}
                    className={styles['item-card-row-title']}
                >
                    {song.title}
                </Link>
                <p className={styles['item-card-row-artist']}>
                    {artists.length > 0 ? (
                        artists.map((artist, index) => (
                            <React.Fragment key={artist.id || index}>
                                {artist.id ? (
                                    <Link
                                        to={`/artist/${artist.id}`}
                                        className={styles['artist-link']}
                                    >
                                        {artist.name}
                                    </Link>
                                ) : (
                                    <span className={styles['artist-link']}>
                                        {artist.name}
                                    </span>
                                )}
                                {index < artists.length - 1 && <span>, </span>}
                            </React.Fragment>
                        ))
                    ) : (
                        'Unknown Artist'
                    )}
                </p>
            </div>
        </div>
    );
};

export default ItemCardRow;