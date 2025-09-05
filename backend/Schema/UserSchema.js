import mongoose from "mongoose";
import { boolean, number, string } from "zod"

const userSchema = new mongoose.Schema({
    name: { type: string, required: true },
    email: { type: string, required: true, unique: true },
    password: { type: string, required: true },
    verifyOtp: { type: string, default: '' },
    verifyOtpExpireAt: { type: number, default: 0 },
    isAccountVerified: { type: boolean, default: false },
    resetOtp: { type: string, default: '' },
    resetOtpExpireAt: { type: number, default: 0 },
    lastOtpSentAt: { type: number, default: 0 },
    otpFailedAttempts: { type: number, default: 0 },
    otpBlockedUntil: { type: number, default: 0 }
},{timestamps:true})


const userModel = mongoose.model('User', userSchema)

export default userModel;

// profile image