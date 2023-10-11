import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewItem from './ReviewItem';
import LoadingGif from './loadingGif';

import MovieContainer from './movieContainer'; // Import the MovieContainer component

const MovieDetails = ({ selectedMovieId }) => {
    const authToken = localStorage.getItem("token");

    // Create an Axios instance with default headers
    const axiosInstance = axios.create({
      baseURL: 'https://weak-jade-salmon-ring.cyclic.app/', // Replace with your API base URL
      headers: {
        'Authorization': `${authToken}`,
        'Content-Type': 'application/json', // Adjust the content type as needed
      },
    });
    const token = localStorage.getItem('token');
  const [movie, setMovie] = useState({});
  const [reviews, setReviews] = useState([]);
  const RenderReview=()=>{
    return <div className='review-container'> <div className="review-grid">
    {reviews.map((review) => (
      <ReviewItem key={review._id} review={review} />
    ))}
  </div></div>
  }
  const [color,setColor] = useState("")
  const [movieLoading,setMovieLoading]=useState(true)
  const [colors,setColors] = useState([])
  const movieIndex=0
  const [movies,setMovies] =useState([])
  useEffect(()=>{
    RenderReview()
  },[reviews])
  const handleSearchTrailer = () => {
    // Construct the YouTube search query
    const movieTitle = movies[movieIndex].title;
    const movieYear = movies[movieIndex].release_date.substring(0, 4); // Extract the year from the release date
    const searchQuery = `${movieTitle} ${movieYear} trailer`;
  
    // Create the YouTube search URL
    const youtubeURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
  
    // Open a new tab or window with the YouTube search results
    window.open(youtubeURL, '_blank');
  };
  const getColor = async(mov)=>{
    const imageUrl= `https://image.tmdb.org/t/p/w500${mov.poster_path}`
    const getresponse = await fetch('https://imageapi-ten.vercel.app/getDominantColor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({imageUrl }),
    });
    
    if (!getresponse.ok) {
      throw new Error('Network response was not ok for color');
    }
  
    const getdata = await getresponse.json();
    mov&&setColor(getdata.dominantColor);
    let tempColors=[]
    tempColors.push(color)
    setColors(tempColors)
    console.log(colors)
  }

  useEffect( () => {
    if (selectedMovieId) {
      // Fetch movie details for the selected movie using the TMDB API.
      axios
        .get(`https://api.themoviedb.org/3/movie/${selectedMovieId}?api_key=7bbc16b08ec7ccb42b7d7b4c5b289bdf`)
        .then(async (response) => {
          setMovie(response.data);
          console.log(response.data)
          var jsonObject = response.data;
          const imageUrl= `https://image.tmdb.org/t/p/w500${jsonObject.poster_path}`
          const getresponse = await fetch('https://imageapi-ten.vercel.app/getDominantColor', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({imageUrl }),
          });
          
          
          const getdata = await getresponse.json();

// Add a new element to the JavaScript object
jsonObject.color = getdata.dominantColor;

// Convert the modified JavaScript object back to JSON format
var modifiedJsonResponse = JSON.stringify(jsonObject);

          let tempMovies =[]
          tempMovies.push(JSON.parse(modifiedJsonResponse))
          setMovies(tempMovies)
          console.log(movies)
          

          setMovieLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching movie details:', error);
        });

      // Fetch reviews for the selected movie using your API endpoint.
      axiosInstance
        .get(`reviews/${selectedMovieId}`)
        .then((response) => {
          setReviews(response.data);
        })
        .catch((error) => {
          console.error('Error fetching reviews:', error);
        });
    }
  }, [selectedMovieId]);

  return (
    <div className="movie-details-page">
      {movieLoading? <LoadingGif/>:(
        <MovieContainer
        token={token}
        revi={reviews}
        setRevi={setReviews}
        onSearchTrailer={handleSearchTrailer}
     
        movieIndex={movieIndex}

          movies={movies}
          reviews={RenderReview} // Pass the reviews as a prop to MovieContainer
        />
      )}
    </div>
  );
};

export default MovieDetails;
