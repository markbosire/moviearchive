import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useLocation } from 'wouter';

export default function Navbar({ movieIndex, imgSrc, imgSrc1, imgSrc2 }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [location, navigate] = useLocation();
    const token = localStorage.getItem('token');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
    <div className='botnav'>
      <section>
        <div className='logo'>
          <img src={movieIndex?(movieIndex===0?imgSrc:movieIndex===1?imgSrc1:imgSrc2):imgSrc}></img>
        </div>
        {token
          ? <div>
              <div className='sm-menu'>
                <i class="fa fa-bars" aria-hidden="true" id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}></i>
              </div>
              <div className='bg-menu'>
              <span onClick={()=>{
                    window.location.href = '/';
                }}>Home</span>
                <span onClick={()=>{
                    window.location.href = '/collections';
                }}>Collections</span>
                <span onClick={()=>{
                    window.location.href = '/reviews';
                }}>Reviews</span>
                <span onClick={()=>{
                  localStorage.removeItem('token');
                  window.location.reload();
                }}>Logout</span>
              </div>
            </div>
          : <div className='movie-trailer sgn' style={{color:"#fff", padding: "5px 15px",border: `1px solid #fff`}} onClick={()=>{
              navigate("/signin")
            }}>
              <i class="fa fa-user sm" aria-hidden="true"></i>
              Sign In
            </div>}
      </section>
    </div>  
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
        <MenuItem onClick={()=>{
                    window.location.href = '/';
                }}>Home</MenuItem>
      <MenuItem onClick={()=>{
                    window.location.href = '/collections';
                }}>Collection</MenuItem>
      <MenuItem onClick={()=>{
                    window.location.href = '/reviews';
                }}>Reviews</MenuItem>
      <MenuItem onClick={()=>{
        localStorage.removeItem('token');
        window.location.reload();
      }}>Logout</MenuItem>
    </Menu> 
    </React.Fragment>
  );
}
