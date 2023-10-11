import React, { useState,useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

import { Dialog, DialogTitle, DialogContent, TextField, Button, Snackbar, Rating } from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ReviewItem from './ReviewItem';
import MovieReviewComponent from './movieReviewComponent';
import { Token } from '@mui/icons-material';

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

export default function MovieReviewDialog({ movies,colors,movieIndex,color,setReviewBig,movi,reviewBig}) {
  const [open, setOpen] = useState(false);
  const movie = movies[movieIndex]


  const [reviews, setReviews] = useState([]);
  const [reviews1, setReviews1] = useState([]);
  const [reviews2, setReviews2] = useState([]);
  const TOKEN = localStorage.getItem('token');
  const fetchReviews = async (func,mov) => {
    try {
      const response = await fetch(`https://weak-jade-salmon-ring.cyclic.app/reviews/${mov.id}`, {
        headers: { 'Authorization': `${TOKEN}` },
      });
      console.log(mov)
      const data = await response.json();
      func(data);
    
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };
  const setmovies =()=>{
    fetchReviews(setReviews,movies[0]);
    fetchReviews(setReviews1,movies[1]);
    fetchReviews(setReviews2,movies[2]);
    fetchReviews(setReviewBig,movi)

  }
  
  useEffect(() => {
    console.log(Token)
  setmovies()
    
  }, []);
  


  return (
    <React.Fragment>
        <div className='movie-trailer' style={{color:colors?colors[movieIndex]:color, border: `1px solid ${colors?colors[movieIndex]:color}`}} onClick={()=>{setOpen(true)}}><i class="fa fa-book sm" aria-hidden="true"></i>

Write Review</div>
   
    <Dialog open={open} onClose={() => setOpen(false)}>
    <DialogTitle style={{backgroundColor:"#222",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}><p>{movie.title}</p>
      <IconButton
      edge="end"
      color="inherit"
      onClick={() => setOpen(false)}
      aria-label="close"
      
    >
      <CloseIcon />
    </IconButton></DialogTitle>
      <DialogContent className='dcmv'>
  
       
       <MovieReviewComponent movieId={movie.id} reviews={reviewBig} setReviews={setReviewBig}/>
        {!movi&&(movieIndex==0?reviews.map((review) => (
   <ReviewItem key={review._id} review={review} />
)):movieIndex==1?reviews1.map((review) => (
    <ReviewItem key={review._id} review={review} />
  )):reviews2.map((review) => (
    <ReviewItem key={review._id} review={review} />
  )))}

      </DialogContent>
    
    </Dialog>
    </React.Fragment>
  );
}
