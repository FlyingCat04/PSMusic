import React from 'react';
import { Link } from 'react-router-dom';
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
    const { playSong } = usePlayer();
    const artists = song.artists || [];

    const handleClick = () => {
        if (song.mp3Url) {
            const songData = {
                ...song,
                audioUrl: song.mp3Url
            };
            playSong(songData);
        }
    };

    return (
        <div 
            className={styles['item-card-row']} 
            onClick={handleClick} 
        >
            <img src={song.imageUrl} alt={song.title} className={styles['item-card-row-image']} onError={handleImgError} />
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
        </div>
    );
};

export default ItemCardRow;