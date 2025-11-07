import React from 'react';
import './ItemCardColumn.css';

const ItemCardColumn = () => {
    return (
        <div className="item-card-column">
            <div className="item-card-column-image"></div>
            <div className="item-card-column-title"></div>
            <div className="item-card-column-artist"></div>
        </div>
    );
};

export default ItemCardColumn;