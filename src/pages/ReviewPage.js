import React, { useState, useEffect,useMemo} from 'react';
import mySvg from "../logo.svg";
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Container, TextField, Rating, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material';
import MovieSearchDialog from '../components/MovieSearchDialog';


const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('newest');
  const authToken = localStorage.getItem("token");
 
  const [imgSrc, setImgSrc] = useState("");
  
  useEffect(()=>{
    !authToken&& (window.location.href = '/signup')
  },[])

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const fontSize = matches ? '14px' : '16px';
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
  const updateImgSrc = async (color) => {
    const response = await fetch(mySvg);
    const text = await response.text();
    const coloredText = text.replace('fill="#000000"', `fill="${color}"`);
    const base64 = btoa(coloredText);
   
   setImgSrc(`data:image/svg+xml;base64,${base64}`);
    }
    useEffect(()=>{
      updateImgSrc("#fff")
    },[])

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('https://movieappapi.vercel.app/reviews', {
      headers: { Authorization: `${token}` }
    })
    .then(response => {
      setReviews(response.data);
      return response.data;
    })
    .then(data => {
      const movieIds = [...new Set(data.map(review => review.movieId))];
      return Promise.all(movieIds.map(id =>
        axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=7bbc16b08ec7ccb42b7d7b4c5b289bdf`)
      ));
    })
    .then(responses => {
      const movieData = responses.reduce((acc, res) => ({ ...acc, [res.data.id]: res.data.title }), {});
      setMovies(movieData);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }, []);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleSort = type => {
    setSortType(type);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortType) {
      case 'oldest': return new Date(a.date) - new Date(b.date);
      case 'newest': return new Date(b.date) - new Date(a.date);
      case 'highest': return b.score - a.score;
      case 'lowest': return a.score - b.score;
      default: return 0;
    }
  });

  const filteredReviews = sortedReviews.filter(review =>
    review.content.toLowerCase().includes(searchTerm.toLowerCase()) || movies[review.movieId].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <React.Fragment>
      <Navbar imgSrc={imgSrc}/>
    <Container maxWidth="md" sx={{ backgroundColor: '#222', color: '#fff', padding: matches ? '1em' : '2em',fontSize: fontSize }}>
         
     <div className="search-container" style={{ display: 'flex', gap:"10px", margin: '1em 0' }}>
  <SearchTextField style={{width:"70%"}}  className="search-field" placeholder='Search Review or Movie Name' variant="outlined" onChange={handleSearch} />
<MovieSearchDialog reviews={reviews} setReviews={setReviews} />
     </div> 
      <div style={{ display: 'flex', gap:"10px", margin: '1em 0' }}>
      <div style={{ border: '1px solid #fff', borderRadius: '5px', padding: '0.5em', cursor: 'pointer' }} onClick={() => handleSort('all')}>All</div>
        <div style={{ border: '1px solid #fff', borderRadius: '5px', padding: '0.5em', cursor: 'pointer' }} onClick={() => handleSort('oldest')}>Oldest</div>
        <div style={{ border: '1px solid #fff', borderRadius: '5px', padding: '0.5em', cursor: 'pointer' }} onClick={() => handleSort('newest')}>Newest</div>
        <div style={{ border: '1px solid #fff', borderRadius: '5px', padding: '0.5em', cursor: 'pointer' }} onClick={() => handleSort('highest')}>Highest</div>
        <div style={{ border: '1px solid #fff', borderRadius: '5px', padding: '0.5em', cursor: 'pointer' }} onClick={() => handleSort('lowest')}>Lowest</div>
      </div>
      {filteredReviews.map(review => (
        <Box key={review._id} sx={{ margin: '1em 0' }}>
          <div>{new Date(review.date).toLocaleString()}</div>
          <Rating name="read-only" value={review.score} readOnly />
          <div style={{fontWeight:"900" ,color:"#dddddd"}}>{movies[review.movieId]}</div>
          <div className='reviewcontent'>{review.content}</div>
        </Box>
      ))}
    </Container>
    </React.Fragment>
  );
};

export default ReviewPage;
