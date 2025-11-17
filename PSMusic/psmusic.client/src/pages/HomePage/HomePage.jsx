import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, RefreshCcw } from 'lucide-react';
import GenreCard from '../../components/GenreCard/GenreCard';
import ItemCardRow from '../../components/ItemCardRow/ItemCardRow';
import ItemCardColumn from '../../components/ItemCardColumn/ItemCardColumn';
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner';
import homeService from '../../services/homeService';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  
  // Refs để cuộn
  const artistsScrollRef = useRef(null);
  const songsScrollRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Lấy tất cả dữ liệu cùng lúc
      const data = await homeService.fetchPopularData();
      
      setCategories(data.categories || []);
      setArtists(data.artists || []);
      setSongs(data.songs || []);
    } catch (err) {
      console.error('Error fetching home page data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (ref, direction) => {
    if (!ref.current) return;
    
    const scrollAmount = 300;
    const newScrollPosition = ref.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    ref.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return <LoadSpinner />;
  }

  if (error) {
    return (
      <div className={styles['home-main-content']}>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <p>{error}</p>
          <button onClick={fetchData} style={{ marginTop: '16px', padding: '8px 16px', cursor: 'pointer' }}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['home-main-content']}>
      {/* Categories Section */}
      <section className={styles['content-section']}>
        <div className={styles['section-header']}>
          <h2 className={styles['section-title']}>Khám Phá Qua Thể Loại</h2>
          <Link to="/genres" className={styles['see-all-link']}>
            Tất cả
            <ChevronRight />
          </Link>
        </div>
        <div className={styles['genre-grid']}>
          {categories.length > 0 ? (
            categories.map((category) => (
              <GenreCard 
                key={category.id || category.categoryId} 
                genre={{
                  id: category.id || category.categoryId,
                  title: category.name || category.title,
                  imageUrl: category.imageUrl || 'https://via.placeholder.com/200',
                  color: category.color || '#FF4E50'
                }} 
              />
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Không có thể loại nào</p>
          )}
        </div>
      </section>

      {/* Artists Section */}
      <section className={styles['content-section']}>
        <div className={styles['section-header']}>
          <h2 className={styles['section-title']}>Nghệ Sĩ Thịnh Hành</h2>
          <Link to="/charts" className={styles['see-all-link']}>
            Tất cả
            <ChevronRight />
          </Link>
        </div>
        <div className={styles['scrollable-container']}>
          {artists.length > 8 && (
            <button 
              className={`${styles['scroll-arrow']} ${styles['scroll-arrow-left']}`}
              onClick={() => handleScroll(artistsScrollRef, 'left')}
              aria-label="Scroll left"
            >
              <ChevronLeft />
            </button>
          )}
          <div className={styles['songs-grid-row-scrollable']} ref={artistsScrollRef}>
            {artists.length > 0 ? (
              artists.map((artist) => (
                <ItemCardRow 
                  key={artist.id || artist.artistId} 
                  song={{
                    id: artist.id || artist.artistId,
                    title: artist.name,
                    artist: artist.bio || 'Nghệ sĩ',
                    imageUrl: artist.avatarURL || 'https://via.placeholder.com/100'
                  }} 
                />
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Không có nghệ sĩ nào</p>
            )}
          </div>
          {artists.length > 8 && (
            <button 
              className={`${styles['scroll-arrow']} ${styles['scroll-arrow-right']}`}
              onClick={() => handleScroll(artistsScrollRef, 'right')}
              aria-label="Scroll right"
            >
              <ChevronRight />
            </button>
          )}
        </div>
      </section>
      
      {/* Popular Songs Section */}
      <section className={styles['content-section']}>
        <div className={styles['section-header']}>
          <h2 className={styles['section-title']}>Bài Hát Thịnh Hành</h2>
          <Link to="/charts" className={styles['see-all-link']}>
            Tất cả
            <ChevronRight />
          </Link>
        </div>
        <div className={styles['scrollable-container']}>
          {songs.length > 5 && (
            <button 
              className={`${styles['scroll-arrow']} ${styles['scroll-arrow-left']}`}
              onClick={() => handleScroll(songsScrollRef, 'left')}
              aria-label="Scroll left"
            >
              <ChevronLeft />
            </button>
          )}
          <div className={styles['songs-grid-column-scrollable']} ref={songsScrollRef}>
            {songs.length > 0 ? (
              songs.map((song) => (
                <ItemCardColumn 
                  key={song.id || song.songId} 
                  item={{
                    id: song.id || song.songId,
                    title: song.title || song.name,
                    artist: Array.isArray(song.artistNames) 
                      ? song.artistNames.join(', ') 
                      : (song.artistName || song.artist || 'Unknown Artist'),
                    imageUrl: song.avatarUrl || 'https://via.placeholder.com/200'
                  }}
                  type="song"
                />
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Không có bài hát nào</p>
            )}
          </div>
          {songs.length > 5 && (
            <button 
              className={`${styles['scroll-arrow']} ${styles['scroll-arrow-right']}`}
              onClick={() => handleScroll(songsScrollRef, 'right')}
              aria-label="Scroll right"
            >
              <ChevronRight />
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
