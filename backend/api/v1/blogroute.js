import { Router } from "express";
import upload from "../../config/multer.js"
import postModel from "../../Schema/postSchema.js";
import userModel from "../../Schema/UserSchema.js";
import imageKitKey from "../../utils/imagekit.js";
import CategoryModel from '../../Schema/BlogCategorySchema.js'
import generateAiDescription from "../../config/GeminiAI.js";

const router = Router();

router.get("/", async (req, res) => {
    try {

        const allBlog = await postModel.find({ status: "published" });

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
            blog: allBlog,
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})


// router.get("/", async (req, res) => {
//     // Only Get publihed Blog
//     try {
//         const allBlog = await postModel.find({ status: "published" })

//         if (allBlog.length === 0) {
//             return res
//                 .status(404)
//                 .json({
//                     success: false,
//                     message: "No blog found"
//                 });
//         }


//         return res.status(200).json({
//             success: true,
//             message: "All Blogs retrived",
//             blog: allBlog
//         });
//     } catch (error) {
//         console.error("Unexpected error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// })

router.get("/getuserblog", async (req, res) => {
    try {
        const userValid = await userModel.findById(req.userId);

        if (!userValid) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const userBlog = await postModel.find({ userId: userValid._id }).populate('category', 'category');

        if (!userBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not Found",
                data: []
            })
        }

        return res.status(200).json({
            success: true,
            message: "Blog Found",
            data: userBlog
        })

    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

router.get("/getEditBlog/:id", async (req, res) => {
    try {
        const blog = await postModel.findById(req.params.id)
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog,
        });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog",
            error: error.message,
        });
    }
});

router.patch("/drafttopublish", async (req, res) => {
    try {
        console.log("coming")

        const userValid = await userModel.findById(req.userId);

        if (!userValid) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const blogId = req.body.id;

        const userBlog = await postModel.findByIdAndUpdate(blogId, { status: "published" }, { new: true })

        if (!userBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not Found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Blog Published",
        })

    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

router.post("/post-blog", upload.single('image'), async (req, res) => {
    console.log("Received")
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

        const { title, description, category, status } = req.body;
        if (!title || !description || !category || !status) {
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
            status: status,
        });

        await createPost.save();

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

router.post('/post-category', async (req, res) => {
    try {
        const { category } = req.body;

        if (!category || category.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Category is required",
            });
        }

        // Check if category already exists
        const existing = await CategoryModel.findOne({ category: category.trim() });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Category already exists",
            });
        }

        // Create new category
        const newCategory = new CategoryModel({ category: category.trim() });
        await newCategory.save();

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: newCategory,
        });

    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// GET all categories
router.get('/get-category', async (req, res) => {
    try {
        const categories = await CategoryModel.find().sort({ createdAt: -1 }); // latest first

        if (!categories || categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No categories found",
            });
        }

        return res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });

    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.delete('/delete/:id', async (req, res) => {
    console.log("hey")
    try {
        const user = req.userId;
        if (!user) {
            return res.status(401)
                .json({
                    sucess: false,
                    message: "User not found"
                })
        }

        const postId = req.params.id;

        const deleted = await postModel.findByIdAndDelete(postId);

        if (!deleted) return res.status(404).json({ success: false, message: "Blog not found" });

        return res.status(200).json({
            success: true,
            message: "Successfully Deleted"
        });

    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
})

router.post('/generateAiDescription', async (req, res) => {

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

        if (user.aiCreditAvailableAt && user.aiCreditAvailableAt > Date.now()) {
            console.log(user.aiCreditAvailableAt)

            return res
                .status(401)
                .json({
                    success: false,
                    message: "Ai Credit not available try after 1 day 1"
                })
        }

        if (user.aiCreditAvailableAt && user.aiCreditAvailableAt <= Date.now()) {
            user.aiCredit = 3;
            user.aiCreditAvailableAt = null;
            await user.save();
        }

        if (user.aiCredit <= 0) {
            user.aiCreditAvailableAt = Date.now() + 24 * 60 * 60 * 1000;
            await user.save();
            return res.status(401).json({
                success: false,
                message: "Ai Credit not available, try after 1 day"
            });
        }

        user.aiCredit -= 1;

        const { title } = req.body;
        if (!title || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const data = await generateAiDescription(title);
        await user.save();

        return res.json({
            success: true,
            message: "Working",
            data: data
        })

    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
})

router.put("/edit/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Check if post exists
        const existingBlog = await postModel.findById(id);
        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        // 2. Check if current user owns the blog
        if (!existingBlog.userId.equals(req.userId)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to edit this blog",
            });
        }

        // 3. Handle image
        let img_url = null;
        const file = req.file;

        if (file) {
            try {
                const response = await imageKitKey.upload({
                    file: file.buffer,
                    fileName: file.originalname,
                });

                img_url = imageKitKey.url({
                    path: response.filePath,
                    transformation: [
                        {
                            quality: "auto",
                            width: "512",
                            format: "webp",
                            height: "512",
                            crop: "maintain_ratio",
                            trim: "color",
                        },
                    ],
                });
            } catch (err) {
                console.error("Image upload failed:", err);
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed",
                    error: err.message,
                });
            }
        }

        // 4. Update blog with partial fields
        const data = req.body;

        await postModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...data, // title, content, category, etc
                    image: img_url || existingBlog.image, // keep old image if no new upload
                },
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating blog",
            error: error.message,
        });
    }
});



export default router;