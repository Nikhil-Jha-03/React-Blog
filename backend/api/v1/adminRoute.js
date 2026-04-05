import express from 'express';
import bcrypt from 'bcrypt';
import { verifyAdminToken } from '../../middleware/isAdminLoggedin.js';
import adminModel from '../../Schema/AdminSchema.js';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import mongoose from 'mongoose';
import postModel from '../../Schema/PostSchema.js';
import userModel from '../../Schema/UserSchema.js';
import commentModel from '../../Schema/CommentSchema.js';



const router = express.Router();

const adminSignupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters'),
  email: z.string().trim().email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(64, 'Password must be at most 64 characters')
});

const adminLoginSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return process.env.JWT_SECRET;
};

const formatValidationErrors = (issues) =>
  issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message
  }));

const createAdminToken = (admin) =>
  jwt.sign(
    {
      id: admin._id,
      role: 'admin'
    },
    getJwtSecret(),
    { expiresIn: '1d' }
  );

const buildAdminPayload = (admin) => ({
  id: admin._id,
  username: admin.username,
  email: admin.email
});

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 1. ADMIN SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const parsedData = adminSignupSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        error: formatValidationErrors(parsedData.error.issues)
      });
    }

    const { username, email, password } = parsedData.data;
    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const existingAdmin = await adminModel.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email or username already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new adminModel({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword
    });

    await newAdmin.save();
    const token = createAdminToken(newAdmin);


    return res
      .setHeader('Authorization', `Bearer ${token}`)
      .status(201)
      .json({
        success: true,
        message: 'Admin registered successfully',
        token,
        admin: buildAdminPayload(newAdmin)
      });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
});

// 2. ADMIN LOGIN ROUTE

router.post('/login', async (req, res) => {
  try {
    const parsedData = adminLoginSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        error: formatValidationErrors(parsedData.error.issues)
      });
    }

    const { email, password } = parsedData.data;
    const normalizedEmail = email.trim().toLowerCase();
    const admin = await adminModel.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = createAdminToken(admin);

    return res
      .setHeader('Authorization', `Bearer ${token}`)
      .status(200)
      .json({
        success: true,
        message: 'Login successful',
        token,
        admin: buildAdminPayload(admin)
      });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});


// 4. PROTECTED ROUTE EXAMPLE
router.get('/getCurrentAdmin', verifyAdminToken, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      admin: buildAdminPayload(req.admin)
    });

  } catch (error) {
    console.error('Get current admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/profile', verifyAdminToken, (req, res) =>
  res.status(200).json({
    success: true,
    admin: buildAdminPayload(req.admin)
  })
);

// 5. LOGOUT ROUTE
router.post('/logout', verifyAdminToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// 6. GET ALL BLOGS (ADMIN)
router.get('/blogs', verifyAdminToken, async (req, res) => {
 
 console.log("trying to get blog data")
 
  try {
    const blogs = await postModel
      .find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('category', 'category');



    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    console.error('Get admin blogs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching blogs'
    });
  }
});

// 7. GET ALL USERS (ADMIN)
router.get('/users', verifyAdminToken, async (req, res) => {
  try {
    const users = await userModel
      .find()
      .sort({ createdAt: -1 })
      .select('_id name email isAccountVerified aiCredit createdAt updatedAt');

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// 8. DELETE ANY BLOG (ADMIN)
router.delete('/blogs/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog id'
      });
    }

    const deletedBlog = await postModel.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    await commentModel.deleteMany({ blogId: deletedBlog._id });

    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin blog error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting blog'
    });
  }
});

// 9. FEATURE / UNFEATURE BLOG (ADMIN, MAX 3)
router.patch('/blogs/:id/feature', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { feature } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog id'
      });
    }

    if (typeof feature !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'feature must be true or false'
      });
    }

    const blog = await postModel.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    if (feature) {
      if (blog.status !== 'published') {
        return res.status(400).json({
          success: false,
          message: 'Only published blogs can be featured'
        });
      }

      if (!blog.feature) {
        const featuredCount = await postModel.countDocuments({ feature: true });
        if (featuredCount >= 3) {
          return res.status(400).json({
            success: false,
            message: 'Maximum 3 featured blogs allowed'
          });
        }
      }
    }

    blog.feature = feature;
    await blog.save();

    return res.status(200).json({
      success: true,
      message: feature ? 'Blog marked as featured' : 'Blog removed from featured',
      blog
    });
  } catch (error) {
    console.error('Feature blog error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating featured status'
    });
  }
});

// 10. DELETE USER (ADMIN)
router.delete('/users/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id'
      });
    }

    const user = await userModel.findById(id).select('_id');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userBlogs = await postModel.find({ userId: id }).select('_id');
    const userBlogIds = userBlogs.map((blog) => blog._id);

    if (userBlogIds.length > 0) {
      await commentModel.deleteMany({ blogId: { $in: userBlogIds } });
      await postModel.deleteMany({ _id: { $in: userBlogIds } });
    }

    const userComments = await commentModel.find({ userId: id }).select('_id');
    const userCommentIds = userComments.map((comment) => comment._id);

    if (userCommentIds.length > 0) {
      await postModel.updateMany(
        { comments: { $in: userCommentIds } },
        { $pull: { comments: { $in: userCommentIds } } }
      );
    }

    await commentModel.deleteMany({ userId: id });
    await postModel.updateMany({}, { $pull: { like: user._id, views: user._id } });
    await commentModel.updateMany({}, { $pull: { likes: user._id } });
    await userModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
});


export default router;
