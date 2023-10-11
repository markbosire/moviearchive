import React from 'react';
import { Rating } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

function ReviewItem({ review }) {
  return (
    <div className='review' key={review._id}>
      <div className='review-head'>
        <Rating name="read-only" value={review.score} precision={0.5} readOnly />
        <p>{formatDistanceToNow(new Date(review.date))} ago</p>
      </div>
      <p className='review-message'>{review.content}</p>
    </div>
  );
}

export default ReviewItem;
