const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const serverRoutes = require('./routes/serverRoutes');
const reportRoutes = require('./routes/reportRoutes');
const User = require('./models/Users');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

connectDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/auth', userRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/report',reportRoutes);

const ensureMasterAdmin = async () => {
    const masterAdmin = await User.findOne({ role: 'masteradmin' });
    if(!masterAdmin){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('masterAdmin_password', salt);
        await User.create({
            username: 'masteradmin',
            password: hashedPassword,
            role: 'masteradmin'
        });
        console.log('Master admin created');
    }
};

const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await ensureMasterAdmin();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();