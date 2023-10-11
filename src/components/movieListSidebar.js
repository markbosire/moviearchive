import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieSearchDialog from './MovieSearchDialog';

const MovieListSidebar = ({ selectedCollectionId, setSelectedMovieId , selectedMovieId , title}) => {
  const [movieIds, setMovieIds] = useState([]);
  const [searchMovieId,setSearchMovieId]=useState(0);
  const [movieTitles, setMovieTitles] = useState([]);
  const authToken = localStorage.getItem("token");

// Create an Axios instance with default headers
const axiosInstance = axios.create({
  baseURL: 'https://weak-jade-salmon-ring.cyclic.app/', // Replace with your API base URL
  headers: {
    'Authorization': `${authToken}`,
    'Content-Type': 'application/json', // Adjust the content type as needed
  },
});

  useEffect(() => {
    // Fetch the movie IDs for the selected collection using an API endpoint.
    if (selectedCollectionId) {
      axiosInstance
        .get(`collections/${selectedCollectionId}`)
        .then((response) => {
          const movieIds = response.data.movieIds;
          setSelectedMovieId(movieIds[0])
          setMovieIds(movieIds);

          // Fetch movie titles for each movie ID using the TMDB API.
          const promises = movieIds.map((movieId) =>
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=7bbc16b08ec7ccb42b7d7b4c5b289bdf`)
          );

          Promise.all(promises)
            .then((responses) => {
              const titles = responses.map((response) => response.data.title);
              setMovieTitles(titles);
            })
            .catch((error) => {
              console.error('Error fetching movie titles:', error);
            });
        })
        .catch((error) => {
          console.error('Error fetching collection:', error);
        });
    }
  }, [selectedCollectionId]);

  const handleMovieClick = (movieId) => {
    setSelectedMovieId(movieId);
  };
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  useEffect(()=>{
    console.log(searchMovieId)
  },[])

  return (

    <div className="movie-list-sidebar">
  
    <h2>{title} Movie List</h2>
    <div className='colcontrol'> <select
      value={selectedMovieId || ''}
      onChange={(e) => handleMovieClick(e.target.value)}
    >
      <option value="">Select a movie</option>
      {movieTitles.map((title, index) => (
        <option key={movieIds[index]} value={movieIds[index]}>
          {title}
        </option>
      ))}
    </select>
     <MovieSearchDialog title={title} collectionId={selectedCollectionId} movieTitles={movieTitles} setMovieTitles={setMovieTitles} movieIds={movieIds} setMovieIds={setMovieIds}/>
      </div> 
  </div>
  );
};

export default MovieListSidebar;
