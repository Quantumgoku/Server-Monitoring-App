const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'masteradmin'],
        default: 'user',
        required: true,
    }
}, {timestamps: true});

module.exports = mongoose.model('user', UserSchema);