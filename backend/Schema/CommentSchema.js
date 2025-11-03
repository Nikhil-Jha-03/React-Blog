import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },{default:0}]
}, { timestamps: true })

const commentModel = mongoose.model('Comment', commentSchema)

export default commentModel;