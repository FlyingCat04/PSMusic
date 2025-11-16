import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; //nhớ thêm useSearchParams
import styles from "./SearchResultPage.module.css";
import SearchTabs from "../../components/SearchTab/SearchTab";
import SongRow from "../../components/SongRow/SongRow";
import SquareCard from "../../components/SquareCard/SquareCard";

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

const PLAYLISTS = [
    {
        id: 101,
        title: "Những Bản Hit Việt 2024",
        subtitle: "Tuyển chọn hot nhất hôm nay",
        imageUrl: "https://picsum.photos/seed/playlist1/300/300",
    },
    {
        id: 102,
        title: "Ballad Buồn Dễ Nghiện",
        subtitle: "Nghe là nhớ một người",
        imageUrl: "https://picsum.photos/seed/playlist2/300/300",
    },
    {
        id: 103,
        title: "K-Pop Đỉnh Cao",
        subtitle: "BLACKPINK, NewJeans, IVE,...",
        imageUrl: "https://picsum.photos/seed/playlist3/300/300",
    },
    {
        id: 104,
        title: "K-Pop Đỉnh Cao",
        subtitle: "BLACKPINK, NewJeans, IVE,...",
        imageUrl: "https://picsum.photos/seed/playlist3/300/300",
    },
    {
        id: 105,
        title: "K-Pop Đỉnh Cao",
        subtitle: "BLACKPINK, NewJeans, IVE,...",
        imageUrl: "https://picsum.photos/seed/playlist3/300/300",
    },
];

const ARTISTS = [
    {
        id: 201,
        name: "Wren Evans",
        followers: "120K quan tâm",
        imageUrl: "https://picsum.photos/seed/artist1/300/300",
    },
    {
        id: 202,
        name: "tlinh",
        followers: "300K quan tâm",
        imageUrl: "https://picsum.photos/seed/artist2/300/300",
    },
    {
        id: 203,
        name: "MINNIE",
        followers: "2M quan tâm",
        imageUrl: "https://picsum.photos/seed/artist3/300/300",
    },

    {
        id: 204,
        name: "MINNIE",
        followers: "2M quan tâm",
        imageUrl: "https://picsum.photos/seed/artist3/300/300",
    },
];

const ALBUMS = [
    {
        id: 301,
        title: "Thích Em Hơi Nhiều (Single)",
        artist: "Wren Evans",
        imageUrl: "https://picsum.photos/seed/album1/300/300",
    },
    {
        id: 302,
        title: "HER",
        artist: "MINNIE",
        imageUrl: "https://picsum.photos/seed/album2/300/300",
    },
    {
        id: 303,
        title: "PHÓNG ZÌN ZÌN",
        artist: "tlinh, Low G",
        imageUrl: "https://picsum.photos/seed/album3/300/300",
    },
];


const TAB_TO_TYPE = {
    "Tất cả": "all",
    "Bài hát": "songs",
    "Playlists": "playlists",
    "Nghệ sĩ": "artists",
    "Albums": "albums",
};

const TYPE_TO_TAB = {
    all: "Tất cả",
    songs: "Bài hát",
    playlists: "Playlists",
    artists: "Nghệ sĩ",
    albums: "Albums",
};


const SectionHeader = ({ title, onMore }) => (
  <div className="section-header">
    <h2 className="section-title">{title}</h2>
    {onMore && (
      <button
        type="button"
        className="see-all-link"
        onClick={onMore}
      >
        Thêm
        <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginLeft: 4 }}>
          <path fill="currentColor" d="M9 18l6-6-6-6v12z" />
        </svg>
      </button>
    )}
  </div>
);



const SearchResultPage = () => {

    const [params, setParams] = useSearchParams();
    const keyword = params.get("key") || "";
    //const type = params.get("t") || "all";
    const type = "all";

    const [activeTab, setActiveTab] = useState("Tất cả");

    const [playingSongId, setPlayingSongId] = useState(null);
    const navigate = useNavigate(); 

    const handleTabChange = (tabLabel) => {
        setActiveTab(tabLabel);
        const newType = TAB_TO_TYPE[tabLabel] || "all";

        // giữ nguyên từ khoá search, chỉ đổi loại t
        if (keyword) {
            setParams({ key: keyword, t: newType });
        } else {
            setParams({ t: newType });
        }
    };


    const handleSongClick = (song) => {
        setPlayingSongId(song.id);
        console.log("Playing song:", song);
        //navigate(`/song/${song.id}`);      
    };

    const handleTitleClick = (song) => {
        navigate(`/song/${song.id}`);
        console.log(song);
    };

    const handleAddToPlaylist = (song, playlist) => {
        if (playlist.id === "new") {
            // mở modal tạo playlist mới
        } else {
            // call API: add song vào playlist.id
        }
    };

    const handleViewArtist = (artistName) => {
        navigate(`/artist/${encodeURIComponent(artistName)}`);
    };


    const { leftCol, rightCol } = useMemo(() => {
        let base = SUGGESTED_SONGS;

        if (activeTab === "Tất cả") {
            base = SUGGESTED_SONGS.slice(0, 10); // limit 10 bài 
        }

        const half = Math.ceil(base.length / 2);
        return {
            leftCol: base.slice(0, half),
            rightCol: base.slice(half),
        };
    }, [activeTab]);


    const playlists = useMemo(() => {
        return activeTab === "Tất cả"
            ? PLAYLISTS.slice(0, 4)
            : PLAYLISTS;
    }, [activeTab]);

    const artists = useMemo(() => {
        return activeTab === "Tất cả"
            ? ARTISTS.slice(0, 4)
            : ARTISTS;
    }, [activeTab]);

    const albums = useMemo(() => {
        return activeTab === "Tất cả"
            ? ALBUMS.slice(0, 4)
            : ALBUMS;
    }, [activeTab]);

    return (
        <div className="content-container">
            {/* same outer wrapper as HomePage */}
            <h1 className={styles["sr-title-xl"]}>Kết quả tìm kiếm</h1>

            {/* Tabs dưới tiêu đề */}
            <SearchTabs active={activeTab} onChange={setActiveTab} />

            {/* Songs section (two columns như) */}
            {(activeTab === "Tất cả" || activeTab === "Bài hát") && (
                <section className={styles["content-section"]}>
                    <SectionHeader title="Bài hát" onMore={activeTab === "Tất cả" ? () => handleTabChange("Bài hát") : undefined} />
                    <div className={`${styles["sr-rows"]} ${styles["two-col"]}`}>
                        <div className={styles["sr-col"]}>
                            {leftCol.map((s) => (
                                <SongRow
                                    key={s.id}
                                    item={s}
                                    showPlayingIcon={s.id === playingSongId}
                                    onTitleClick={handleTitleClick}
                                    onAvatarClick={handleSongClick}
                                    onAddToPlaylist={handleAddToPlaylist}
                                    onViewArtist={handleViewArtist}
                                />
                            ))}
                        </div>
                        <div className={styles["sr-col"]}>
                            {rightCol.map((s) => (
                                <SongRow
                                    key={s.id}
                                    item={s}
                                    showPlayingIcon={s.id === playingSongId}
                                    onTitleClick={handleTitleClick}
                                    onAvatarClick={handleSongClick}
                                    onAddToPlaylist={handleAddToPlaylist}
                                    onViewArtist={handleViewArtist}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* PLAYLISTS */}
            {(activeTab === "Tất cả" || activeTab === "Playlists") && (
                <section className={styles["content-section"]}>
                    <SectionHeader title="Playlists" onMore={activeTab === "Tất cả" ? () => handleTabChange("Playlists") : undefined} />
                    <div className={styles["result-grid"]}>
                        {playlists.map((p) => (
                            <SquareCard
                                key={p.id}
                                imageUrl={p.imageUrl}
                                title={p.title}
                                subtitle={p.subtitle}
                                onClick={() => console.log("playlist click", p)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* nghệ sĩ */}
            {(activeTab === "Tất cả" || activeTab === "Nghệ sĩ") && (
                <section className={styles["content-section"]}>
                    <SectionHeader title="Nghệ sĩ" onMore={activeTab === "Tất cả" ? () => handleTabChange("Nghệ sĩ") : undefined} />
                    <div className={styles["result-grid"]}>
                        {artists.map((a) => (
                            <SquareCard
                                key={a.id}
                                imageUrl={a.imageUrl}
                                title={a.name}
                                subtitle={a.followers}
                                circle
                                onClick={() => console.log("artist click", a)}
                            />
                        ))}
                    </div>
                    </section>
            )}

            {/* album */}
            {(activeTab === "Tất cả" || activeTab === "Albums") && (
                <section className={styles["content-section"]}>
                    <SectionHeader title="Albums" onMore={activeTab === "Tất cả" ? () => handleTabChange("Albums") : undefined} />
                    <div className={styles["result-grid"]}>
                        {albums.map((al) => (
                            <SquareCard
                                key={al.id}
                                imageUrl={al.imageUrl}
                                title={al.title}
                                subtitle={al.artist}
                                onClick={() => console.log("album click", al)}
                            />
                        ))}
                    </div>
                </section>
            )}
    </div>
  );
};

export default SearchResultPage;
