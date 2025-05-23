import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import './Style/Signin.css';
import backgroundImg from './images-iclaim/blur-hospital.jpg';
import iconiclaim from './images-iclaim/download (2).png';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${backgroundImg})`,
  },
  paper: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.spacing(1),
    width: '100%',
    maxWidth: 400
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: 15,
  }
}));

async function loginUser(credentials) {
  const { username, password } = credentials;
  const clientId = '1117';
  const secretKey = 'iFQYwseyMH68yu3nqYsNnUNxZ9Ciefc7a3tfSeAt';
  
  const body = {
    grant_type: "password",
    username,
    password,
    client_id: clientId,
    client_secret: secretKey
  };

  return fetch('https://one.th/api/oauth/getpwd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(data => data.json())
 }

const Signin = () => {
  const classes = useStyles();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await loginUser({
      username,
      password,
      "expiresIn": 60000
    });
    // console.log(response)
    if ('access_token' in response) {
      swal({
        text: 'Login Success',
        icon: 'success',
        buttons: false,
        timer: 2000,
      })
      .then((value) => {
        localStorage.setItem('access_token', response['access_token']);
        localStorage.setItem('account_id', response['account_id']);
        localStorage.setItem('user_role', response['username']);
        localStorage.setItem('username', JSON.stringify(response));

      const usernameRole = localStorage.getItem('user_role');
      // Call the role user API
    //   fetch(`http://localhost:443/Role-user?username_role=${usernameRole }`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    // })
    fetch(`https://rpa-apiprd.inet.co.th:443/Role-user?username_role=${usernameRole }`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(data => data.json())
    .then(result => {

      const roles = result.map(entry => entry.role);
      localStorage.setItem('role', roles[0]);
      window.location.href = "/Dashboard/External";
    })
    .catch(error => {
      localStorage.setItem('role', 'viewer');
      window.location.href = "/Dashboard/External";
    });
  
      });
    } else {
      swal({
        text: 'Login Fail!!',
        icon: 'error',
        buttons: false,
        timer:2000
      });
    }
  }

    return (
      <Grid container component="main" className='root'>
        <CssBaseline />
        <Grid item xs={12} className='image' style={{ backgroundImage: `url(${backgroundImg})` }}>
          <Grid container component={Paper} elevation={2} square className='paper'>
            <div className='logo'>
              <img src={iconiclaim} alt="iClaim" className='icon' />
              <Typography component="h1" variant="h6" style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: "'Kanit', sans-serif" }}>
                สรุปยอดเคลมประกันผ่าน iClaim
              </Typography>
            </div>
            <Typography component="h1" variant="h6" style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '10px' , fontFamily: "'Kanit', sans-serif" }}>
              เข้าสู่ระบบ
            </Typography>
          <form className='form' noValidate onSubmit={handleSubmit} style={{fontFamily: "'Kanit', sans-serif"}}>
            บัญชีผู้ใช้
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              placeholder="Enter your email"
              size="small"
              onChange={e => setUserName(e.target.value)}
              InputProps={{ style: { borderRadius: 15 } }}
              InputLabelProps={{ style: { marginLeft: 10 } }}
            />
              รหัสผ่าน
            <TextField
              variant="outlined"
              required
              margin="normal"
              fullWidth
              id="password"
              name="password"
              type="password"
              size="small"
              placeholder="Enter your password"
              onChange={e => setPassword(e.target.value)}
              InputProps={{ style: { borderRadius: 15 } }}
              InputLabelProps={{ style: { marginLeft: 10 } }}
            />
            <Button
              style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginTop: '20px',
                  fontFamily: "'Kanit', sans-serif",
                  width: '50%',
                  padding: '5px',
                  marginLeft: '85px',
                  marginRight: 'auto',
              }}
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              disableElevation
            >
              Sign In
            </Button>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default Signin;