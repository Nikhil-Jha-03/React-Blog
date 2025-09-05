import userModel from "../Schema/UserSchema.js";
import jwt from 'jsonwebtoken'

export const isLoggedIn = async (req, res, next) => {
    try {
        const header = req.header('Authorization')
        if (!header) {
            return res.status(401).json({
                success: false,
                message: "Header Not Found"
            })
        }

        const token = header.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing in Authorization header"
            })
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            })
        }


        const user = await userModel.findOne({ email: decoded.email }).select("-password")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found or account deleted"
            })
        }

        req.userId = user._id;
        next()
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
}