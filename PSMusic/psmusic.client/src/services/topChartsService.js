import axiosInstance from "./axiosInstance";

const topChartsService = {
    async getPopularArtists(page = 1, size = 10) {
        try {
            const res = await axiosInstance.get("/artist/popular", {
                params: { page, size }
            });
            return res.data;
        } catch (error) {
            console.error("Error fetching popular artists:", error);
            throw error;
        }
    },

    async getPopularCategories(page = 1, size = 10) {
        try {
            const res = await axiosInstance.get("/category/popular", {
                params: { page, size }
            });
            return res.data;
        } catch (error) {
            console.error("Error fetching popular categories:", error);
            throw error;
        }
    },

    async getPopularSongsByCategory(categoryId, page = 1, size = 10) {
        try {
            const res = await axiosInstance.get(`/song/category/popular/${categoryId}`, {
                params: { page, size }
            });
            return res.data;
        } catch (error) {
            console.error(`Error fetching popular songs for category ${categoryId}:`, error);
            throw error;
        }
    }
};

export default topChartsService;
