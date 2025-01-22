import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authoRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

mongoose.set("strictQuery", false);

// 
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });        
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

//  For the user collection
const userSchema = new mongoose.Schema({
    firstName: {type : String, required : true },
    lastName: {type : String, required : true},
    email: {type : String, required : true},
    password: {type : String, required : true},
});
const User = mongoose.model('User', userSchema, 'user');

// for the trip collection 
const tripSchema = new mongoose.Schema({
    nameOfTrip: {type : String, required : true},
    startDate: {type : Date, required : true},
    endDate: {type : Date, required : true},
    destination: {type : String, required : true},
    duration: {type : String, required : true},
    price: {type : String, required : true}
});

const Trip = mongoose.model('Trip', tripSchema, 'trip');

// 
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(authoRoutes);

// user get
app.get('/user', async (req, res) => {
    try {
        const user = await User.find().sort({title: 1});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch user' });
    }
});

// trip get
app.get('/trip', async (req, res) => {
    try {
        const trips = await Trip.find().sort({name: 1});
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch trip' });
    }
});


// user post
app.post('/user', async (req, res) => {
    const data = req.body; 

    try {
        const newUser = new User(data); 
        await newUser.save(); 
        res.status(201).json(newUser); 
    } catch (err) {
        res.status(500).json({ err: 'Could not save user' });
    }
});

// trip post
app.post('/trip', async (req, res) => {
    const data = req.body; 

    try {
        const newTrip = new Trip(data); 
        await newTrip.save(); 
        res.status(201).json(newTrip); 
    } catch (err) {
        res.status(500).json({ err: 'Could not save trip' });
    }
});

// user delete
app.delete('/user/:id', async (req, res) => {
    const { id } = req.params; 

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Could not delete user' });
    }
});

// trip delete
app.delete('/trip/:id', async (req, res) => {
    const { id } = req.params; 

    try {
        const deletedTrip = await Trip.findByIdAndDelete(id);
        if (!deletedTrip) {
            return res.status(404).json({ message: 'trip not found' });
        }
        res.status(200).json({ message: 'trip deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Could not delete trip' });
    }
});

// user patch
app.patch('/user/:id', async (req, res) => {
    const { id } = req.params;  
    const updateData = req.body;  
    try {
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);  
    } catch (err) {
        res.status(500).json({ error: 'Could not update user' });
    }
});

// trip patch
app.patch('/trip/:id', async (req, res) => {
    const { id } = req.params;  
    const updateData = req.body;  
    try {
        const updatedTrip = await Trip.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedTrip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.status(200).json(updatedTrip);  
    } catch (err) {
        res.status(500).json({ error: 'Could not update Trip' });
    }
}); 

// 
app.listen(port, () => {
    connect();
    console.log('Server listening on port', port);
});


