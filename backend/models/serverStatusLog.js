const mongoose = require('mongoose');

const serverStatusLogSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['up', 'down'],
    },
    timestamp: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('serverStatusLog', serverStatusLogSchema);