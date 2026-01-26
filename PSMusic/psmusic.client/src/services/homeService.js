import axiosInstance from "./axiosInstance";

const homeService = {
    async fetchPopularData() {
        try {
            const [categoriesRes, artistsRes, songsRes] = await Promise.all([
                axiosInstance.get("/category/popular"),
                axiosInstance.get("/artist/popular"),
                axiosInstance.get("/song/popular")
            ]);

            return {
                categories: categoriesRes.data?.items || [],
                artists: artistsRes.data?.items || [],
                songs: songsRes.data?.items || []
            };
        } catch (error) {
            //console.error("Error fetching popular data:", error);
            throw error;
        }
    },

    async getPopularCategories() {
        try {
            const res = await axiosInstance.get("/category/popular");
            return res.data?.items || [];
        } catch (error) {
            //console.error("Error fetching popular categories:", error);
            throw error;
        }
    },

    async getPopularArtists() {
        try {
            const res = await axiosInstance.get("/artist/popular");
            return res.data?.items || [];
        } catch (error) {
            //console.error("Error fetching popular artists:", error);
            throw error;
        }
    },

    async getPopularSongs() {
        try {
            const res = await axiosInstance.get("/song/popular");
            return res.data?.items || [];
        } catch (error) {
            //console.error("Error fetching popular songs:", error);
            throw error;
        }
    }
};

export default homeService;
