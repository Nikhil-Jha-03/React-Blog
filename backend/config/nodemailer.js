import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'jhanikhil2083@gmail.com',
        pass: 'kdxxloimzqayrumz'
    }
})

// user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD

export default transporter;