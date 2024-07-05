import React from 'react';
import { useParams } from 'react-router-dom';
import './AudioBookDetail.css';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const AudiobookDetail = ({ audiobooks,setAudiobooks }) => {
    const { id } = useParams();
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [ratings, setRatings] = useState([]);
    const [audiobook, setAudiobook] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);

    ///this is for review part, to fetch the audiobook and display its data
    useEffect(() => {
        const fetchAudiobook = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/audiobooks/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                // if (response.data) {
                //     fetchRatings(response.data._id);
                // }
                setAudiobook(response.data);
            } catch (error) {
                console.error('Error fetching audiobook:', error);
            }
        };

        fetchAudiobook();
    }, [id]);

    
    // useEffect(() => {
    //     fetchRatings();
    // }, []);

    // const fetchRatings = async (audioBookId) => {
    //     console.log(audiobooks);
    //     const ab = audiobooks.find(book => book._id === id);
    //     console.log("Audiobook data: ",ab);
    //     try {
    //         const response = await fetch(`/audiobooks/${audioBookId}/ratings`);
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch ratings');
    //         }
    //         const data = await response.json();
    //         setRatings(data);
    //     } catch (error) {
    //         console.error('Error fetching ratings:', error);
    //     }
    // };


    const getUserFromToken = () => {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
    
        const payload = JSON.parse(atob(token.split('.')[1]));
        //console.log("Token payload: ", payload);
    
        // Extract id and name from the payload
        const { id, name } = payload;
        // console.log("Payload id and name: ",id, name);
        return { id, name };
    };

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:5000/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                //console.log("Response data:", response.data);
                //setUser(response.data)
                //console.log("User data: ", user);
            } catch (error) {
                console.error('Error fetching user data 2:', error);
                
            }
        };

        fetchUser();
    }, []);

    // console.log("Audiobooks: ", audiobooks);
    // console.log("URL id: ", id);

    // Find the audiobook by id
    //const audiobook = audiobooks.find(book => book._id === id);

    if (!audiobook) {
        return <p>Audiobook not found</p>;
    }

    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    const handleReviewSubmit = async (event) => {
        event.preventDefault();
        if (review.trim() === '') {
            return;
        } 
        const user = getUserFromToken();
        //console.log("user details: ",user.id,user.name, "and review: ", review);
        if (!user) {
            console.error('User not authenticated');
            return;
        }
        //console.log("Correct till used Id check: ",user);
        try {
            // console.log("Correct before api request! ", id);
            const res = await axios.post(`http://localhost:5000/api/audiobooks/${id}/reviews`, {
                userId: user.id, // Include userId in the review data
                userName: user.name, // Use user info obtained from login
                reviewText: review
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const latestReviews = res.data.reviews;

            // Sort the reviews such that the latest review comes first
            latestReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


            setAudiobook(prev => ({
                ...prev,
                reviews: latestReviews
            }));
            // Update the local state to include the new review
            // const updatedAudiobooks = audiobooks.map(book => {
            //     if (book._id === id) {
            //         const updatedReviews = [res.data.reviews.slice(-1)[0], ...book.reviews];
            //         // Sort reviews such that the latest review comes first
            //         updatedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            //         return { ...book, reviews: updatedReviews };
            //     }
            //     return book;
            // });
            // setAudiobooks(updatedAudiobooks);
            setReview('');
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };
    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleRatingSubmit = async (event) => {
        event.preventDefault();
        if (rating === 0) {
            return;
        }
        const user = getUserFromToken();
        if (!user) {
            console.error('User not authenticated');
            return;
        }
        // console.log("Reached till here");
        try {
            const existingRating = audiobook.ratings.find(r => r.userId === user.id);
            console.log(existingRating," and new rating ", rating);

            if (existingRating) {
                // Update existing rating
                const res = await axios.put(`http://localhost:5000/api/audiobooks/${id}/ratings/${existingRating.userId}`, {
                    rating: rating
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log("Updated existing rating");
                
            } else {
                // Add new rating
                const res = await axios.post(`http://localhost:5000/api/audiobooks/${id}/ratings`, {
                    userId: user.id,
                    userName: user.name,
                    rating: rating
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log("Added new rating");
            }
            // Fetch the updated audiobook data
            const updatedAudiobookResponse = await axios.get(`http://localhost:5000/api/audiobooks/${audiobook._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            setAudiobook(updatedAudiobookResponse.data);
            setRating(0);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const handleMouseEnter = (value) => {
        setHoverRating(value);
      };
    
      const handleMouseLeave = () => {
        setHoverRating(0);
      };
    return (
        <div className="audiobook-detail">
            <div className="left">
                <h1 className="audiobook-detail-item hed">{audiobook.title}</h1>
                <p className="audiobook-detail-item"><strong>Author:</strong> {audiobook.author}</p>
                <p className="audiobook-detail-item"><strong>Genre:</strong> {audiobook.genre}</p>
                {/* <p className="audiobook-detail-item"><strong>Description:</strong> {audiobook.description}</p> */}
                

                <div className="review-form">
                    <h3>Add a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="form-container">
                        <textarea
                            value={review}
                            onChange={handleReviewChange}
                            placeholder="Write your review"
                            className="review-textarea"
                        />
                        <button type="submit" className="submit-button">Submit Review</button>
                    </form>
                </div>
                <h2>User Reviews</h2>
                <div className="reviews-container">
                    
                {audiobook.reviews && audiobook.reviews.length > 0 ? (
                    audiobook.reviews.slice().reverse().map((review, index) => (
                        <div key={index} className="review-item">
                            <p><strong>{review.userName}:</strong> {review.reviewText}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet</p>
                )}
                </div>
                
            </div>
            <div className="right">
                <div className='imgContainer'>
                    <img className='image' src={audiobook.imageUrl} alt={audiobook.title} />
                </div>
                <div className="rating-form">
                
                    <form onSubmit={handleRatingSubmit} className="form-container">
                    <strong className='choice'>Give rating</strong>
                    
                        <div className="rating-container">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    className={`star ${(hoverRating >= star || rating >= star) ? 'selected' : ''}`}
                                    onMouseEnter={() => handleMouseEnter(star)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() => handleRatingChange(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <strong >{rating > 0 ? `${rating} stars` : ''}</strong>
                        <button type="submit" className="submit-button">Submit Rating</button>
                    </form>
                </div>
                <h2>User Ratings</h2>
                <div className="ratings-container">
                    {audiobook.ratings && audiobook.ratings.length > 0 ? (
                        audiobook.ratings.map((rating, index) => (
                            <div key={index} className="rating-item">
                                <p><strong>{rating.userName}:</strong> {rating.rating}</p>
                            </div>
                        ))
                    ) : (
                        <p>No ratings yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AudiobookDetail;
