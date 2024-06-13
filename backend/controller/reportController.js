const ServerStatusLog = require('../models/serverStatusLog');

exports.generateReport = async (req, res) => {
    const { startDate, endDate, ip } = req.body;
    if (!startDate || !endDate || !ip) {
        return res.status(400).json({ message: 'Please provide startDate, endDate, and ip' });
    }

    try {
        const logs = await ServerStatusLog.find({
            ip,
            timestamp: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ timestamp: 1 });

        res.json(logs);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
