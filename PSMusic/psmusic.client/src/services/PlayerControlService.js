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
                message: error.response?.data?.message || "Không thể lấy danh sách bài hát tiếp theo",
            };
        }
    },
};

export default PlayerControlService;