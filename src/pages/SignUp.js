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

const SignUp = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [confirmpassword,setConfirmPassword] = useState('');
  const [success,setSuccess] = useState(true)


  const handleClick = async (e) => {
    e.preventDefault();
    if(password!=confirmpassword){
      setOpen(true)
      setSuccess(false)
        setMessage("The password entered is not the same as the confirmed password")
    }else{

  
    // Send request to API
    const response = await fetch('https://movieappapi.vercel.app/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
     setSuccess(true)
      setMessage('Sign up successful proceed to sign in!');
      setOpen(true);
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);
    } else {
      setSuccess(false)
      setMessage(`Sign up failed because of ${data.error}`);
      setOpen(true);
    }
}};

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
            <div className='password-Field'>
          
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              id="password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            </div>
            
          
      <div className='signInbutton' onClick={handleClick}>Sign Up</div>
     
      <Link className='a' href="/signin">Already have an account? Sign In</Link>
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


export default SignUp;
