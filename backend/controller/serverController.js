const Server = require('../models/Server');
const ServerStatusLog = require('../models/serverStatusLog');

const addServer = async (req, res) => {
    const { ip, name } = req.body;
    try {
        //console.log(req.body);
        const server = new Server(req.body);
        await server.save();
        res.status(201).json(server);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteServer = async (req, res) => {
    const { id } = req.params;
    try {
        const server = await Server.findByIdAndDelete(id);
        if (!server) {
            return res.status(404).json({ message: 'Server not found' });
        }
        res.status(200).json({ message: 'Server deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getServers = async (req, res) => {
    try {
        const servers = await Server.find();
        if(!servers) {
            return res.status(404).json({ message: 'No servers found' });
        }
        res.status(200).json(servers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getServerStatus = async (req, res) => {
    const { ip } = req.params;
    try {
        const logs = await ServerStatusLog.find({ ip }).sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addServer, deleteServer, getServers, getServerStatus };
