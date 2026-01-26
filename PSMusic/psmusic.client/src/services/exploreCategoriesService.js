import axiosInstance from "./axiosInstance";

const exploreCategoriesService = {
    async getAllCategories(page = 1, size = 100) {
        try {
            const res = await axiosInstance.get("/category/popular", {
                params: { page, size }
            });
            return res.data;
        } catch (error) {
            //console.error("Error fetching all categories:", error);
            throw error;
        }
    },

    async getSongsByCategory(categoryId, page = 1, size = 10) {
        try {
            const res = await axiosInstance.get(`/song/category/popular/${categoryId}`, {
                params: { page, size }
            });
            return res.data;
        } catch (error) {
            //console.error(`Error fetching songs for category ${categoryId}:`, error);
            throw error;
        }
    },

    async getMultipleCategorySongs(categoryIds, page = 1, size = 10) {
        try {
            const requests = categoryIds.map(id => 
                this.getSongsByCategory(id, page, size)
            );
            return await Promise.all(requests);
        } catch (error) {
            //console.error("Error fetching multiple category songs:", error);
            throw error;
        }
    }
};

export default exploreCategoriesService;
