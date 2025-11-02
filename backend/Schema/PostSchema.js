import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    views: { type: Number, default: 0 },
    // views: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, can change but logic should also be change
    status: { type: String, enum: ["draft", "published"], default: "published" },
    feature: { type: Boolean, default: false }
}, { timestamps: true })

const postModel = mongoose.model('Post', postSchema)

export default postModel;