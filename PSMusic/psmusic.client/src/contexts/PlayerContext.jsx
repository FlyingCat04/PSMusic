import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import PlayerControlService from "../services/PlayerControlService";
import { useAuth } from "../hooks/useAuth";

const PlayerContext = createContext();
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const { user } = useAuth();
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

  useEffect(() => {
    if (!currentSong?.id) {
      setPlayerData(null);
      return;
    }

    let cancelled = false;

    const fetchPlayerData = async () => {
      if (!user) {
        if (!cancelled) {
          setPlayerData({
            ...currentSong,
            isFavorited: false,
            isReviewed: false,
            audioUrl: currentSong.audioUrl || currentSong.mp3Url
          });
        }
        return;
      }

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
      // Disabling shuffle: Restore from originalQueue
      setShuffle(false);
      if (originalQueue.length > 0) {
        const currentSongId = currentSong?.id;
        const originalIndex = originalQueue.findIndex(
          (song) => song.id === currentSongId
        );
        if (originalIndex !== -1) {
          setQueue([...originalQueue]);
          setQueueIndex(originalIndex);
          if (currentPlaylist) {
            setCurrentPlaylistIndex(originalIndex);
          }
        }
      }
    } else {
      // Enabling shuffle: Keep current song at index 0, shuffle rest
      setShuffle(true);
      const currentOrder = [...queue];
      setOriginalQueue(currentOrder);

      const currentSongId = currentSong?.id;
      const otherSongs = currentOrder.filter((s) => s.id !== currentSongId);
      const shuffledOthers = shuffleQueue(otherSongs);
      const newQueue = currentSong ? [currentSong, ...shuffledOthers] : shuffledOthers;

      setQueue(newQueue);
      setQueueIndex(0);
      if (currentPlaylist) {
        // We don't necessarily update currentPlaylistIndex as it relates to the original order
      }
    }
  };

  const toggleRepeat = () => {
    setRepeat((prev) => (prev + 1) % 3);
  };

  const playNextSong = async () => {
    // Repeat One logic
    if (repeat === 2 && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }

    // Playlist logic (if playback is scoped to a specific playlist)
    if (currentPlaylist && !shuffle && currentPlaylistIndex < currentPlaylist.length - 1) {
      const nextIndex = currentPlaylistIndex + 1;
      setCurrentPlaylistIndex(nextIndex);
      playSong(currentPlaylist[nextIndex]);
      return;
    }

    // Queue logic
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      setQueueIndex(nextIndex);
      playSong(queue[nextIndex]);

      // Proactive fetch if nearing end
      if (queue.length - nextIndex <= 3) {
        const res = await PlayerControlService.getNextBatch();
        if (res.data && res.data.length > 0) {
          const newBatch = shuffle ? shuffleQueue(res.data) : res.data;
          setQueue((prev) => [...prev, ...newBatch]);
          setOriginalQueue((prev) => [...prev, ...res.data]);
        }
      }
      return;
    }

    // End of queue reached
    if (repeat === 1) {
      // Repeat All: Loop back to start
      setQueueIndex(0);
      playSong(queue[0]);
      return;
    }

    // No repeat, fetch more songs
    const res = await PlayerControlService.getNextBatch();
    if (res.data && res.data.length > 0) {
      const newBatch = shuffle ? shuffleQueue(res.data) : res.data;
      const startIndex = queue.length; // New index in the updated queue
      setQueue((prev) => [...prev, ...newBatch]);
      setOriginalQueue((prev) => [...prev, ...res.data]);
      setQueueIndex(startIndex);
      playSong(newBatch[0]);
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

  const playPlaylist = (playlist, startIndex = 0) => {
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
    
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!user || !currentSong) return;

    if (!hasStreamed && currentTime >= 20) {
      PlayerControlService.streamSong(currentSong.id);

      setHasStreamed(true);
    }
  }, [currentTime, currentSong, hasStreamed, user]);

  const value = {
    audioRef,
    currentSong,
    playerData,
    isPlaying,
    setIsPlaying,
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
      />
    </PlayerContext.Provider>
  );
}
