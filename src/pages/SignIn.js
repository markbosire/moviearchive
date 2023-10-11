import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import mySvg from "../logo2.svg";
import MuiAlert from '@mui/material/Alert';
import "../App.css"

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SignIn = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [success,setSuccess] = useState(true)

  const handleClick = async (e) => {
    e.preventDefault();

  
    // Send request to API
    const response = await fetch('https://weak-jade-salmon-ring.cyclic.app/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      localStorage.setItem('token', data.token);
      console.log(response)
      setMessage('Sign in successful!');
      setSuccess(true)
      setOpen(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      console.log(response)
      setSuccess(false)
      setMessage(`Sign in failed because of ${data.error}`);
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div className='signIn-div'>
    <div className='signIn-container'>
      <img className='sigIn-logo' src={mySvg}></img>
      <div className='username-Field'>
       <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
        </div>
        <div className='password-Field'>
          
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            </div>
          
      <div className='signInbutton' onClick={handleClick}>Sign In</div>
     
      <Link className='a' href="/signup">Don't have an account? Sign Up</Link>
    </div>
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <div>
    <Alert onClose={handleClose} severity={success?"success":"error"}>
      {message}
    </Alert>
  </div>
      </Snackbar>
    </div>
  );
};


export default SignIn;
