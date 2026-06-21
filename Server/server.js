const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dashboardRoutes = require('./routes/dashboardRoutes');
require('dotenv').config();

const { setServers } = require('node:dns/promises');
setServers(['1.1.1.1', '8.8.8.8']);

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Successfully connected to Mongodb Atlas!'))
    .catch((error) => console.log('Database connection is failed:', error));

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./Routes/userRoutes');
const projectRoutes = require('./Routes/projectRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/projects',projectRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.get('/', (req,res) => {
    res.send('TaskManager is working!');
});

const port = 3000;

app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`);
});