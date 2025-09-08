import mongoose from "mongoose";
import { boolean, string } from "zod";

const postSchema = new mongoose.Schema({
    title: { type: string, require: true },
    description: { type: string, require: true },
    image: { type: string, require: true },
    category: { type: string, require: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    views: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    feature: { type: boolean, default: false }
}, { timestamps: true })

const postModel = mongoose.model('Post', postSchema)

export default postModel;