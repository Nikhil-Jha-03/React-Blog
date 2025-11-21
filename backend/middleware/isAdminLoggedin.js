import jwt from 'jsonwebtoken';
import adminModel from '../Schema/AdminSchema.js';

export const verifyAdminToken = async (req, res, next) => {
    try {
        const header = req.header('Authorization');

        if (!header) {
            return res.status(401).json({
                success: false,
                message: "Authorization header not found"
            });
        }

        const token = header.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing in Authorization header"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }

        // Fetch admin from DB
        const admin = await adminModel.findById(decoded.id).select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found or account deleted"
            });
        }

        req.adminId = admin._id;  // Attach admin ID
        req.admin = admin;        // (optional) Attach full admin object
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        console.error("Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
