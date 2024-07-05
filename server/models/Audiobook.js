const mongoose = require('mongoose');

// Schema for user reviews
const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true }, // Add userName to the review schema
    reviewText: { type: String, required: true },
}, { _id: false });

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 } // Assuming rating is between 1 and 5
}, { _id: false });

// Schema for audiobooks
const audiobookSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    imageUrl: { type: String, required: true },
    reviews: { type: [reviewSchema], default: [] }, // Array of reviews
    ratings: { type: [ratingSchema], default: [] } // Array of ratings
});

const Audiobook = mongoose.model('Audiobook', audiobookSchema);

module.exports = Audiobook;
