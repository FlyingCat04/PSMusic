import React from 'react';
import styles from './ItemCardColumn.module.css';

const ItemCardColumn = () => {
    return (
        <div className={styles['item-card-column']}>
            <div className={styles['item-card-column-image']}></div>
            <div className={styles['item-card-column-title']}></div>
            <div className={styles['item-card-column-artist']}></div>
        </div>
    );
};

export default ItemCardColumn;