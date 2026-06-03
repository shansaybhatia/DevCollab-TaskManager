const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { setServers } = require('node:dns/promises');
setServers(['1.1.1.1', '8.8.8.8']);

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Successfully connected to Mongodb Atlas!'))
    .catch((error) => console.log('Database connection is failed:', error));

app.get('/', (req,res) => {
    res.send('TaskManager is working!');
});

const port = 3000;

app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`);
});