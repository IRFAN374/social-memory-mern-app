import React,{useEffect, useState} from 'react';
import {  AppBar, Typography,Toolbar,Button,Avatar} from '@material-ui/core';
import useStyles from './navStyles';
import memoriesLogo from '../../images/memoriesLogo.png';
import memoriesText from '../../images/memoriesText.png';

import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actionType from '../../constants/actionTypes';
import decode from 'jwt-decode';

const Navbar = () => {
    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const logout = () =>{
        dispatch({type:actionType.LOGOUT});
        history.push('/auth');
        setUser(null);
    }
    
    useEffect(() => {
        const token = user?.token;
    
        if (token) {
          const decodedToken = decode(token);
    
          if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }
    
        setUser(JSON.parse(localStorage.getItem('profile')));
      }, [location]);

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <Link to="/" className={classes.brandContainer} >
                {/* <Typography component={Link} to="/" className={classes.heading} variant="h2" align="center">Memories</Typography> */}
                <img className={classes.image} src={memoriesText} alt="icon" height="45px" />
                <img className={classes.image} src={memoriesLogo} alt="icon" height="40px" />
            </Link>
            <Toolbar className ={classes.toolbar}>
                {
                    user ? (
                        <div className={classes.profile}>
                            <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}> {user.result.name.charAt(0)} </Avatar> 
                            <Typography className={classes.userName} variant="h6"> {user.result.name} </Typography>
                            <Button className ={classes.logout} color="secondary" variant ="contained" onClick={logout} > LogOut </Button>
                        </div>
                    ):(
                        <Button component={Link} to="/auth" color="primary" variant ="contained" > SignIn </Button>
                    )
                }
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;