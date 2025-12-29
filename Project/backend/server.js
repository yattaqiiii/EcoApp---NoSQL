// backend/server.js

import express from 'express';
import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// 

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// connection to mongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Berhasil terhubung ke MongoDB Atlas'))
    .catch((err) => console.error('Gagal koneksi... : ', err));

// routing

// port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Express dah jalan! di http://localhost:${PORT}`);
});