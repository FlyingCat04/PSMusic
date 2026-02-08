import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import SettingsDropdown from '../SettingsDropdown/SettingsDropdown';
import UserDropdown from '../UserDropdown/UserDropdown';
import LoadSpinner from '../LoadSpinner/LoadSpinner';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import axiosInstance from '../../services/axiosInstance';
// import userService from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { user, loading } = useAuth();
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [topResults, setTopResults] = useState([]);
  const [avatarError, setAvatarError] = useState(false);
  const avatarURL = user?.avatarUrl || null;

  const handleImageError = () => {
    setAvatarError(true);
  };
  const goPrev = () => navigate(-1);
  const goNext = () => navigate(1);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setTopResults([]);
  };

  useEffect(() => {
    if (!isFocused) return;              // chỉ gợi ý khi ô search đang focus
    const kw = query.trim();
    if (kw.length < 2) {                 // quá ngắn thì không gọi API
      setSuggestions([]);
      return;
    }

    const handle = setTimeout(async () => {
      try {
        setLoadingSuggest(true);

        const res = await axiosInstance.get("/song/search", {
          params: {
            keyword: kw,
            page: 1,
            size: 5,
          },
        });

        const data = res.data || {};


        const results = Array.isArray(data.results) ? data.results : [];

        const rawTop = data.topResult || null;
        const topSuggestions = rawTop ? [rawTop] : [];

        const mappedTop = topSuggestions.map((s) => ({
          type: s.type || "song",
          id: s.id,
          title: s.title || s.name || t('untitled'),
          artist: Array.isArray(s.artistsName)
            ? s.artistsName.join(", ")
            : s.artistName || s.artist || "",
        }));

        const mapped = results.map((s) => ({
          type: s.type || "song",
          id: s.id,
          title: s.title || s.name || t('untitled'),
          artist: Array.isArray(s.artistsName)
            ? s.artistsName.join(", ")
            : s.artistName || s.artist || "",
        }));

        //console.log(mappedTop.length);

        setTopResults(mappedTop);
        setSuggestions(mapped);

      } catch (err) {
        //console.error(err);
        setSuggestions([]);
        setTopResults([]);
      } finally {
        setLoadingSuggest(false);
      }
    }, 300);


    return () => clearTimeout(handle);
  }, [query, isFocused]);

  return (
    <header className={styles.header}>
      <div className={styles['header-left']}>
        <div className={styles['navigation-arrows']}>
          <button className={`${styles['nav-arrow']}`} onClick={goPrev}>
            <ChevronLeft />
          </button>

          <button className={styles['nav-arrow']} onClick={goNext}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className={styles['search-bar']}>
        <div className={styles['search-icon']}>
          <Search />
        </div>
        <input
          type="text"
          placeholder={t('search_placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 150);
          }}
        />
        {query && (
          <button
            className={styles['clear-button']}
            onClick={handleClearSearch}
            type="button"
          >
            <X size={16} />
          </button>
        )}

        {isFocused && query.trim() && (
          <div className={styles.suggestBox}>
            {loadingSuggest && (
              <div className={styles.suggestItemMuted}>{t('searching_suggest')}</div>
            )}

            {!loadingSuggest &&
              suggestions.length === 0 &&
              topResults.length === 0 && (
                <div className={styles.suggestItemMuted}>{t('no_suggest')}</div>
              )}

            {!loadingSuggest && topResults.length > 0 &&
              topResults.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={styles.suggestItem}
                  onMouseDown={() => {
                    if (s.type === "artist") {
                      navigate(`/artist/${s.id}`);
                    } else {
                      navigate(`/song/${s.id}`);
                    }
                  }}
                >
                  <Search size={18} className={styles.suggestIcon} />
                  <div>
                    <div className={styles.suggestTitle}>{s.title}</div>
                    {s.artist && (
                      <div className={styles.suggestSubtitle}>{s.artist}</div>
                    )}
                  </div>
                </button>
              ))
            }

            {!loadingSuggest && suggestions.length > 0 &&
              suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={styles.suggestItem}
                  onMouseDown={() => {
                    if (s.type === "artist") {
                      navigate(`/artist/${s.id}`);
                    } else {
                      navigate(`/song/${s.id}`);
                    }
                  }}
                >
                  <Search size={18} className={styles.suggestIcon} />
                  <div>
                    <div className={styles.suggestTitle}>{s.title}</div>
                    {s.artist && (
                      <div className={styles.suggestSubtitle}>{s.artist}</div>
                    )}
                  </div>
                </button>
              ))
            }
          </div>
        )}
      </div>

      <div className={styles['header-right']}>
        <LanguageSwitcher />
        <SettingsDropdown />

        {loading ? (
          null
        ) : user ? (
          <UserDropdown
            avatarURL={avatarURL}
            avatarError={avatarError}
            handleImageError={handleImageError}
          />
        ) : (
          <button
            className={`${styles['header-button']} ${styles.primary}`}
            onClick={() => navigate('/auth')}
          >
            {t('login')}
          </button>
        )}

      </div>
    </header>
  );
};

export default Header;
