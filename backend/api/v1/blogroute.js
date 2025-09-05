import { Router } from "express";
import upload from "../../config/multer.js"
import postModel from "../../Schema/postSchema.js";
import userModel from "../../Schema/UserSchema.js";
import imageKitKey from "../../utils/imagekit.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const allBlog = await postModel.find({})

        if (allBlog.length === 0) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "No blog found"
                });
        }


        return res.status(200).json({
            success: true,
            message: "All Blogs retrived",
            blog: allBlog
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

router.post("/post-blog", upload.single('fileupload'), async (req, res) => {
    try {

        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "User Not found"
                })
        };

        const { title, description, category } = req.body;
        if (!title || !description || !category) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Enter all the detail properly"
                })
        };

        const file = req.file
        if (!file) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Image File Error"
                })
        };

        // multer memory storage give buffer
        // create a format for the buffer
        const response = await imageKitKey.upload({
            file: file.buffer,
            fileName: file.originalname,
        });

        // used to generate url for the image
        const img_url = imageKitKey.url({
            path: response.filePath,
            transformation: [{
                'quality': 'auto',
                "width": "512",
                'format': 'webp',
                'height': "512",
                'crop': "maintain_ratio",
                'trim': "color"
            }
            ]
        });

        const createPost = new postModel({
            title: title,
            description: description,
            image: img_url,
            category: category,
            userId: user._id,
            status: "published" ,
        });

        // await createPost.save();

        return res.status(200).json({
            success: true,
            message: "Blog Created",
              post: createPost
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

export default router