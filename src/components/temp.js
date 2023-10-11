import React, { useState } from 'react';
import { TextField, Dialog,DialogTitle, DialogContent,  Autocomplete } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider } from '@mui/material';
import { styled } from '@mui/material';
import axios from 'axios';

const MovieSearchDialog = ({ setSelectedMovieId, title }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const SearchTextField = styled(TextField)(({ theme }) => ({
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

  const fetchMovies = async (searchValue) => {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=7bbc16b08ec7ccb42b7d7b4c5b289bdf&query=${searchValue}`);
    const movies = response.data.results;
    setOptions(movies.map((movie) => movie.title));
  };

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  return (
    <React.Fragment>
      <div onClick={() => setOpen(true)}>Add New Movie to {toTitleCase(title)}</div>
      <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle style={{backgroundColor:"#222",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}><p>Add Movie</p>
      <IconButton
      edge="end"
      color="inherit"
      onClick={() => setOpen(false)}
      aria-label="close"
      
    >
      <CloseIcon />
    </IconButton></DialogTitle>
      <DialogContent style={{width:250, backgroundColor:"#222"}}>
        
        <Autocomplete
          id="movie-search"
          options={options}
          getOptionLabel={(option) => option}
          style={{ width: 210,backgroundColor: "#222" }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            fetchMovies(newInputValue);
            
          }}
          onChange={(event, newValue) => {
            newValue&&setSelectedMovieId(newValue.id);
          }}
          renderInput={(params) => <SearchTextField {...params} variant="outlined" />}
        />
      </DialogContent>
      </Dialog>
      
    </React.Fragment>
  );
};

export default MovieSearchDialog;
