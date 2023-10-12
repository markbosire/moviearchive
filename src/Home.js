import React, { useState, useEffect } from 'react';

import mySvg from "./logo.svg";
import one from  "./1.svg"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useLocation } from "wouter";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Dialog from '@mui/material/Dialog';
import Navbar from './components/Navbar';

import DialogContent from '@mui/material/DialogContent';
import MovieContainer from './components/movieContainer';
import CollectionDialog from './components/collectionDialog';
import MovieReviewDialog from './components/movieReviewDialog';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';

import "./App.css";

const Home = () => {
  const token = localStorage.getItem('token');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [collectionOpen,setCollectionOpen]= useState(false)
  const [isopen, setOpen] = React.useState(false);
  const [selectedGenre, setSelectedGenre] = useState(27);
  const [displayedGenre,setDisplayedGenre] =useState(27);

  const handleGenreChange = (e) => {
   
    setSelectedGenre(e.target.value);
    console.log(e.target.value)
    setDisplayedGenre(e.target.value)
    
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

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

  const[signedIn,setSignedIn] =useState(false)
  const [colors,setColors] =useState([])
  const [imgSrc, setImgSrc] = useState("");
  const [imgSrc1, setImgSrc1] = useState("");
  const [imgSrc2, setImgSrc2] = useState("");
  const [oneSrc,setOneSrc]= useState("");
  const [movies, setMovies] = useState([]);
  const [movieIndex, setMovieIndex] = useState(0);
  const [era, setEra] = useState('1980s');
  const [month, setMonth] = useState('10');
  const [location, navigate] = useLocation();

  const [day, setDay] = useState('12');
  const [selectedRatingRange, setSelectedRatingRange] = useState('all'); // Initialize with 'all'
  const [backgroundImage, setBackgroundImage] = useState([]);
  const [movieLoading,setMovieLoading]=useState(true)


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
  const handleCollection=()=>{};
  const handleReviews=()=>{};
  const updateImgSrc = async (color,index,svg) => {
    const response = await fetch(svg);
    const text = await response.text();
    const coloredText = text.replace('fill="#000000"', `fill="${color}"`);
    const base64 = btoa(coloredText);
    if(svg===mySvg){
   index===1?setImgSrc(`data:image/svg+xml;base64,${base64}`):index===2?setImgSrc1(`data:image/svg+xml;base64,${base64}`):setImgSrc2(`data:image/svg+xml;base64,${base64}`);
    }
    if(svg===one){
      setOneSrc(`data:image/svg+xml;base64,${base64}`)
    }
  };

  


  useEffect(() => {
    setMovieLoading(true)
    fetchMovies();


  }, []);
  const getRatingFilter = (selectedRatingRange) => {
  switch (selectedRatingRange) {
    case 'below5':
      return 'vote_average.lte=5';
    case 'above5':
      return 'vote_average.gte=5';
    case 'above7':
      return 'vote_average.gte=7';
    case '10':
      return 'vote_average.gte=10';
    default:
      return ''; // If 'all' or an invalid option is selected, don't include a rating filter
  }
};


  const fetchMovies = async () => {
    let eraStart;
    let eraEnd;
    
    switch (era) {
      case '1900':
        eraStart = '1900-01-01';
        eraEnd = '1909-12-31';
        break;
      case '1910s':
        eraStart = '1910-01-01';
        eraEnd = '1919-12-31';
        break;
      case '1920s':
        eraStart = '1920-01-01';
        eraEnd = '1929-12-31';
        break;
      case '1930s':
        eraStart = '1930-01-01';
        eraEnd = '1939-12-31';
        break;
      case '1940s':
        eraStart = '1940-01-01';
        eraEnd = '1949-12-31';
        break;
      case '1950s':
        eraStart = '1950-01-01';
        eraEnd = '1959-12-31';
        break;
      case '1960s':
        eraStart = '1960-01-01';
        eraEnd = '1969-12-31';
        break;
      case '1970s':
        eraStart = '1970-01-01';
        eraEnd = '1979-12-31';
        break;
      case '1980s':
        eraStart = '1980-01-01';
        eraEnd = '1989-12-31';
        break;
      case '1990s':
        eraStart = '1990-01-01';
        eraEnd = '1999-12-31';
        break;
      case '2000s':
        eraStart = '2000-01-01';
        eraEnd = '2009-12-31';
        break;
      case '2010s':
        eraStart = '2010-01-01';
        eraEnd = '2019-12-31';
        break;
      case '2020s':
        eraStart = '2020-01-01';
        eraEnd = new Date().toISOString().split('T')[0]; // Set eraEnd to the current date
        break;
      default:
        
        // Handle default case or show an error message
        break;
    }
    
  
    let collectedMovies = [];
    let page = 1;
  
    while (collectedMovies.length < 3) {
      try {
       
  
       const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=7bbc16b08ec7ccb42b7d7b4c5b289bdf&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&primary_release_date.gte=${eraStart}&primary_release_date.lte=${eraEnd}&${getRatingFilter(selectedRatingRange)}&with_genres=${selectedGenre}`);

        if (!response.ok) {
          // Handle API error here, you can log an error message or throw an exception
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        let filteredMovies = data.results.filter(movie => {
          let releaseDate = new Date(movie.release_date);
          return releaseDate.getMonth() + 1 === parseInt(month) && releaseDate.getDate() === parseInt(day) && movie.backdrop_path && movie.poster_path;
        });
  
        collectedMovies = collectedMovies.concat(filteredMovies);
  
        if (collectedMovies.length < 3) {
          page++;
          // If we still have fewer than 3 movies, continue the loop
          continue;
        }
  
        // If we have collected 3 or more movies, stop the loop and set the state
      // Inside fetchMovies
// After setting the movies state, set the background image
let tempColors=[]
let tempurls=[]
if(collectedMovies.length===3){
  const imageUrl= `https://image.tmdb.org/t/p/w500${collectedMovies[0].poster_path}`
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
console.log(1)
const getdata = await getresponse.json();
tempColors.push(getdata.dominantColor);
updateImgSrc(getdata.dominantColor,1,mySvg)
updateImgSrc(getdata.dominantColor,0,one)
const imageUrl1= `https://image.tmdb.org/t/p/w500${collectedMovies[1].poster_path}`
const getresponse1 = await fetch('https://imageapi-ten.vercel.app/getDominantColor', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({"imageUrl":imageUrl1 }),
});

if (!getresponse1.ok) {
  throw new Error('Network response was not ok for color');
}
console.log(2)
const getdata1 = await getresponse1.json();
tempColors.push(getdata1.dominantColor);
updateImgSrc(getdata1.dominantColor,2,mySvg)

const imageUrl2= `https://image.tmdb.org/t/p/w500${collectedMovies[2].poster_path}`
const getresponse2 = await fetch('https://imageapi-ten.vercel.app/getDominantColor', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({"imageUrl":imageUrl2 }),
});

if (!getresponse2.ok) {
  throw new Error('Network response was not ok for color');
}
console.log(3)
const getdata2= await getresponse2.json();
tempColors.push(getdata2.dominantColor);
updateImgSrc(getdata2.dominantColor,3,mySvg)
setColors(tempColors)

setMovies(collectedMovies.slice(0, 3));
console.log(collectedMovies)
for(let i=0;i<3;i++){
  tempurls.push(`https://image.tmdb.org/t/p/original${collectedMovies[i].backdrop_path}`)

}
console.log(tempurls)
setBackgroundImage(tempurls);

setMovieLoading(false)
console.log(movies)
}



       
      } catch (error) {
        // Handle any errors that occur during the fetch process
        console.error(error);
  
       
       
           continue;
        // Retry after 1 second (adjust as needed)
      }
    }
  };
  
  function getDaysInMonth(month) {
    const month31 = ['01', '03', '05', '07', '08', '10', '12'];
    const month30 = ['04', '06', '09', '11'];
    const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const currentYear = new Date().getFullYear();
  
    if (month === '02') {
      return isLeapYear(currentYear) ? 29 : 28;
    } else if (month31.includes(month)) {
      return 31;
    } else if (month30.includes(month)) {
      return 30;
    } else {
      return 31; // Default to 31 days if the month is not recognized.
    }
  }
  function renderNavigation(){
    return(
    <div className='bottomNavigation'><div className='movieSelector arrows'>
    <div style={movieIndex===0?{border:`1px solid ${colors[0]}`}:{}} onClick={() => setMovieIndex(0)}><p>1</p></div>
    <div style={movieIndex===1?{border:`1px solid ${colors[1]}`}:{}} onClick={() => setMovieIndex(1)}><p>2</p></div>
    <div style={movieIndex===2?{border:`1px solid ${colors[2]}`}:{}} onClick={() => setMovieIndex(2)}><p>3 </p></div>
  </div></div>)
  }
 
  return (
    <React.Fragment>
  
    

      <Dialog
        open={isopen}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
      
        <DialogContent className='bgb'>
        <div className='selectors fs' style={{flexDirection:"column"}}>
      <div className="dropdown-container">
        <label htmlFor="era">Era</label>
        <select id="era" value={era} onChange={(e) => setEra(e.target.value)}>
           <option value="1900s">1900s</option>
  <option value="1910s">1910s</option>
  <option value="1920s">1920s</option>
  <option value="1930s">1930s</option>
  <option value="1940s">1940s</option>
  <option value="1950s">1950s</option>
  <option value="1960s">1960s</option>
  <option value="1970s">1970s</option>
  <option value="1980s">1980s</option>
  <option value="1990s">1990s</option>
  <option value="2000s">2000s</option>
  <option value="2010s">2010s</option>
  <option value="2020s">2020s</option>
        </select>
      </div>
      <div className="dropdown-container">
  <label htmlFor="month">Month</label>
  <select id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
    <option value="01">January</option>
    <option value="02">February</option>
    <option value="03">March</option>
    <option value="04">April</option>
    <option value="05">May</option>
    <option value="06">June</option>
    <option value="07">July</option>
    <option value="08">August</option>
    <option value="09">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>
  </select>
</div>

<div className="dropdown-container">
  <label htmlFor="day">Day</label>
  <select id="day" value={day} onChange={(e) => setDay(e.target.value)}>
    {Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1).map((dayOption) => (
      <option key={dayOption} value={dayOption}>
        {dayOption}
      </option>
    ))}
  </select>
</div>
<div className='dropdown-container'>
      <label>Select a Genre</label>
      <select value={selectedGenre} onChange={handleGenreChange}>
       
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
     
    </div>
<div className="dropdown-container">
  <label htmlFor="rating">Rating</label>
  <select id="rating" value={selectedRatingRange} onChange={(e) => setSelectedRatingRange(e.target.value)}>
    <option value="all">All</option>
    <option value="below5">Below 5</option>
    <option value="above5">Above 5</option>
    <option value="above7">Above 7</option>
    <option value="10">10</option>
  </select>
</div>
<div className='movie-trailer' style={{backgroundColor:"#fff",color:"#000",justifyContent:"center",alignItems:"center",display:"flex"}} onClick={()=>{
  setMovieLoading(true)
  fetchMovies()
  handleClickClose()
}}>Done</div>
</div>
         
        </DialogContent>
     
      </Dialog>
   
   
    <div className={`background-image ${movies.length > 0 ? '' : 'st'}`} style={{ backgroundImage: ` url(${backgroundImage[movieIndex]})` }}>
    
    {movies.length>0?
      <div className='fullHeight'>
        <Navbar movieIndex={movieIndex} imgSrc={imgSrc} imgSrc1={imgSrc1} imgSrc2={imgSrc2} />
  
<div className='smallScreen'>
        <div className='selectors'>
      <div className="dropdown-container">
        <label htmlFor="era">Era</label>
        <select id="era" value={era} onChange={(e) => setEra(e.target.value)}>
        <option value="1900s">1900s</option>
  <option value="1910s">1910s</option>
  <option value="1920s">1920s</option>
  <option value="1930s">1930s</option>
  <option value="1940s">1940s</option>
  <option value="1950s">1950s</option>
  <option value="1960s">1960s</option>
  <option value="1970s">1970s</option>
  <option value="1980s">1980s</option>
  <option value="1990s">1990s</option>
  <option value="2000s">2000s</option>
  <option value="2010s">2010s</option>
  <option value="2020s">2020s</option>
        </select>
      </div>
      <div className="dropdown-container">
  <label htmlFor="month">Month</label>
  <select id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
    <option value="01">January</option>
    <option value="02">February</option>
    <option value="03">March</option>
    <option value="04">April</option>
    <option value="05">May</option>
    <option value="06">June</option>
    <option value="07">July</option>
    <option value="08">August</option>
    <option value="09">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>
  </select>
</div>

<div className="dropdown-container">
  <label htmlFor="day">Day</label>
  <select id="day" value={day} onChange={(e) => setDay(e.target.value)}>
    {Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1).map((dayOption) => (
      <option key={dayOption} value={dayOption}>
        {dayOption}
      </option>
    ))}
  </select>
</div>
<div className='dropdown-container'>
      <label>Select a Genre</label>
      <select value={selectedGenre} onChange={handleGenreChange}>
       
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
     
    </div>
<div className="dropdown-container">
  <label htmlFor="rating">Rating</label>
  <select id="rating" value={selectedRatingRange} onChange={(e) => setSelectedRatingRange(e.target.value)}>
    <option value="all">All</option>
    <option value="below5">Below 5</option>
    <option value="above5">Above 5</option>
    <option value="above7">Above 7</option>
    <option value="10">10</option>
  </select>
</div>
</div>

<div className='movie-trailer' style={{color:"#fff", border: `1px solid #fff`, margin: "10px 0"}} onClick={()=>{
  setMovieLoading(true)
  fetchMovies()
  handleClickClose()
}}>Done</div>

<div className='movieSelector'>
  <div style={movieIndex===0?{border:`1px solid ${colors[0]}`}:{}} onClick={() => setMovieIndex(0)}><p>1</p></div>
  <div style={movieIndex===1?{border:`1px solid ${colors[1]}`}:{}} onClick={() => setMovieIndex(1)}><p>2</p></div>
  <div style={movieIndex===2?{border:`1px solid ${colors[2]}`}:{}} onClick={() => setMovieIndex(2)}><p>3 </p></div>
</div>
</div>


     
{movieLoading?<div className='loading'><div className="loadingio-spinner-dual-ball-8b5q70g0vmv"><div className="ldio-67vo9x8f3d">
<div></div><div></div><div></div>
</div></div></div>:<div className='containment'><MovieContainer token={token} movies={movies} genreName={getGenreName(displayedGenre)}
          backgroundColor={colors[movieIndex]}
          onSearchTrailer={handleSearchTrailer} handleClickOpen={handleClickOpen} Navigation={renderNavigation} colors={colors} movieIndex={movieIndex} /></div>}
      
    </div>:<div className="loadingio-spinner-dual-ball-8b5q70g0vmv"><div className="ldio-67vo9x8f3d">
<div></div><div></div><div></div>
</div></div>

}</div>
</React.Fragment>
 )
};

export default Home;
