import bcrypt from 'bcrypt';
import { configDotenv } from 'dotenv';
import User from '../module/User.js';

const handleErrors = (err)=>{
    console.log(err.message, err.code);
    let errors = { email: "", password: ""};

if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
}    

if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({properties})=> {
        errors[properties.path] = properties.message;
    });
}
return errors;
}
  
export const signup_get = (req, res)=>{
    res.render('signup');
}


export const signup_post = async (req, res) => {
    const {email,password} = req.body;

    try {
       const user = await User.create({email, password}); 
       res.status(201).json(user);
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });

    }
}

export const login_get = (req, res) => {
    res.render('login');
}

export const login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                res.status(200).json({ message: 'Login successful', user });
            } else {
                res.status(400).json({ error: 'Incorrect password' });
            }
        } else {
            res.status(400).json({ error: 'Email not registered' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};