import axiosInstance from "./axiosInstance";

const PlayerControlService = {
  getNextBatch: async () => {
    try {
      const res = await axiosInstance.get(`/song/next-batch`);
      return {
        isSuccess: true,
        data: res.data,
      };
    } catch (error) {
      console.error("Get nect batch error:", error);
      return {
        isSuccess: false,
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách bài hát tiếp theo",
      };
    }
  },

  streamSong: async (songId) => {
    try {
      const res = await axiosInstance.post(`/song/stream/${songId}`);
      return {
        isSuccess: true,
      };
    } catch (error) {
      console.error("Stream song error:", error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || "Không thể stream bài hát",
      };
    }
  },

  getPlayerData: async (songId) => {
    try {
      const res = await axiosInstance.get(`/song/${songId}/player`);
      return {
        isSuccess: true,
        data: res.data,
      };
    } catch (error) {
      console.error("Get player data error:", error);
      return {
        isSuccess: false,
        message:
          error.response?.data?.message || "Không thể lấy dữ liệu player",
      };
    }
  },
};

export default PlayerControlService;
