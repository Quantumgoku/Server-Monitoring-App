const ServerStatusLog = require('../models/serverStatusLog');

const generateReport = async (req, res) => {
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

        if (logs.length === 0) {
            return res.json({ message: 'No logs found for the specified period.' });
        }

        const events = [];
        let downStart = null;

        for (let i = 1; i < logs.length; i++) {
            const prevLog = logs[i - 1];
            const currLog = logs[i];

            // Detect status change from 'up' to 'down'
            if (prevLog.status === 'up' && currLog.status === 'down') {
                downStart = currLog.timestamp;
            }

            // Detect status change from 'down' to 'up'
            if (prevLog.status === 'down' && currLog.status === 'up') {
                const downEnd = currLog.timestamp;
                if (downStart) {
                    const duration = Math.floor((downEnd - downStart) / 1000); // Duration in seconds
                    events.push({
                        downDate: downStart.toISOString().split('T')[0],
                        downTime: downStart.toISOString().split('T')[1].slice(0, 8),
                        upDate: downEnd.toISOString().split('T')[0],
                        upTime: downEnd.toISOString().split('T')[1].slice(0, 8),
                        duration: `${Math.floor(duration / 60)}m ${duration % 60}s`
                    });
                    downStart = null;
                }
            }
        }

        // If the server was down at the end of the period, calculate the duration till the end of the period
        if (downStart) {
            const duration = Math.floor((end - downStart) / 1000); 
            events.push({
                downDate: downStart.toISOString().split('T')[0],
                downTime: downStart.toISOString().split('T')[1].slice(0, 8),
                upDate: end.toISOString().split('T')[0],
                upTime: end.toISOString().split('T')[1].slice(0, 8),
                duration: `${Math.floor(duration / 60)}m ${duration % 60}s (till end of period)`
            });
        }
        //console.log(events);
        res.json(events);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { generateReport };
