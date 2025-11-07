import React, { useState, useMemo } from "react";
import "./SearchResultPage.css";
import SearchTabs from "../../components/SearchTab/SearchTab";

// Mock data (same shape you provided)
const SUGGESTED_SONGS = [
  { id: 1, title: "Thích Em Hơi Nhiều", artist: "Wren Evans", imageUrl: "https://picsum.photos/seed/song1/100/100" },
  { id: 2, title: "Bích Thượng Quan / ...", artist: "Cúc Tịnh Y / 鞠婧祎", imageUrl: "https://picsum.photos/seed/song2/100/100" },
  { id: 3, title: "HER", artist: "MINNIE", imageUrl: "https://picsum.photos/seed/song3/100/100", isPremium: true },
  { id: 4, title: "PHÓNG ZÌN ZÌN", artist: "tlinh, Low G", imageUrl: "https://picsum.photos/seed/song4/100/100" },
  { id: 5, title: "Cây Đèn Thần", artist: "Hồ Ngọc Hà", imageUrl: "https://picsum.photos/seed/song5/100/100" },
  { id: 6, title: "Khiêm Tốn / 谦让", artist: "Vương Tĩnh Văn / 王靖雯", imageUrl: "https://picsum.photos/seed/song6/100/100" },
  { id: 7, title: "Lạnh Lẽo / 涼涼", artist: "Trương Bích Thần / 张碧晨, ...", imageUrl: "https://picsum.photos/seed/song7/100/100" },
  { id: 8, title: "Rồi Tới Luôn", artist: "Nal", imageUrl: "https://picsum.photos/seed/song8/100/100" },
  { id: 9, title: "Sài Gòn Đau Lòng Quá", artist: "Hứa Kim Tuyền, ...", imageUrl: "https://picsum.photos/seed/song9/100/100" },
];

const SectionHeader = ({ title, onMore }) => (
  <div className="section-header">
    <h2 className="section-title">{title}</h2>
    {onMore && (
      <a href="#" className="see-all-link" onClick={(e) => e.preventDefault()}>
        Tất cả
        <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginLeft: 4 }}>
          <path fill="currentColor" d="M9 18l6-6-6-6v12z" />
        </svg>
      </a>
    )}
  </div>
);

const SongRow = ({ item, showPlayingIcon = false }) => (
  <div className="sr-row">
    <img className="sr-cover" src={item.imageUrl} alt="" />
    <div className="sr-meta">
      <a href="#" className="sr-title">{item.title}</a>
      <div className="sr-subtitle">{item.artist}</div>
    </div>
    {showPlayingIcon && <div className="sr-eq"><span /></div>}
  </div>
);

const SearchResultPage = () => {
  const [activeTab, setActiveTab] = useState("All");

  const { leftCol, rightCol } = useMemo(() => {
    const half = Math.ceil(SUGGESTED_SONGS.length / 2);
    return { leftCol: SUGGESTED_SONGS.slice(0, half), rightCol: SUGGESTED_SONGS.slice(half) };
  }, []);

  return (
    <div className="home-main-content">{/* same outer wrapper as HomePage */}{/* :contentReference[oaicite:4]{index=4} */}
      <h1 className="sr-title-xl">Kết quả tìm kiếm</h1>

      {/* Tabs under the page title */}
      <SearchTabs active={activeTab} onChange={setActiveTab} />

      {/* Songs section (two columns like your screenshot) */}
      <section className="content-section">
        <SectionHeader title="Bài hát" onMore={() => {}} />
        <div className="sr-rows two-col">
          <div className="sr-col">
            {leftCol.map((s, idx) => (
              <SongRow key={s.id} item={s} showPlayingIcon={idx === 0} />
            ))}
          </div>
          <div className="sr-col">
            {rightCol.map((s) => (
              <SongRow key={s.id} item={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Stubs – you can fill these like HomePage sections later */}
      <section className="content-section">
        <SectionHeader title="Playlists" onMore={() => {}} />
        <div className="sr-placeholder">Chưa có playlist.</div>
      </section>

      <section className="content-section">
        <SectionHeader title="Nghệ sĩ" onMore={() => {}} />
        <div className="sr-placeholder">Chưa có nghệ sĩ.</div>
      </section>

      <section className="content-section">
        <SectionHeader title="Albums" onMore={() => {}} />
        <div className="sr-placeholder">Chưa có album.</div>
      </section>

      <section className="content-section">
        <SectionHeader title="Videos" onMore={() => {}} />
        <div className="sr-placeholder">Chưa có video.</div>
      </section>
    </div>
  );
}

export default SearchResultPage;
