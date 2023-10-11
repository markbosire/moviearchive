import React, { useState,useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

import { Dialog, DialogTitle, DialogContent, TextField, Button, Snackbar, Rating } from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ReviewItem from './ReviewItem';
import { ConstructionOutlined } from '@mui/icons-material';

const SubmitButton = styled(Button)(({ theme }) => ({
  borderColor: 'white',
  color: 'white',
  margin: "10px 0",
  minWidth: "250px",
  '&:hover': {
    borderColor: 'purple',
    color: 'purple',
    
  },
}));
const RatingTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInput-underline:after': {
        borderBottomColor: '#B2BAC2',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#E0E3E7',
        },
        '&:hover fieldset': {
          borderColor: '#B2BAC2',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#6F7E8C',
        },
      },
  }));
  function MovieReviewComponent({movieId,reviews,setReviews}){
    const [reviewText, setReviewText] = useState('');
    const TOKEN = localStorage.getItem('token');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [score, setScore] = useState(0); // Add this line
    const handleSubmit = async () => {
        try {
          const response = await fetch('https://movieappapi.vercel.app/reviews', {
            method: 'POST',
            headers: { 'Authorization': `${TOKEN}`,'Content-Type': 'application/json' },
            body: JSON.stringify({ content: reviewText, movieId: movieId ,score: score }), // Update this line
          });
          if (!response.ok) throw new Error('Failed to submit review');
          const data = await response.json();
          console.log(data.review);
          reviews&&console.log(reviews)
          reviews&&setReviews([...reviews,data.review])
            
    
       
          setSnackbarMessage('Review sent successfully');
        } catch (error) {
            console.error(error)
          setSnackbarMessage(`Error: ${error.message}`);
        } finally {
          setOpenSnackbar(true);
        }
      };
    return(
        <React.Fragment>
               <Rating name="movie-rating" value={score}  precision={0.5} onChange={(event, newValue) => {setScore(newValue);}} /> {/* Update this line */}
        <RatingTextField
        
          multiline
          rows={4}
         
          placeholder="Write your thoughts on the movie"
          variant="outlined"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
         
        />
        <SubmitButton variant="outlined" color="secondary" onClick={handleSubmit}>
          Submit Review
        </SubmitButton>
        <Snackbar open={openSnackbar} autoHideDuration={6000} message={snackbarMessage} />
        </React.Fragment>
    )

  }
  export default MovieReviewComponent;