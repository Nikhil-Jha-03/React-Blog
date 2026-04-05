import { Router } from "express";
import postModel from "../../Schema/PostSchema.js";

const router = Router();

router.get("/featured", async (req, res) => {
    try {
        const featuredBlogs = await postModel
            .find({ status: "published", feature: true })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate("userId", "name");

        return res.status(200).json({
            success: true,
            count: featuredBlogs.length,
            blogs: featuredBlogs
        });
    } catch (error) {
        console.error("Error fetching featured blogs:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default router;
