import React, { useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddMovieButton = ({ collectionId, movieId,movieTitles,setMovieTitles,movieTitle,movieIds,setMovieIds }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const authToken = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: 'https://weak-jade-salmon-ring.cyclic.app', // Replace with your API base URL
    headers: {
      'Authorization': `${authToken}`,
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
  });

  const addMovieToCollection = async () => {
    try {
      const response = await axiosInstance.post(`/collections/${collectionId}/movies`, { movieId });
      if (response.data.message) {
        setMovieIds([...movieIds,movieId]);
        setMovieTitles([...movieTitles,movieTitle]);
        console.log(movieTitles)
        setMessage(response.data.message);
        setSeverity('success');
        setOpen(true);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.error) {
        setMessage(error.response.data.error);
        setSeverity('error');
        setOpen(true);
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <div onClick={addMovieToCollection} style={{ cursor: 'pointer',border:"1px solid #fff", width:"auto", padding:"5px",display:"flex",alignItems:"center",justifyContent:"center" }}>
        Add Movie to Collection
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <div>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
        </div>
      </Snackbar>
    </div>
  );
};

export default AddMovieButton;
