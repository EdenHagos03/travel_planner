import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

mongoose.set("strictQuery", false);

// 
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });        
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

// 
const userSchema = new mongoose.Schema({
    name: String,
});
const User = mongoose.model('user', userSchema);

// 
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// 
app.get('/user', async (req, res) => {
    try {
        const users = await User.find().sort({ name: 1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch user' });
    }
});

// 
app.listen(port, () => {
    connect();
    console.log('Server listening on port', port);
});
