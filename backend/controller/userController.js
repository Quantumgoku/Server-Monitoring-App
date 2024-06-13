const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req,res) => {
    const { username,password,role } =req.body;

    try{
        const userExists = await User.findOne({ username });

        if(userExists){
            return res.status(400).json({ message: 'User already exists' });
        }

        let user = await new User({
            username,
            password,
            role
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(201).json({ user });
    } catch (err) {
        //console.error(err.message);
        res.status(500).send('Server error');
    }
};

const loginUser = async (req,res) => {
    const { username,password } =req.body;

    try{
        const user = await User.findOne({ username });

        if(!user){
            return res.status(400).json({ message: 'User does not exist' });            
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const updateRoles = async (req,res) =>{
    const { id } = req.params;
    const { role } = req.body;
    try{
        let user = await User.findById(id);
        if(!user){
            return res.status(400).json({ message: 'User not found' });
        }
        user.role =role;
        await user.save();
        res.status(200).json({ message: 'User role updated' });
    }catch(err){
        //console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getRole = async (req,res) => {
    try{
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: 'User not found' });
        }
        //console.log(user.role);
        res.status(200).json({ role: user.role });
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }
};

const logoutUser = async (req,res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'User logged out' });
}

module.exports ={
    registerUser,
    loginUser,
    updateRoles,
    getRole,
    logoutUser
}