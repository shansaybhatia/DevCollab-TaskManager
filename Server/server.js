const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const dns = require('dns');
require('dotenv').config();

try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch (_) {}

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

app.set('io', io);

const socketHandler = require('./socket/socketHandler');
socketHandler(io);

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

if (process.env.MONGO_URL) {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('Successfully connected to Mongodb Atlas!'))
    .catch((error) => console.log('Database connection failed:', error.message));
} else {
  console.log('⚠️ MONGO_URL not set in .env! Please create a .env file with your MONGO_URL.');
}

const authRoutes = require('./Routes/authRoutes');
const userRoutes = require('./Routes/userRoutes');
const projectRoutes = require('./Routes/projectRoutes');
const taskRoutes = require('./Routes/taskRoutes');
const dashboardRoutes = require('./Routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('DevCollab TaskManager API is running!');
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`);
});
