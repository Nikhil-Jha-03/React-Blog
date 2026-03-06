import jwt from 'jsonwebtoken';
import adminModel from '../Schema/AdminSchema.js';

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    return process.env.JWT_SECRET;
};

export const verifyAdminToken = async (req, res, next) => {
    try {
        const header = req.header('Authorization');

        if (!header) {
            return res.status(401).json({
                success: false,
                message: "Authorization header not found"
            });
        }

        if (!/^Bearer\s+/i.test(header)) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        const token = header.split(/\s+/)[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing in Authorization header"
            });
        }

        const decoded = jwt.verify(token, getJwtSecret());

        if (!decoded || !decoded.id || decoded.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }

        const admin = await adminModel.findById(decoded.id).select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found or account deleted"
            });
        }

        req.adminId = admin._id;
        req.admin = admin;
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
