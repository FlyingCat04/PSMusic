import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import GenreCard from '../../components/GenreCard/GenreCard';
import ItemCardColumn from '../../components/ItemCardColumn/ItemCardColumn';
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner';
import EmptyState from '../../components/EmptyState/EmptyState';
import homeService from '../../services/homeService';
import topChartsService from '../../services/topChartsService';
import { useDataCache } from '../../contexts/DataCacheContext';
import styles from './HomePage.module.css';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  const { getHomePageData, setHomePageData } = useDataCache();
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
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
      setError(t('error_fetching_data'));
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

  // if (error) {
  //   return <EmptyState />;

  //   // return (
  //   //   window.scrollTo(0, 0),
  //   //   <div className={styles['home-main-content']}>
  //   //     <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
  //   //       <p>{error}</p>
  //   //       <button onClick={fetchData} style={{ marginTop: '16px', padding: '8px 16px', cursor: 'pointer' }}>
  //   //         Thử lại
  //   //       </button>
  //   //     </div>
  //   //   </div>
  //   // );
  // }

  const hasNoData = categories.length === 0 && artists.length === 0 && songs.length === 0 && popSongs.length === 0 && youthSongs.length === 0;

  if (hasNoData && !loading) {
    return <EmptyState message={t('empty_content')} />;
  }

  return (
    window.scrollTo(0, 0),
    <div className={styles['home-main-content']}>
      {/* Categories Section */}
      {categories.length > 0 && (
        <section className={styles['content-section']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>{t('discover_by_genre')}</h2>
            <Link to="/genres" className={styles['see-all-link']}>
              {t('see_all')}
              <ChevronRight />
            </Link>
          </div>
          <div className={styles['genre-grid']}>
            {categories.slice(0, 8).map((category) => (
              <GenreCard
                key={category.id || category.categoryId}
                genre={{
                  id: category.id || category.categoryId,
                  title: category.name || category.title,
                  imageUrl: category.avatarUrl || '',
                  color: category.color || '#FF4E50'
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Artists Section */}
      {artists.length > 0 && (
        <section className={styles['content-section']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>{t('trending_artists')}</h2>
            <Link to="/charts" className={styles['see-all-link']}>
              {t('see_all')}
              <ChevronRight />
            </Link>
          </div>
          <div className={styles['scrollable-container']}>
            <div className={styles['songs-grid-column-scrollable']} ref={artistsScrollRef}>
              {artists.map((artist) => (
                <ItemCardColumn
                  key={artist.id || artist.artistId}
                  item={{
                    id: artist.id || artist.artistId,
                    title: artist.name,
                    artist: artist.bio || 'Nghệ sĩ',
                    imageUrl: artist.avatarUrl || ''
                  }}
                  type="artist"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Songs Section */}
      {songs.length > 0 && (
        <section className={styles['content-section']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>{t('trending_songs')}</h2>
            <Link to="/charts" className={styles['see-all-link']}>
              {t('see_all')}
              <ChevronRight />
            </Link>
          </div>
          <div className={styles['scrollable-container']}>
            <div className={styles['songs-grid-column-scrollable']} ref={songsScrollRef}>
              {songs.map((song) => (
                <ItemCardColumn
                  key={song.id || song.songId}
                  item={{
                    id: song.id || song.songId,
                    title: song.title || song.name,
                    artists: Array.isArray(song.artists)
                      ? song.artists
                      : [{ name: 'Unknown Artist' }],
                    imageUrl: song.avatarUrl || '',
                    mp3Url: song.mp3Url
                  }}
                  type="song"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pop Songs Section */}
      {popSongs.length > 0 && (
        <section className={styles['content-section']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>{t('trending_pop')}</h2>
            <Link to="/charts" className={styles['see-all-link']}>
              {t('see_all')}
              <ChevronRight />
            </Link>
          </div>
          <div className={styles['scrollable-container']}>
            <div className={styles['songs-grid-column-scrollable']} ref={popSongsScrollRef}>
              {popSongs.map((song) => (
                <ItemCardColumn
                  key={song.id || song.songId}
                  item={{
                    id: song.id || song.songId,
                    title: song.title || song.name,
                    artists: Array.isArray(song.artists)
                      ? song.artists
                      : [{ name: 'Unknown Artist' }],
                    imageUrl: song.avatarUrl || song.imageUrl || '',
                    mp3Url: song.mp3Url
                  }}
                  type="song"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Youth Songs Section */}
      {youthSongs.length > 0 && (
        <section className={styles['content-section']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>{t('trending_youth')}</h2>
            <Link to="/charts" className={styles['see-all-link']}>
              {t('see_all')}
              <ChevronRight />
            </Link>
          </div>
          <div className={styles['scrollable-container']}>
            <div className={styles['songs-grid-column-scrollable']} ref={youthSongsScrollRef}>
              {youthSongs.map((song) => (
                <ItemCardColumn
                  key={song.id || song.songId}
                  item={{
                    id: song.id || song.songId,
                    title: song.title || song.name,
                    artists: Array.isArray(song.artists)
                      ? song.artists
                      : [{ name: 'Unknown Artist' }],
                    imageUrl: song.avatarUrl || song.imageUrl || '',
                    mp3Url: song.mp3Url
                  }}
                  type="song"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
