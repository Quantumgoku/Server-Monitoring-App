const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req,res) => {
    const { username,email,password } =req.body;

    try{
        const userExists = await User.findOne({ email });

        if(userExists){
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id:user_id },process.env.JWT_SECRET, {expiresIn: '20h'});

        res.status(201).json({ token });
    } catch (err) {
        //console.error(err.message);
        res.status(500).send('Server error');
    }
};

const loginUser = async (req,res) => {
    const { username,password } =req.body;
}