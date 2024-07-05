const express = require('express');
const mongoose = require('mongoose');
const Audiobook = require('../models/Audiobook');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Route to get all audiobooks
router.get('/', async (req, res) => {
    try {
        const audiobooks = await Audiobook.find();
        res.json(audiobooks);
        //console.log(audiobooks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to add initial audiobooks data
router.post('/init', async (req, res) => {
    //console.log(req.body); 
    const audiobooks = [
        { 
            id: 1, 
            title: "The Great Gatsby", 
            author: "F. Scott Fitzgerald", 
            genre: "Classic",
            imageUrl: "https://cdn.kobo.com/book-images/2411acbb-9daa-43fb-a5a2-a9aec064e17e/1200/1200/False/the-great-gatsby-238.jpg",
            reviews: []
        },
        { 
            id: 2, 
            title: "To Kill a Mockingbird", 
            author: "Harper Lee", 
            genre: "Classic",
            imageUrl: "https://m.media-amazon.com/images/I/81gepf1eMqL._AC_UF1000,1000_QL80_.jpg",
            reviews: []
        },
        { 
            id: 3, 
            title: "1984", 
            author: "George Orwell", 
            genre: "Dystopian",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3DZVHkMnxCM7zTK9tG93DlBKSALurI0UZnA&s",
            reviews: []
        },
        {
            id: 4,
            title: "Pride and Prejudice",
            author: "Jane Austen",
            genre: "Classic",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2CLxHw3LHbHIMZiLbPU1-aFn48Wu0G8ZrdA&s",
            reviews: []
        },
        {
            id: 5,
            title: "The Catcher in the Rye",
            author: "J.D. Salinger",
            genre: "Classic",
            imageUrl: "https://m.media-amazon.com/images/I/81OthjkJBuL.jpg",
            reviews: []
        },
        {
            id: 6,
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            genre: "Fantasy",
            imageUrl: "https://m.media-amazon.com/images/I/71MvqRhC6SS._AC_UF1000,1000_QL80_.jpg",
            reviews: []
        },
        {
            id: 7,
            title: "Harry Potter and the Sorcerer's Stone",
            author: "J.K. Rowling",
            genre: "Fantasy",
            imageUrl: "https://m.media-amazon.com/images/I/81YOuOGFCJL.jpg",
            reviews: []
        },
        {
            id: 8,
            title: "The Alchemist",
            author: "Paulo Coelho",
            genre: "Fiction",
            imageUrl: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg",
            reviews: []
        },
        {
            id: 9,
            title: "The Da Vinci Code",
            author: "Dan Brown",
            genre: "Mystery",
            imageUrl: "https://m.media-amazon.com/images/I/815WORuYMML._AC_UF1000,1000_QL80_.jpg",
            reviews: []
        },
        {
            id: 10,
            title: "The Hunger Games",
            author: "Suzanne Collins",
            genre: "Dystopian",
            imageUrl: "https://m.media-amazon.com/images/I/61JfGcL2ljL.jpg",
            reviews: []
        }        
    ];

    try {
        await Audiobook.insertMany(audiobooks);
        res.status(201).json({ message: 'Audiobooks data inserted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("The error is ", err);
    }
});

// Route to update an audiobook's reviews
router.post('/:id/reviews', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId,userName, reviewText } = req.body;
    //console.log("User info: ",userId,userName,reviewText,id);

    try {
        const audiobook = await Audiobook.findById(id);
        if (!audiobook) {
            return res.status(404).json({ message: 'Audiobook not found' });
        }

        // Ensure userId is provided and matches the authenticated user
        if (!userId || userId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        audiobook.reviews.push({ userId, userName, reviewText });
        await audiobook.save();
        res.status(200).json(audiobook);
        //console.log("Try block of api works properly");
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/:id/ratings',authenticateToken,async(req,res)=>{
    const { id } = req.params;
    const { userId,userName, rating } = req.body;

    try {
        const audiobook = await Audiobook.findById(id);
        if (!audiobook) {
            return res.status(404).json({ message: 'Audiobook not found' });
        }

        // Ensure userId is provided and matches the authenticated user
        if (!userId || userId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Check if the user has already rated this audiobook
        const existingRating = audiobook.ratings.find(r => r.userId.toString() === userId.toString());
        if (existingRating) {
            existingRating.rating = rating;
        } else {
            audiobook.ratings.push({ userId, userName, rating });
        }
        console.log("Ratings updated: ",userId,userName,rating)
        
        await audiobook.save();
        res.status(200).json(audiobook);
        //console.log("Try block of api works properly");
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
router.put('/:id/ratings/:userId', authenticateToken, async (req, res) => {
    const { id, userId } = req.params;
    const { rating } = req.body;

    try {
        const audiobook = await Audiobook.findById(id);
        if (!audiobook) {
            return res.status(404).json({ message: 'Audiobook not found' });
        }

        // Ensure userId is provided and matches the authenticated user
        if (userId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find the existing rating
        const existingRating = audiobook.ratings.find(r => r.userId.toString() === userId.toString());
        if (existingRating) {
            existingRating.rating = rating;
        } else {
            return res.status(404).json({ message: 'Rating not found' });
        }

        await audiobook.save();
        res.status(200).json(audiobook);
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Route to get an audiobook by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const audiobook = await Audiobook.findById(id);
        if (!audiobook) {
            return res.status(404).json({ message: 'Audiobook not found' });
        }

        res.status(200).json(audiobook);
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// New Route to fetch all user ratings for a specific audiobook
router.get('/:id/ratings', async (req, res) => {
    const { id } = req.params;

    try {
        const audiobook = await Audiobook.findById(id);
        if (!audiobook) {
            return res.status(404).json({ message: 'Audiobook not found' });
        }

        res.status(200).json(audiobook.ratings);
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;