const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const audiobookRoutes = require('./routes/audiobookRoutes');

const app = express();
const PORT = 5000;

dotenv.config();

//using middleware
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to database MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});
app.use((err, req, res, next) => {
    console.error('Error caught by middleware:', err);
    res.status(500).json({ message: 'Server error occured' });
});

app.use('/api/users', userRoutes);
app.use('/api/audiobooks', audiobookRoutes);

app.get('/',(req,res)=>{
    res.send('Hello World!');
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
