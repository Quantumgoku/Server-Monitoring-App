const jwt = require('jsonwebtoken');
const User = require('../models/Users'); 

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //console.log('Decoded:', decoded);
            req.user = await User.findById(decoded.user.id).select('-password');
            if(!req.user) {
                return res.status(404).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role ${req.user.role} is not authorized` });
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };
