const ServerStatusLog = require('../models/serverStatusLog');

exports.generateReport = async (req, res) => {
    const { startDate, endDate, ip } = req.body;
    if (!startDate || !endDate || !ip) {
        return res.status(400).json({ message: 'Please provide startDate, endDate, and ip' });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    try {
        const logs = await ServerStatusLog.find({
            ip,
            timestamp: {
                $gte: start.toISOString(),
                $lte: end.toISOString()
            }
        }).sort({ timestamp: 1 });

        const formattedLogs = logs.map(log => ({
            date: log.timestamp.toISOString().split('T')[0],
            time: log.timestamp.toISOString().split('T')[1].slice(0, 8),
            status: log.status
        }));

        res.json(formattedLogs);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
