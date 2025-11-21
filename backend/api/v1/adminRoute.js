import express from 'express';
import bcrypt from 'bcrypt';
import { verifyAdminToken } from '../../middleware/isAdminLoggedin.js';
import adminModel from '../../Schema/AdminSchema.js';
import jwt from 'jsonwebtoken';



const router = express.Router();

// JWT Secret Key (Store this in .env file in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// 1. ADMIN SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  console.log("working")
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password'
      });
    }

    // Check if admin already exists in signup collection
    const existingAdmin = await adminModel.findOne({
      $or: [{ email }, { username }]
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email or username already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin in signup collection
    const newAdmin = new adminModel({
      username,
      email,
      password: hashedPassword
    });

    await newAdmin.save();


    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email
      }
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
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find admin in login collection
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        email: admin.email
      },
      JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
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
router.get('/profile', verifyAdminToken, async (req, res) => {
  try {
    const admin = await adminModel.findById(req.admin.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    return res.status(200).json({
      success: true,
      admin
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});


// 5. LOGOUT ROUTE (Optional)
router.post('/admin/logout', verifyAdminToken, (req, res) => {
  // With JWT, logout is handled on frontend by removing token
  // This endpoint is optional, mainly for logging purposes
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});


export default router;
