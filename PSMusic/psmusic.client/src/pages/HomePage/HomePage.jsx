import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCcw } from 'lucide-react';
import GenreCard from '../../components/GenreCard/GenreCard';
import ItemCardRow from '../../components/ItemCardRow/ItemCardRow';
import ItemCardColumn from '../../components/ItemCardColumn/ItemCardColumn';
import styles from './HomePage.module.css';

// Mock data
const SUGGESTED_SONGS = [
  { id: 1, title: 'Thích Em Hơi Nhiều', artist: 'Wren Evans', imageUrl: 'https://picsum.photos/seed/song1/100/100' },
  { id: 2, title: 'Bích Thượng Quan / ...', artist: 'Cúc Tịnh Y / 鞠婧祎', imageUrl: 'https://picsum.photos/seed/song2/100/100' },
  { id: 3, title: 'HER', artist: 'MINNIE', imageUrl: 'https://picsum.photos/seed/song3/100/100', isPremium: true },
  { id: 4, title: 'PHÓNG ZÌN ZÌN', artist: 'tlinh, Low G', imageUrl: 'https://picsum.photos/seed/song4/100/100' },
  { id: 5, title: 'Cây Đèn Thần', artist: 'Hồ Ngọc Hà', imageUrl: 'https://picsum.photos/seed/song5/100/100' },
  { id: 6, title: 'Khiêm Tốn / 谦让', artist: 'Vương Tĩnh Văn / 王靖雯', imageUrl: 'https://picsum.photos/seed/song6/100/100' },
  { id: 7, title: 'Lạnh Lẽo / 涼涼', artist: 'Trương Bích Thần / 张碧晨, ...', imageUrl: 'https://picsum.photos/seed/song7/100/100' },
  { id: 8, title: 'Rồi Tới Luôn', artist: 'Nal', imageUrl: 'https://picsum.photos/seed/song8/100/100' },
  { id: 9, title: 'Sài Gòn Đau Lòng Quá', artist: 'Hứa Kim Tuyền, ...', imageUrl: 'https://picsum.photos/seed/song9/100/100' },
];

const GENRES = [
  { id: 1, title: 'Gen Z Hits', imageUrl: 'https://images2.thanhnien.vn/528068263637045248/2024/4/3/jack-1712114239424422902059.jpg', color: '#FF4E50' },
  { id: 2, title: 'TikTok Thịnh Hành', imageUrl: 'https://images2.thanhnien.vn/528068263637045248/2024/4/3/jack-1712114239424422902059.jpg', color: '#00C9A7' },
  { id: 3, title: 'K-Pop', imageUrl: 'https://images2.thanhnien.vn/528068263637045248/2024/4/3/jack-1712114239424422902059.jpg', color: '#FF61D2' },
  { id: 4, title: 'Indie Việt', imageUrl: 'https://images2.thanhnien.vn/528068263637045248/2024/4/3/jack-1712114239424422902059.jpg', color: '#607D8B' },
  { id: 5, title: 'Yêu', imageUrl: 'https://images2.thanhnien.vn/528068263637045248/2024/4/3/jack-1712114239424422902059.jpg', color: '#5B86E5' },
  { id: 6, title: 'V-Pop Thịnh Hành', imageUrl: 'https://images2.thanhnien.vn/528068263637045248/2024/4/3/jack-1712114239424422902059.jpg', color: '#FF6F61' },
  { id: 7, title: 'Remix Việt', imageUrl: 'https://images2.thanhnien.vn/528068263637045248/2024/4/3/jack-1712114239424422902059.jpg', color: '#9C27B0' },
  { id: 8, title: 'Hip-Hop Việt', imageUrl: 'https://images2.thanhnien.vn/528068263637045248/2024/4/3/jack-1712114239424422902059.jpg', color: '#00BCD4' }
];

const HomePage = () => {
  return (
    <div className={styles['home-main-content']}>
      <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>Khám Phá Qua Thể Loại</h2>
            <Link to="/genres" className={styles['see-all-link']}>
              Tất cả
              <ChevronRight />
            </Link>
        </div>
      <section className={styles['content-section']}>
        <div className={styles['genre-grid']}>
          {GENRES.map((genre) => (
            <GenreCard key={genre.id} genre={genre} variant="glass" />
          ))}
        </div>
      </section>

      <section className={styles['content-section']}>
        <div className={styles['section-header']}>
          <h2 className={styles['section-title']}>Gợi Ý Bài Hát</h2>
          <button className={styles['refresh-button']}>
            <div className={styles['refresh-icon']}>
              <RefreshCcw />
            </div>
            <span>Làm mới</span>
          </button>
        </div>
        <div className={styles['songs-grid-row']}>
          {SUGGESTED_SONGS.map((song) => (
            <ItemCardRow key={song.id} song={song} />
          ))}
        </div>
      </section>
      
      <section className={styles['content-section']}>
        <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>Bài Hát Thịnh Hành</h2>
            <Link to="/charts" className={styles['see-all-link']}>
              Tất cả
              <ChevronRight />
            </Link>
        </div>
        <div className={styles['songs-grid-column']}>
            {[1,2,3,4,5].map(i => (
                 <ItemCardColumn key={i} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
