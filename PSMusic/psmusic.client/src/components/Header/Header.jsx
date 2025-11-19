import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, User } from 'lucide-react';
import SettingsDropdown from '../SettingsDropdown/SettingsDropdown';
import LoadSpinner from '../LoadSpinner/LoadSpinner';
import { useNavigate } from 'react-router-dom'; 
import styles from './Header.module.css';
import axiosInstance from '../../services/axiosInstance';

const Header = () => {

    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggest, setLoadingSuggest] = useState(false);
    const [topResults, setTopResults] = useState([]);

    const goPrev = () => navigate(-1);
    const goNext = () => navigate(1);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && query.trim() !== "") {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
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
                    title: s.title || s.name || "Không tên",
                    artist: Array.isArray(s.artistsName)
                        ? s.artistsName.join(", ")
                        : s.artistName || s.artist || "",
                }));

                const mapped = results.map((s) => ({
                    type: s.type || "song",
                    id: s.id,
                    title: s.title || s.name || "Không tên",
                    artist: Array.isArray(s.artistsName)
                        ? s.artistsName.join(", ")
                        : s.artistName || s.artist || "",
                }));

                console.log(mappedTop.length);

                setTopResults(mappedTop);
                setSuggestions(mapped);

            } catch (err) {
                console.error(err);
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
        <div className={styles['search-bar']}>
          <div className={styles['search-icon']}>
            <Search />
           </div>
          <input
            type="text"
            placeholder="Tìm kiếm bài hát, nghệ sĩ, lời bài hát..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
                setTimeout(() => setIsFocused(false), 150);
            }}
          />

            {isFocused && query.trim() && (
                <div className={styles.suggestBox}>
                    {loadingSuggest && (
                        <div className={styles.suggestItemMuted}>Đang tìm gợi ý...</div>
                    )}

                    {!loadingSuggest && 
                        suggestions.length === 0 && 
                        topResults.length === 0 && (
                        <div className={styles.suggestItemMuted}>Không có gợi ý phù hợp</div>
                    )}

                    {!loadingSuggest && topResults.length > 0 &&
                        topResults.map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                className={styles.suggestItem}
                                onMouseDown={() => {
                                    if (s.type === "artist") {
                                        navigate(`/artist/${s.name}`);
                                    } else {
                                        navigate(`/song/${s.id}`);
                                    }
                                }}
                            >
                                <div className={styles.suggestTitle}>{s.title}</div>
                                {s.artist && (
                                    <div className={styles.suggestSubtitle}>{s.artist}</div>
                                )}
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
                                        navigate(`/artist/${s.name}`);
                                    } else {
                                        navigate(`/song/${s.id}`);
                                    }
                                }}
                            >
                                <div className={styles.suggestTitle}>{s.title}</div>
                                {s.artist && (
                                    <div className={styles.suggestSubtitle}>{s.artist}</div>
                                )}
                            </button>
                        ))
                    }
                </div>
            )}
        </div>
      </div>
      <div className={styles['header-right']}>
        <SettingsDropdown />
        
        {/* <div className={styles['user-avatar']}>
            <User />
        </div> */}

        <button className={`${styles['header-button']} ${styles.primary}`}>
          Đăng nhập
        </button>
        <button className={`${styles['header-button']} ${styles.secondary}`}>
          <span>Tạo tài khoản</span>
        </button>

      </div>
    </header>
  );
};

export default Header;
