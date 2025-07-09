import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './routes/userDetailsRoute';

// Initialize Express app
const expressApp = express();

// Full CORS config for cross-origin requests from Vite (localhost:5173)
expressApp.use(cors({
    origin: 'http://localhost:5173',     // allow your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // allowed methods
    credentials: true                    // allow credentials (cookies, headers if needed)
}));

// Middleware
expressApp.use(express.json());          // to parse JSON bodies
expressApp.use('/user', router);         // mount your user routes

// MongoDB connection URI
const MONGO_URI = "mongodb+srv://nikhithaa308:CnBIa4aocjjFSPPd@cluster0.qqokkzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err: Error) => console.error('❌ MongoDB connection error:', err));

// Test route
expressApp.get('/', (req, res) => {
    res.send('Hello from TypeScript Backend!');
});

// Start server
expressApp.listen(3002, () => {
    console.log('🚀 Server running at http://localhost:3002');
});
