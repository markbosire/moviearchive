import React, { useState, useMemo } from 'react';
import { TextField, Dialog,DialogTitle, DialogContent,  Autocomplete } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { styled } from '@mui/material';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddMovieButton from './AddMovieButton';
import MovieReviewComponent from './movieReviewComponent';

// Create a new theme instance.
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const MovieSearchDialog = ({ title ,collectionId, movieTitles, setMovieTitles,movieIds,setMovieIds,reviews,setReviews}) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState({}); // Add this line

  const SearchTextField = useMemo(() => styled(TextField)(({ theme }) => ({
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
  })), []);

  const fetchMovies = async (searchValue) => {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=7bbc16b08ec7ccb42b7d7b4c5b289bdf&query=${searchValue}`);
    const movies = response.data.results;
    setOptions(movies);
  };

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  return (
    <React.Fragment>
      {title?<div onClick={() => setOpen(true)}>Add New Movie to {toTitleCase(title)}</div>:<div style={{border:"1px solid #fff", padding:"0 5px", width:"30%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={() => setOpen(true)} className='search-field'>Review Another Movie</div>}
      <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle style={{backgroundColor:"#222",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}><p>{title?`Add movie to ${title}`:"Review Movie"}</p>
      <IconButton
      edge="end"
      color="inherit"
      onClick={() => setOpen(false)}
      aria-label="close"
      
    >
      <CloseIcon />
    </IconButton></DialogTitle>
      <DialogContent style={{backgroundColor:"#222",display:"flex",flexDirection:"column",gap:"10px",color:"white",fontFamily:"fontFamily: 'proxima_nova_rgbold'!important"}}>
      <ThemeProvider theme={darkTheme}>
        
        <Autocomplete
          id="movie-search"
          options={options}
          fullWidth
          getOptionLabel={(option) => option.title}
          style={{ backgroundColor: "#222" }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            fetchMovies(newInputValue);
            
          }}
          onChange={(event, newValue) => {
          
            setSelectedMovie(newValue); // Add this line
          }}
          renderInput={(params) => <SearchTextField placeholder='Search movie' fullWidth {...params} variant="outlined" />}
        />
            </ThemeProvider>
        {selectedMovie.title && <div style={{color:"#fff" ,fontSize: "16px"}}>Selected Movie: {selectedMovie.title}</div>} {/* Add this line */}
        {collectionId && selectedMovie && <AddMovieButton collectionId={collectionId} movieId={selectedMovie.id} movieTitles={movieTitles} setMovieTitles={setMovieTitles} movieTitle={selectedMovie.title} movieIds={movieIds} setMovieIds={setMovieIds} />}
        {!collectionId&&<MovieReviewComponent movieId={selectedMovie.id} reviews={reviews} setReviews={setReviews}/>}
      </DialogContent>
      </Dialog>
      
    </React.Fragment>
  );
};

export default MovieSearchDialog;
