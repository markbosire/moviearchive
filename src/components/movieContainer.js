import React from 'react';
import CollectionDialog from './collectionDialog';
import MovieReviewDialog from './movieReviewDialog';
const MovieContainer = ({
    token,
  movies,
  genreName,
  backgroundColor,
  onSearchTrailer,
  handleClickOpen,
  Navigation,
  colors,
  movieIndex,
  revi,
  reviews,
  setRevi

}) => {
    const genres=
    [
     {
       "id": 28,
       "name": "Action"
     },
     {
       "id": 12,
       "name": "Adventure"
     },
     {
       "id": 16,
       "name": "Animation"
     },
     {
       "id": 35,
       "name": "Comedy"
     },
     {
       "id": 80,
       "name": "Crime"
     },
     {
       "id": 99,
       "name": "Documentary"
     },
     {
       "id": 18,
       "name": "Drama"
     },
     {
       "id": 10751,
       "name": "Family"
     },
     {
       "id": 14,
       "name": "Fantasy"
     },
     {
       "id": 36,
       "name": "History"
     },
     {
       "id": 27,
       "name": "Horror"
     },
     {
       "id": 10402,
       "name": "Music"
     },
     {
       "id": 9648,
       "name": "Mystery"
     },
     {
       "id": 10749,
       "name": "Romance"
     },
     {
       "id": 878,
       "name": "Science Fiction"
     },
     {
       "id": 10770,
       "name": "TV Movie"
     },
     {
       "id": 53,
       "name": "Thriller"
     },
     {
       "id": 10752,
       "name": "War"
     },
     {
       "id": 37,
       "name": "Western"
     }
   ]
   const getGenreName = (genreId) => {
     const genre = genres.find((genre) => genre.id == genreId);
     return genre ? genre.name : 'Unknown Genre';
   };
    console.log(movies)
    const movie= movies[movieIndex]
  return (
    <div className="movie-container">
      {handleClickOpen&&<div className="controls">
        <div className="label">
          <p style={{ color: backgroundColor?backgroundColor:movie.color }}>
            <strong style={{ color: "#fff" }}>Genre: </strong>
            {genreName}
          </p>
        </div>
        <div className="movie-trailer" style={{ color: "#fff", padding: "5px 15px", border: `1px solid #fff` }} onClick={handleClickOpen}>
          <i className="fa fa-pencil sm" aria-hidden="true"></i>
          Change Criteria
        </div>
      </div>}
      <section>
        <div className="movie-poster">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        </div>
        <div className="movie-details">
          <div>
            <p className="movie-title" style={{ color: backgroundColor?backgroundColor:movie.color }}>
              {movie.title}
            </p>
            <p className="movie-description">{movie.overview}</p>
            <div className="tag-container">
              {movie.genre_ids?movie.genre_ids.map((genreId) => (
                <div key={genreId} className="tag">
                  {getGenreName(genreId)}
                </div>
              )):movie.genres.map((genre) => (
                <div key={genre.id} className="tag">
                  {genre.name}
                </div>
              ))}
            </div>
          </div>
          <div className="movie-info" style={{ color: backgroundColor?backgroundColor:movie.color}}>
            <p className="movie-year">
              <strong className="green">Release date: </strong>
              {movie.release_date}
            </p>
            <p className="movie-rating">
              <strong className="green">Movie Rating: </strong>
              {movie.vote_average}/10
            </p>
            <p>
              <strong className="green">Vote Count: </strong>
              {movie.vote_count} votes
            </p>
          </div>
          <div className="movie-trailer" style={{ color: backgroundColor?backgroundColor:movie.color, border: `1px solid ${backgroundColor?backgroundColor:movie.color}` }} onClick={onSearchTrailer}>
            <i className="fa fa-search sm" aria-hidden="true"></i>
            Search Trailer
          </div>
          {token&&<CollectionDialog colors={colors} movieIndex={movieIndex} movieid={movies[movieIndex].id} color={movie.color}/>}
{token&&<MovieReviewDialog movies={movies} movieIndex={movieIndex} colors={colors} color={movie.color} setReviewBig={setRevi} reviewBig={revi} movi={movie}/>}
        </div>
      
      </section>
      {handleClickOpen&&Navigation()}
      {reviews&&reviews()}
      
    </div>
  );
};

export default MovieContainer;
