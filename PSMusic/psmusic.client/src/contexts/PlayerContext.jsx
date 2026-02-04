import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import PlayerControlService from "../services/PlayerControlService";
import axiosInstance from "../services/axiosInstance";
import LoadSpinner from "../components/LoadSpinner/LoadSpinner";


const PlayerContext = createContext();
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(0);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [hasStreamed, setHasStreamed] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [playlistContext, setPlaylistContext] = useState(null);

  useEffect(() => {
    if (!currentSong?.id) {
      setPlayerData(null);
      return;
    }

    let cancelled = false;

    const fetchPlayerData = async () => {
      try {
        const res = await PlayerControlService.getPlayerData(currentSong.id);

        if (!cancelled) {
          setPlayerData(res.data);
        }
      } catch (err) {
        console.error("Fetch player data failed:", err);
      }
    };

    fetchPlayerData();

    return () => {
      cancelled = true;
    };
  }, [currentSong?.id]);

  useEffect(() => {
    if (!audioRef.current || !playerData?.audioUrl) return;

    if (audioRef.current.src !== playerData.audioUrl) {
      audioRef.current.src = playerData.audioUrl;
    }

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Play error:", err);
        }
      });
    }
  }, [playerData?.audioUrl]);

  const playSong = async (song) => {
    if (queueIndex >= queue.length - 1) {
      const res = await PlayerControlService.getNextBatch();
      if (res.data.length > 0) {
        setQueue(res.data);
        setQueueIndex(0);
      }
    }
    setPlaylistContext(null);
    setCurrentSong(song);
    setHasStreamed(false);
    setIsPlayerVisible(true);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }

    setIsPlaying((prev) => !prev);
    setIsPlayerVisible(true);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoaded = () => {
    setDuration(audioRef.current.duration);
  };

  const loadInitialQueue = async () => {
    const res = await PlayerControlService.getNextBatch();
    setQueue(res.data);
    setQueueIndex(0);
  };

  const shuffleQueue = (queue) => {
    const shuffled = [...queue];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const toggleShuffle = () => {
    if (shuffle) {
      setShuffle(false);
      if (originalQueue.length > 0) {
        const currentSongId = currentSong?.id;
        const originalIndex = originalQueue.findIndex(
          (song) => song.id === currentSongId
        );
        if (originalIndex !== -1) {
          setQueue(originalQueue);
          setQueueIndex(originalIndex);
          if (currentPlaylist) {
            setCurrentPlaylistIndex(originalIndex);
          }
        }
      }
    } else {
      setShuffle(true);
      setOriginalQueue([...queue]);

      const shuffledQueue = shuffleQueue(queue);
      const currentSongId = currentSong?.id;
      const newIndex = shuffledQueue.findIndex(
        (song) => song.id === currentSongId
      );

      if (newIndex !== -1) {
        setQueue(shuffledQueue);
        setQueueIndex(newIndex);
      }
    }
  };

  const loadMoreSongs = async () => {
    if (!playlistContext) return [];

    try {
        const nextPage = playlistContext.page + 1;
        let endpoint = "";
        
        // Xác định API dựa trên loại playlist
        if (playlistContext.type === 'ARTIST_MAIN') endpoint = `/song/artist/main/${playlistContext.id}`;
        else if (playlistContext.type === 'ARTIST_COLLAB') endpoint = `/song/artist/collab/${playlistContext.id}`;
        
        if (!endpoint) return [];

        // Gọi API lấy trang tiếp theo
        const res = await axiosInstance.get(endpoint, { 
            params: { page: nextPage, size: 10 } 
        });

        const newItems = res.data?.items || [];
        
        if (newItems.length > 0) {
            const mappedSongs = newItems.map(item => ({
                id: item.id,
                title: item.name || "Không tên",
                artistText: item.artists?.map(a => a.name).join(", ") || "",
                artists: item.artists || [],
                imageUrl: item.avatarUrl || "https://cdn.pixabay.com/photo/2019/08/11/18/27/icon-4399630_1280.png", // Fallback image
                mp3Url: item.mp3Url,
                duration: item.duration || "00:00"
            }));
            setPlaylistContext(prev => ({ ...prev, page: nextPage }));
            return mappedSongs;
        }
    } catch (err) {
        console.error("Lỗi không load thêm được bài hát:", err);
    }
    return [];
  };

  const toggleRepeat = () => {
    setRepeat((prev) => (prev + 1) % 3);
  };

  const playNextSong = async () => {
    if (repeat === 2 && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }

    if (currentPlaylist && currentPlaylistIndex < currentPlaylist.length - 1) {
      const nextIndex = currentPlaylistIndex + 1;
      setCurrentPlaylistIndex(nextIndex);
      playSong(currentPlaylist[nextIndex]);
      if (queue.length - nextIndex <= 2 && playlistContext) {
          <LoadSpinner />
          const moreSongs = await loadMoreSongs();
          
          if (moreSongs.length > 0) {
              // Nối đuôi vào hàng chờ hiện tại
              setQueue(prev => [...prev, ...moreSongs]);
              if (shuffle) setOriginalQueue(prev => [...prev, ...moreSongs]);
          }
      }
      return;
    }

    if (
      repeat === 1 &&
      currentPlaylist &&
      currentPlaylistIndex === currentPlaylist.length - 1
    ) {
      setCurrentPlaylistIndex(0);
      playSong(currentPlaylist[0]);
      return;
    }

    if (queueIndex < queue.length - 1) {
      playSong(queue[queueIndex]);
      const nextIndex = queueIndex + 1;
      setQueueIndex(nextIndex);

      if (queue.length - nextIndex <= 2) {
        const res = await PlayerControlService.getNextBatch();
        setQueue((prev) => [...prev, ...res.data]);
        if (shuffle) {
          setOriginalQueue((prev) => [...prev, ...res.data]);
        }
      }
      return;
    }

    if (repeat === 1 && queueIndex === queue.length - 1) {
      setQueueIndex(0);
      playSong(queue[0]);
      return;
    }

    const res = await PlayerControlService.getNextBatch();
    if (res.data.length > 0) {
      const newQueue = shuffle ? shuffleQueue(res.data) : res.data;
      setQueue(newQueue);
      if (shuffle) {
        setOriginalQueue(res.data);
      }
      setQueueIndex(0);
      playSong(newQueue[0]);
    }
  };

  const playPrevSong = () => {
    if (currentPlaylist && currentPlaylistIndex > 0) {
      const prevIndex = currentPlaylistIndex - 1;
      setCurrentPlaylistIndex(prevIndex);
      playSong(currentPlaylist[prevIndex]);
      return;
    }

    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      setQueueIndex(prevIndex);
      playSong(queue[prevIndex]);
    }
  };

  const playPlaylist = (playlist, startIndex = 0, context = null) => {
    let playQueue = playlist;

    if (shuffle) {
      playQueue = shuffleQueue(playlist);
      const currentSong = playlist[startIndex];
      const shuffledIndex = playQueue.findIndex(
        (song) => song.id === currentSong.id
      );
      startIndex = shuffledIndex !== -1 ? shuffledIndex : 0;
      setOriginalQueue(playlist);
    }

    setCurrentPlaylist(playlist);
    setCurrentPlaylistIndex(startIndex);
    setQueue(playQueue);
    setQueueIndex(startIndex);
    playSong(playQueue[startIndex]);
    setPlaylistContext(context);
    playSong(playQueue[startIndex]);
  };

  const updateCurrentPlaylist = (updatedPlaylist) => {
    setCurrentPlaylist(updatedPlaylist);

    if (currentPlaylist && queue.length > 0) {
      const currentSongId = currentSong?.id;
      const newQueueIndex = updatedPlaylist.findIndex(
        (song) => song.id === currentSongId
      );

      if (newQueueIndex !== -1) {
        setQueue(updatedPlaylist);
        setQueueIndex(newQueueIndex);
        setCurrentPlaylistIndex(newQueueIndex);
      }
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = volume;
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoaded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = volume;

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!currentSong) return;

    if (!hasStreamed && currentTime >= 20) {
      PlayerControlService.streamSong(currentSong.id);

      setHasStreamed(true);
    }
  }, [currentTime, currentSong, hasStreamed]);

  const value = {
    audioRef,
    currentSong,
    playerData,
    isPlaying,
    setPlayerData,
    currentTime,
    duration,
    volume,
    isPlayerVisible,

    playSong,
    togglePlay,
    setVolume,
    setIsPlayerVisible,
    playNextSong,
    playPrevSong,
    playPlaylist,
    currentPlaylist,
    currentPlaylistIndex,
    updateCurrentPlaylist,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onEnded={playNextSong}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoaded}
      />
    </PlayerContext.Provider>
  );
}
