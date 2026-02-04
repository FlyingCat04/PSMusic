import axiosInstance from "./axiosInstance";

const authService = {
    async login(username, password)
    {
        try {
            const res = await axiosInstance.post("/auth/login", {
                username,
                password
            });
            return res.data;
        } catch (error) {
            //console.log(error.response);
            if (error.response?.status === 400)
            {
                return {
                    isSuccess: false,
                    message: error.response.data?.message || "Tên đăng nhập hoặc mật khẩu không đúng"
                };
            }
            //console.error("Login API error:", error);
            return { isSuccess: false, message: "Đã xảy ra lỗi không xác định" };
        }
    },

    async getCurrentUser() {
        try {
            const res = await axiosInstance.get("/auth/me");
            if (res.status === 200 && res.data) return { isSuccess: true, data: res.data };
            throw new Error("Không thể lấy thông tin người dùng");
        } catch (error) {
            if (error.response?.status !== 401) {
                //console.error("Get current user error:", error);
            }

            if (error.response?.status === 401) {
                throw new Error("Chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
            }

            throw new Error(
                error.response?.data?.message || "Không thể lấy thông tin người dùng"
            );
        }
    },

    async logout() {
        try {
            const res = await axiosInstance.post("/auth/logout");
            if (res.status === 200 && res.data) return res.data;
        } catch (error) {
            //console.error("Logout error:", error);
            return {
                isSuccess: true,
                message: "Đã đăng xuất"
            };
        }
    },

    async register(user) {
        try {
            const res = await axiosInstance.post("/auth/register", user);
            return res.data;
        } catch (error) {
            //console.error("Register error:", error);
            return { 
                isSuccess: false,
                message: error.response.data?.message || "Đăng ký thất bại"
            }
        }
    },

    async refresh() {
        try {
            const res = await axiosInstance.post("/auth/refresh");
            if (res.status === 200 && res.data) return res.data;
        } catch (error) {
            if (error.response?.status !== 401) {
                //console.error("Refresh token error:", error);
            }
            return {
                isSuccess: false,
                message: "Không thể làm mới phiên đăng nhập"
            };
        }
    }
}

export default authService;