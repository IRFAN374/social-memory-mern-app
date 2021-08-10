import React,{useState} from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { GoogleLogin } from 'react-google-login';
import Icon from './icon';

import { AUTH } from '../../constants/actionTypes';

import useStyles from './authStyles';
import Input from './Input';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { signin, signup } from '../../actions/auth';

const initialState={ firstName: '', lastName:'', email:'', password:'', confirmPassword: '' };
// const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const classes = useStyles();
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    // form submit handler
    const handleSubmit=(event)=>{
        event.preventDefault();
        if (isSignup) {
            console.log("event",form)
            dispatch(signup(form, history));
          } else {
            dispatch(signin(form, history));
          }
    }

    // end of form submit handler
  
    // form input change handler
    const handleChange = (event)=>{
       setForm({
           ...form,
           [event.target.name]:event.target.value
       })
    }
  // end of input submit handler


  // start of switch mode
    const switchMode=()=>{
        setForm(initialState);
        setIsSignup((prevIsSignup)=>!prevIsSignup);
        setShowPassword(false);
    }
    // end of switched mode
    
    // passwrod handler
    const handleShowPassword = ()=>{
        setShowPassword((prevShowPassword)=>!prevShowPassword);
    }
   // end of passwrod

   const googleSuccess =async (res)=>{
     console.log(res);
     const result = res?.profileObj;
     const token = res?.tokenId;
     try {
         dispatch({
             type:AUTH,
             data:{
                 result,
                 token
             }
         });
         history.push('/');
     } catch (error) {
         console.log(error);
     }

   }
   const googleError =()=>{
       alert("Google Sign In was unsuccessful. Try again later")
   }
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                   <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">{ isSignup ? 'Sign up' : 'Sign in' }</Typography>
                
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        { isSignup && (
                            <>
                               <Input name="firstName"  label="First Name" handleChange={handleChange} autoFocus half />
                               <Input name="lastName" label="Last Name" handleChange={handleChange} half /> 
                            </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        { isSignup ? 'Sign Up' : 'Sign In' }
                    </Button>

                    <GoogleLogin
                       clientId="841567038039-9clq1abgmkk34cf094ad6fr7olas4oms.apps.googleusercontent.com"
                       render={(renderProps)=>(
                           <Button 
                           className={classes.googleButton} 
                           color="primary" 
                           fullWidth 
                           onClick={renderProps.onClick} 
                           disabled={renderProps.disabled} 
                           startIcon={<Icon/>} 
                           variant="contained" >
                               Google Sign In
                           </Button>
                       )}
                       onSuccess={googleSuccess}
                       onFailure={googleError}
                       cookiePolicy="single_host_origin"
                    />

                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
                            </Button>
                        </Grid>
                    </Grid>

                </form>
            </Paper>
        </Container>    
    );
};

export default Auth;