const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Server', ServerSchema);
