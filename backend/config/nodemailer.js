import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.GOOGLE_PASS
    }
});

export default transporter;