import axiosInstance from "./axiosInstance";

const userService = {
    getUserById: async (id) => {
        try {
            const res = await axiosInstance.get(`/user/${id}`);
            return {
                isSuccess: true,
                data: res.data,
            };
        } catch (error) {
            console.error("Get user error:", error);
            return {
                isSuccess: false,
                message: error.response?.data?.message || "Không thể lấy thông tin người dùng",
            };
        }
    },
};

export default userService;
