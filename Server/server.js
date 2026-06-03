const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://vaibhavdhiman265_db_user:XdRJm0A6AniMinEU@taskmanager.gmkzjji.mongodb.net/DevCollab?retryWrites=true&w=majority')
    .then(() => console.log('Successfully connected to Mongodb Atlas!'))
    .catch((error) => console.log('Database connection is failed:', error));

app.get('/', (req,res) => {
    res.send('TaskManager is working!');
});

const port = 3000;

app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`);
});