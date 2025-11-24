import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SongRow from "../../components/SongRow/SongRow";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import SquareCard from "../../components/SquareCard/SquareCard";
import TrackTable from "../../components/TrackTable/TrackTable";
import styles from "./ArtistPage.module.css";

const DEFAULT_ARTIST_IMAGE = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const TAB_TO_TYPE = {
    "Tất cả": "all",
    "Bài hát": "songs",
};

const TYPE_TO_TAB = {
    all: "Tất cả",
    songs: "Bài hát",
};

const ArtistPage = () => {
    const { name } = useParams(); // hiện tại chưa dùng, nhưng để sẵn nếu sau này map theo name
    const navigate = useNavigate();
    const [playingSongId, setPlayingSongId] = useState(null);
    const type = "all";

    const [activeTab, setActiveTab] = useState(TYPE_TO_TAB[type] || "Tất cả");

    const handleTabChange = (tabLabel) => {
        setActiveTab(tabLabel);
        const newType = TAB_TO_TYPE[tabLabel] || "all";

        const newParams = Object.fromEntries(params.entries());
        newParams.t = newType;
        newParams.page = "1";
        setParams(newParams);
    };


    // MOCK ARTIST
    const artist = {
        id: 99,
        name: "The Cassette",
        avatarUrl: "https://i.scdn.co/image/ab6761610000101f5b60cf9eb0b9a0ce27857bc9",
    };

    // MOCK SONGS
    const suggestedSongs = [
        {
            id: 201,
            name: "Nỗi Buồn Gác Trọ",
            avatarUrl: "https://i.scdn.co/image/ab67616d0000b273c273e5f53cb6b9acfc0d96e1",
        },
        {
            id: 202,
            name: "Chiều Nay Không Có Mưa Bay",
            avatarUrl: "https://i.scdn.co/image/ab67616d0000b273fda57b2d10e4cb8a2f3f1f49",
        },
        {
            id: 203,
            name: "Bờ Vai Một Người",
            avatarUrl: "https://i.scdn.co/image/ab67616d0000b273c8f47d27a9d3f31e32d21965",
        },
        {
            id: 204,
            name: "Giá Như Anh Ở Đây",
            avatarUrl: "https://i.scdn.co/image/ab67616d0000b273fc0b633f31d0f8b2f6c6d4c9",
        },
        {
            id: 205,
            name: "Lời Hứa Mùa Hè",
            avatarUrl: "https://i.scdn.co/image/ab67616d0000b273e0f9f878fdc54a6c76f501bb",
        },
    ];


    const mapSong = (item) => ({
        id: item.id,
        title: item.name || "Không tên",
        artist: Array.isArray(item.artistsName)
            ? item.artistsName.join(", ")
            : "The Cassette",
        imageUrl: item.avatarUrl || DEFAULT_SONG_IMAGE,
    });

    const mapArtist = (item) => ({
        id: item.id,
        name: item.name || "Nghệ sĩ",
        followers: "",
        imageUrl: item.avatarUrl || DEFAULT_ARTIST_IMAGE,
    });

    const handleTitleClick = (song) => {
        navigate(`/song/${song.id}`);
    };

    const handleAddToPlaylist = (song, playlist) => {
        if (playlist.id === "new") {
            // mở modal tạo playlist
        } else {
            // call API add vào playlist.id
        }
    };

    const handleViewArtist = (artistName) => {
        navigate(`/artist/${encodeURIComponent(artistName)}`);
    };

    // dùng mapper để chuẩn hóa dữ liệu
    const mappedArtist = mapArtist(artist);
    const songs = suggestedSongs.map(mapSong);

    const suggestedArtists = [
        mapArtist(artist),
        mapArtist(artist),
        mapArtist(artist),
        mapArtist(artist),
    ];

    
    const artistsForView = useMemo(
        () => (activeTab === "Tất cả" ? suggestedArtists.slice(0, 4) : suggestedArtists),
        [suggestedArtists, activeTab]
    );

    if (!mappedArtist) {
        return <div className={styles.loading}>Đang tải nghệ sĩ...</div>;
    }

    return (
        <div className={styles.page}>
            {/* HERO */}
            <section className={styles.hero}>
                <div
                    className={styles.heroBg}
                />

                <div className={styles.heroOverlay}>
                    <img
                        src={mappedArtist.imageUrl}
                        alt={mappedArtist.name}
                        className={styles.avatar}
                        onError={(e) => {
                            e.target.src = DEFAULT_ARTIST_IMAGE;
                        }}
                    />

                    <div className={styles.heroMeta}>
                        <h1 className={styles.artistName}>{mappedArtist.name}</h1>

                        <div className={styles.actions}>
                            <button className={styles.playButton}>Play</button>
                            <button className={styles.secondaryButton}>Follow</button>
                            <button className={styles.iconButton}>•••</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* POPULAR SONGS */}
            <section className={styles.section}>
                <SectionHeader 
                    title="Bài hát phổ biến" 
                    onMore={
                        activeTab === "Tất cả"
                        ? () => handleTabChange("Bài hát")
                        : undefined
                    } 
                />
                <div className={styles.songList}>
                    <TrackTable
                        songs={songs}               // danh sách đã mapSong
                        playingSongId={playingSongId}
                        onPlay={setPlayingSongId}
                        onTitleClick={handleTitleClick}
                        onAddToPlaylist={handleAddToPlaylist}
                        onViewArtist={handleViewArtist}
                    />
                </div>
            </section>

            {(activeTab === "Tất cả" || activeTab === "Nghệ sĩ") && artistsForView.length > 0 && (
                <section className={styles["section"]}>
                    <SectionHeader
                        title="Nghệ sĩ bạn có thể thích"
                        onMore={
                            activeTab === "Tất cả"
                                ? () => handleTabChange("Nghệ sĩ")
                                : undefined
                        }
                    />
                    <div className={styles["result-grid"]}>
                        {artistsForView.map((a) => (
                            <SquareCard
                                key={a.id}
                                imageUrl={a.imageUrl} 
                                title={a.name}
                                subtitle={a.followers}
                                circle
                                onClick={() => handleViewArtist(a.name)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ArtistPage;
