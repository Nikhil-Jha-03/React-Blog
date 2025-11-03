import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{type:mongoose.Schema.Types.ObjectId,ref:"Comment"}],
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["draft", "published"], default: "published" },
    feature: { type: Boolean, default: false }
}, { timestamps: true })

const postModel = mongoose.model('Post', postSchema)

export default postModel;