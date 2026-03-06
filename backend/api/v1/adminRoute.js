import express from 'express';
import bcrypt from 'bcrypt';
import { verifyAdminToken } from '../../middleware/isAdminLoggedin.js';
import adminModel from '../../Schema/AdminSchema.js';
import jwt from 'jsonwebtoken';
import { z } from 'zod';



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


export default router;
