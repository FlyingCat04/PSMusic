import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, RefreshCcw } from 'lucide-react';
import GenreCard from '../../components/GenreCard/GenreCard';
import ItemCardRow from '../../components/ItemCardRow/ItemCardRow';
import ItemCardColumn from '../../components/ItemCardColumn/ItemCardColumn';
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner';
import homeService from '../../services/homeService';
import topChartsService from '../../services/topChartsService';
import { useDataCache } from '../../contexts/DataCacheContext';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { getHomePageData, setHomePageData } = useDataCache();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [popSongs, setPopSongs] = useState([]);
  const [youthSongs, setYouthSongs] = useState([]);
  
  // Refs để cuộn
  const artistsScrollRef = useRef(null);
  const songsScrollRef = useRef(null);
  const popSongsScrollRef = useRef(null);
  const youthSongsScrollRef = useRef(null);

  useEffect(() => {
    const cachedData = getHomePageData();
    if (cachedData) {
      setCategories(cachedData.categories || []);
      setArtists(cachedData.artists || []);
      setSongs(cachedData.songs || []);
      setPopSongs(cachedData.popSongs || []);
      setYouthSongs(cachedData.youthSongs || []);
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Lấy tất cả dữ liệu cùng lúc
      const [homeData, popData, youthData] = await Promise.all([
        homeService.fetchPopularData(),
        topChartsService.getPopularSongsByCategory(1, 1, 10), // Nhạc Pop
        topChartsService.getPopularSongsByCategory(2, 1, 10), // Nhạc Trẻ
      ]);
      
      const data = {
        categories: homeData.categories || [],
        artists: homeData.artists || [],
        songs: homeData.songs || [],
        popSongs: popData?.items || [],
        youthSongs: youthData?.items || [],
      };
      
      setCategories(data.categories);
      setArtists(data.artists);
      setSongs(data.songs);
      setPopSongs(data.popSongs);
      setYouthSongs(data.youthSongs);
      
      // Cache data
      setHomePageData(data);
    } catch (err) {
      //console.error('Error fetching home page data:', err);
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
      window.scrollTo(0, 0),
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
    window.scrollTo(0, 0),
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
            categories.slice(0, 8).map((category) => (
              <GenreCard 
                key={category.id || category.categoryId} 
                genre={{
                  id: category.id || category.categoryId,
                  title: category.name || category.title,
                  imageUrl: category.avatarUrl || 'https://via.placeholder.com/200',
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
          <div className={styles['songs-grid-column-scrollable']} ref={artistsScrollRef}>
            {artists.length > 0 ? (
              artists.map((artist) => (
                <ItemCardColumn 
                  key={artist.id || artist.artistId} 
                  item={{
                    id: artist.id || artist.artistId,
                    title: artist.name,
                    artist: artist.bio || 'Nghệ sĩ',
                    imageUrl: artist.avatarUrl || 'https://via.placeholder.com/100'
                  }}
                  type="artist"
                />
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Không có nghệ sĩ nào</p>
            )}
          </div>
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
          <div className={styles['songs-grid-column-scrollable']} ref={songsScrollRef}>
            {songs.length > 0 ? (
              songs.map((song) => (
                <ItemCardColumn 
                  key={song.id || song.songId} 
                  item={{
                    id: song.id || song.songId,
                    title: song.title || song.name,
                    artists: Array.isArray(song.artists) 
                      ? song.artists 
                      : [{ name: 'Unknown Artist' }],
                    imageUrl: song.avatarUrl || 'https://via.placeholder.com/200',
                    mp3Url: song.mp3Url
                  }}
                  type="song"
                />
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Không có bài hát nào</p>
            )}
          </div>
        </div>
      </section>

      {/* Pop Songs Section */}
      <section className={styles['content-section']}>
        <div className={styles['section-header']}>
          <h2 className={styles['section-title']}>Nhạc Pop Thịnh Hành</h2>
          <Link to="/charts/pop" className={styles['see-all-link']}>
            Tất cả
            <ChevronRight />
          </Link>
        </div>
        <div className={styles['scrollable-container']}>
          <div className={styles['songs-grid-column-scrollable']} ref={popSongsScrollRef}>
            {popSongs.length > 0 ? (
              popSongs.map((song) => (
                <ItemCardColumn 
                  key={song.id || song.songId} 
                  item={{
                    id: song.id || song.songId,
                    title: song.title || song.name,
                    artists: Array.isArray(song.artists) 
                      ? song.artists 
                      : [{ name: 'Unknown Artist' }],
                    imageUrl: song.avatarUrl || song.imageUrl || 'https://via.placeholder.com/200',
                    mp3Url: song.mp3Url
                  }}
                  type="song"
                />
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Không có bài hát nào</p>
            )}
          </div>
        </div>
      </section>

      {/* Youth Songs Section */}
      <section className={styles['content-section']}>
        <div className={styles['section-header']}>
          <h2 className={styles['section-title']}>Nhạc Trẻ Thịnh Hành</h2>
          <Link to="/charts" className={styles['see-all-link']}>
            Tất cả
            <ChevronRight />
          </Link>
        </div>
        <div className={styles['scrollable-container']}>
          <div className={styles['songs-grid-column-scrollable']} ref={youthSongsScrollRef}>
            {youthSongs.length > 0 ? (
              youthSongs.map((song) => (
                <ItemCardColumn 
                  key={song.id || song.songId} 
                  item={{
                    id: song.id || song.songId,
                    title: song.title || song.name,
                    artists: Array.isArray(song.artists) 
                      ? song.artists 
                      : [{ name: 'Unknown Artist' }],
                    imageUrl: song.avatarUrl || song.imageUrl || 'https://via.placeholder.com/200',
                    mp3Url: song.mp3Url
                  }}
                  type="song"
                />
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Không có bài hát nào</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
