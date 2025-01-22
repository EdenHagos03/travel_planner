import mongoose from 'mongoose';
import pkg from 'validator';
import bcrypt from 'bcrypt';
const {isEmail} = pkg;

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        required: [true, 'Email is required'],
        unique : true,
        lowercase : true,
        validate : [isEmail, 'please enter a valid email']

    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Minimum length of 8 character is required']
        
    },
});

userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
});

const User = mongoose.model('user', userSchema);

export default User;