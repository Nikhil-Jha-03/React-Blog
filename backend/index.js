import express from 'express';
import { configDotenv } from 'dotenv';

import { DatabaseConnection } from './config/db.js';
import router from './api/v1/index.js';
import cors from 'cors'

configDotenv({
    path: './.env',
    quiet: true
});
DatabaseConnection();

const app = express();

// Middleware
app.use(cors({
    // origin:process.env.FRONTEND_URL,
    // methods:["GET","POST","DELETE","PUT"],
    // allowedHeaders:["Content-Type","Authorization"]
}))
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', router);

app.get('/', (req, res) => {
    return res.json({
        success: true,
        msg: "Hello"
    });
});

app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});
