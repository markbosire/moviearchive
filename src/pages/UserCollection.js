import React, { useState,useEffect } from 'react';
import mySvg from "../logo.svg";
import axios from 'axios';
import "../App";
import CollectionDialog from '../components/collectionDialog';


import MovieListSidebar from '../components/movieListSidebar';

import LoadingGif from '../components/loadingGif';
import MovieDetails from '../components/movieDetails';// Import the MovieDetailsPage component
import Navbar from '../components/Navbar';

const UserCollection = () => {
  const [imgSrc, setImgSrc] = useState("");
  const [collections, setCollections] = useState([]);
  const [noCollection,setNoCollection]= useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [selectedMovieId,setSelectedMovieId] =useState(0)
  const [movie,setMovie]= useState({})
  const [movieLoading,setMovieLoading]=useState(true)
  const authToken = localStorage.getItem("token");
  useEffect(()=>{
    !authToken&& (window.location.href = '/signup')
  },[])
  
  const updateImgSrc = async (color) => {
    
    const response = await fetch(mySvg);
    const text = await response.text();
    const coloredText = text.replace('fill="#000000"', `fill="${color}"`);
    const base64 = btoa(coloredText);
   
   setImgSrc(`data:image/svg+xml;base64,${base64}`);
    }
  
  useEffect( () => {
    if (selectedMovieId) {
      // Fetch movie details for the selected movie using the TMDB API.
      axios
        .get(`https://api.themoviedb.org/3/movie/${selectedMovieId}?api_key=7bbc16b08ec7ccb42b7d7b4c5b289bdf`)
        .then(async (response) => {
          setMovie(response.data);
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

updateImgSrc(getdata.dominantColor)
      

        })
        .catch((error) => {
          console.error('Error fetching movie details:', error);
        });

    
    }
  }, [selectedMovieId]);
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
          setMovieLoading(false)
    

        
        })
        .catch((error) => {
          console.error('Error fetching collection:', error);
        });
    }
  }, [selectedCollectionId]);


  useEffect(() => {
    // Retrieve the user's token from localStorage (You need to implement this part)
    const token = localStorage.getItem('token');
    updateImgSrc("#fff")

    // Define the API endpoint to retrieve user's collections
    const apiUrl = 'collections'; // Update with your actual API endpoint

    // Make an authenticated GET request to fetch the user's collections
    axiosInstance
      .get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setCollections(response.data);
        console.log(response.data)
        // Default to the first collection if available
        if (response.data.length > 0) {
          setSelectedCollectionId(response.data[0]._id);
        }else{
          setNoCollection(true)
          setMovieLoading(false)
        }
      })
      .catch((error) => {
        console.error('Error fetching collections:', error);
      });
  }, []);

  const handleCollectionClick = (collectionId) => {
    setSelectedCollectionId(collectionId);
  };
  function findCollectionNameById(collections, idToFind) {
    for (let i = 0; i < collections.length; i++) {
      if (collections[i]._id === idToFind) {
        return collections[i].name;
      }
    }
    // Return null or some other value to indicate that the collection was not found.
    return null;
  }
  

  return (

 noCollection?<div className='noc' style={{width:"auto",minWidth:"100vw",height:"auto",minHeight:"100vh", display:"flex",alignItems:"center",justifyContent:"center"}}><CollectionDialog collection={collections} setCollection={setCollections} setNoCollection={setNoCollection}/></div>:(movieLoading? <div style={{width:"auto",minWidth:"100vw",height:"auto",minHeight:"100vh", display:"flex",alignItems:"center",justifyContent:"center"}}><LoadingGif/></div>:<div className={`background-image`} style={{ backgroundImage: ` url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}>
    <div className='fullHeight'>
    <div className="user-collection-page">
      <Navbar imgSrc={imgSrc}/>
    <div className="left-navigation-bar">
      <h2>Collections</h2>
   <div className='colcontrol'>  <select
        value={selectedCollectionId || ''}
        onChange={(e) => handleCollectionClick(e.target.value)}
      >
        <option value="">Select a collection</option>
        {collections.map((collection) => (
          <option key={collection._id} value={collection._id}>
            {collection.name}
          </option>
        ))}
      </select>
     <CollectionDialog collection={collections} setCollection={setCollections} setNoCollection={setNoCollection}/>
      </div> 
    </div>
    <MovieListSidebar
        title={findCollectionNameById(collections,selectedCollectionId)}
        selectedCollectionId={selectedCollectionId}
        setSelectedMovieId={setSelectedMovieId}
        selectedMovieId={selectedMovieId}
      />
      {selectedMovieId!=0&&<MovieDetails selectedMovieId={selectedMovieId}  />}

    
      
    
    
    </div>

    </div>
    </div>
  ));
};

export default UserCollection;
