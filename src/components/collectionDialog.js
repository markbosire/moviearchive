import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Checkbox, FormControlLabel, Button, TextField, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import axios from 'axios';
import { grey } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const CollectionDialog = ({movieid,colors,movieIndex,color,collection,setCollection,setNoCollection}) => {
  
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const TOKEN = localStorage.getItem('token');


  useEffect(() => {
    console.log(TOKEN)
  
    axios.get('https://weak-jade-salmon-ring.cyclic.app/collections', {
      headers: {
        Authorization: `${TOKEN}`,
      },
    })
    .then((response) => {
      console.log(response.data)
      setCollections(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  // Add this useEffect hook
  useEffect(() => {
    console.log('A new collection has been added.');
    // You can add any logic you want here.
  }, [collections]);

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSelectedCollections([...selectedCollections, event.target.name]);
    } else {
      setSelectedCollections(selectedCollections.filter((id) => id !== event.target.name));
    }
  };

  const handleAddCollection = () => {
    if (!newCollectionName || /^\s*$/.test(newCollectionName)) {
      // Handle the case where newCollectionName is empty or contains only whitespace
      setSnackbarMessage(`Invalid collection name`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else {
      // Make the Axios POST request
      axios.post('https://weak-jade-salmon-ring.cyclic.app/collections', { name: newCollectionName }, {
        headers: {
          Authorization: `${TOKEN}`,
        },
      })
      .then((response) => {
        !collection&&setCollections([...collections, response.data.collection]);
        collection&&setCollection([...collection,response.data.collection])
        setCollection&&setNoCollection(false)
        setNewCollectionName('');
        setSnackbarMessage('Collection added successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('Error adding collection', error);
        setSnackbarMessage(`Error adding collection ${error}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
    }
  };

  const handleSaveToCollection = () => {
    selectedCollections.forEach((collectionId) => {
      axios.post(`https://weak-jade-salmon-ring.cyclic.app/collections/${collectionId}/movies`,
      {movieId: movieid},{
        
        headers: {
          Authorization: `${TOKEN}`,
        },
      })
      .then(() => {
        setSnackbarMessage('Movie added to collection successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error(`Error adding movie to collection ${collectionId}`, error);
        setSnackbarMessage(`Error adding movie to collection `);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
    });
  };

  return (<React.Fragment>
    {movieid?<div className='movie-trailer' style={{color:colors?colors[movieIndex]:color, border: `1px solid ${colors?colors[movieIndex]:color}`}} onClick={()=>{setOpen(true)}}><i class="fa fa-bookmark sm" aria-hidden="true"></i>

  Save to Collection</div>: <div onClick={()=>{setOpen(true)}}>Add New Collection</div>}
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle style={{backgroundColor:"#222",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}><p>{movieid?"Save to Collection":"New Collection"}</p>
      <IconButton
      edge="end"
      color="inherit"
      onClick={() => setOpen(false)}
      aria-label="close"
      
    >
      <CloseIcon />
    </IconButton></DialogTitle>
      <DialogContent className='dc'>
      <label htmlFor="new collection">New Collection Name</label>
        <input type='text' placeholder='New Collection Name' value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} />
        <div className='collectionBtn' onClick={handleAddCollection}>Add New Collection</div>
        {movieid&&(collections.map((collection) => (
          <FormControlLabel
            key={collection._id}
            control={<Checkbox sx={{
              color: grey[50],
              '&.Mui-checked': {
                color: grey[100],
              },
            }} checked={selectedCollections.includes(collection._id)} onChange={handleCheckboxChange} name={collection._id} />}
            label={collection.name}
          />
        )))}
        
        {movieid&&<div className='collectionBtn' onClick={handleSaveToCollection}>Save To Selected Collection</div>}
      </DialogContent>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
    </React.Fragment>
  );
};

export default CollectionDialog;
