import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ConnectDB from './config/db.js';
import authRoutes from './routes/authRout.js';
import contactRoutes from './routes/contactRoutes.js';
import setupSocket from './socket.js';
import MessgaeRoute from './routes/MessagesRoute.js';
import path from "path";
import { fileURLToPath } from 'url';
import channelRoute from './routes/channelRoute.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ConnectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}));
app.use(cookieParser());


app.use('/upload/profile', express.static(path.join(__dirname, 'upload/profile')));
app.use('/upload/files', express.static(path.join(__dirname, 'upload/files')));


app.get("/",(req,res)=>{
    res.send();
})

app.use('/api/auth',authRoutes);
app.use('/api/contacts',contactRoutes);
app.use('/api/messages',MessgaeRoute);
app.use('/api/channel',channelRoute);

// Start server
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

setupSocket(server);