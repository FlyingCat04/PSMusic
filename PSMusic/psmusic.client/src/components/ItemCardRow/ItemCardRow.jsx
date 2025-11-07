import React from 'react';
import './ItemCardRow.css';

const PLACEHOLDER_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%' height='100%'/></svg>`;
const PLACEHOLDER_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(PLACEHOLDER_SVG)}`;

const handleImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = PLACEHOLDER_DATA_URL;
  e.currentTarget.classList.add('image-placeholder');
};

const ItemCardRow = ({ song }) => {
    return (
        <div className="item-card-row">
        <img src={song.imageUrl} alt={song.title} className="item-card-row-image" onError={handleImgError} />
        <div className="item-card-row-info">
            <h4 className="item-card-row-title">{song.title}</h4>
            <p className="item-card-row-artist">{song.artist}</p>
        </div>
        {song.premium && (
            <span className="premium-tag">PREMIUM</span>
        )}
        </div>
    );
};

export default ItemCardRow;