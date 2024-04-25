import React, { useState,useEffect } from 'react';
import './Style/Log.css'
import './Style/Set_Permissions.css'
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import AppBar from '@mui/material/AppBar';
import Button from '@material-ui/core/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import swal from 'sweetalert';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useMediaQuery, useTheme } from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import logo from './images-iclaim/download (2).png';
import employee from './images-iclaim/employee.png'
import HomeIcon from './images-iclaim/home-regular-60.png';
import { useNavigate } from 'react-router-dom';

const Set_Permissions = () => {

    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Username:', username);
        console.log('Role:', role);
    
        const data = {
            username: username,
            role: role
        };
        axios.post('http://localhost:443/Role-user/insert', data)
        .then(response => {
            console.log(response.data);
            const delayInMilliseconds = 1500;
            // ทำสิ่งที่ต้องการเมื่อสำเร็จ เช่น รีเซ็ตค่าหรือ redirect
            setUsername(''); // ล้างค่า username
            setRole(''); // ล้างค่า role
            swal({
                text: 'Success',
                icon: 'success',
                buttons: false,
                timer: 2000,
              })
              setTimeout(() => {
                window.location.reload();
              }, delayInMilliseconds);
        })
        .catch(error => {
            console.error(error);
            // ทำสิ่งที่ต้องการเมื่อเกิดข้อผิดพลาด เช่น แสดงข้อความผิดพลาด
        });
    };
    
    

    const [anchorElUser, setAnchorElUser] = useState(null);
    const usernameJson = JSON.parse(localStorage.getItem('username'));
    // const role_user = localStorage.getItem("role")

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();


    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleLogClick = () => {
        navigate('/Log')
      }

    const handleEdithospitalClick = () => {
        navigate('/Edit/Hospital')
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        localStorage.removeItem("account_id")
        localStorage.removeItem("user_role")
        localStorage.removeItem("role")
        window.location.href = "/";
    };

         // Function to handle log out after 10 minutes of inactivity
  useEffect(() => {
    let lastActivityTime = new Date().getTime();

    const checkInactivity = () => {
      const currentTime = new Date().getTime();
      const inactiveTime = currentTime - lastActivityTime;
      const twoMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds

      if (inactiveTime > twoMinutes) {
        // Log out if inactive for more than 10 minutes
        handleLogout();
      }
    };

    const handleActivity = () => {
      lastActivityTime = new Date().getTime();
    };

    const activityInterval = setInterval(checkInactivity, 60000); // Check every minute for inactivity

    // Listen for user activity events
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      clearInterval(activityInterval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

    const handleReload = () => {
        navigate('/Dashboard/External')
    };

    return (
        <div className='containerStype'>
            <AppBar position="static" className='appBarStyle' style={{ backgroundColor: 'white', boxShadow: 'none', }}>
                <Toolbar>
                    <Box className='BoxStyle'>
                        <img src={logo} alt="Logo" className='logoStyle' />
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box className='Box1'>
                        <Tooltip>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Box className='Box2'>
                                    <Avatar
                                        alt="employee.png"
                                        src={employee}
                                        className='Avatar-img'
                                    />
                                    <Typography variant="body1" style={{ fontSize: isSmallScreen ? '8px' : '16px', fontWeight: 'bold', fontFamily: "'Kanit', sans-serif",color:'rgba(0, 0, 0, 0.54)' }}>
                                        {usernameJson.username}
                                    </Typography>
                                    <KeyboardArrowDownIcon style={{color:'rgba(0, 0, 0, 0.54)'}} />
                                </Box>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            className='Menu-list'
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            PaperProps={{
                                style: {

                                    maxHeight: isSmallScreen ? '' : '200px',
                                    width: isSmallScreen ? '108px' : '150px',
                                },
                            }}
                        >
                            {['กำหนดสิทธิ์', 'แก้ไขโรงพยาบาล', 'Log', 'ออกจากระบบ'].map((setting) => (
                                <MenuItem key={setting} style={{ padding: isSmallScreen ? '0 5px' : '8px 12px' }} onClick={setting === 'ออกจากระบบ' ? handleLogout : setting === 'แก้ไขโรงพยาบาล' ? handleEdithospitalClick : setting === 'Log' ? handleLogClick : null}>
                                    <Typography style={{ fontFamily: "'Kanit', sans-serif", padding: isSmallScreen ? '0 12px' : '0 10px', fontSize: isSmallScreen ? '12px' : '16px', margin: isSmallScreen ? '1px 0' : '0 0' }}>
                                        {setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <div className='container'>
                <div className='Fixlocation'>
                    <button onClick={handleReload}>
                        <img src={HomeIcon} alt="HomeIcon" className='homeicon' />
                    </button>
                </div>
            </div>
            <Card className='cardStyle_Set_Permissons' style={{ backgroundColor: '#D9D9D9', boxShadow: 'none', borderRadius: '15px' }}>
                    <CardContent>
                        <div className='Text_SetPermissons'>
                        <h1 style={{ fontFamily: "'Kanit', sans-serif" }}>กำหนดสิทธิ์</h1>
                        </div>
                        <form className='form-set' onSubmit={handleSubmit}>
                            กรอก username
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="Username"
                            name="Username"
                            placeholder="Enter your Username"
                            size="small"
                            InputProps={{ style: { borderRadius: 15, fontSize: isSmallScreen ? '8px' : '16px' } }}
                            InputLabelProps={{ style: { marginLeft: 10 } }}
                            onChange={(e) => setUsername(e.target.value)}
                            />
                            กรอกสิทธิ์
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="Role"
                            name="Role"
                            placeholder="Enter your Role"
                            size="small"
                            InputProps={{ style: { borderRadius: 15, fontSize: isSmallScreen ? '8px' : '16px' } }}
                            InputLabelProps={{ style: { marginLeft: 10 } }}
                            onChange={(e) => setRole(e.target.value)}
                            />
                            <div  className='text-role' style={{ lineHeight: '0.2' }}>
                            <p>
                                * สิทธิ์ที่สามารถกรอกได้ *
                            </p>
                            <p className='p-style'> - admin = ไม่จำกัดในการเข้าถึงหน้าเว็บไซต์ </p>
                            <p className='p-style'> - user = มีข้อจำกัดในการเข้าถึงหน้าเว็บไซต์ </p>
                            </div>
                            <Button
                            style={{
                                fontSize: isSmallScreen ? '8px' : '16px',
                                fontWeight: 'bold',
                                marginTop: '20px',
                                fontFamily: "'Kanit', sans-serif",
                                width: '50%',
                                padding: '5px',
                                marginLeft: '25%',
                                marginRight: 'auto',
                                borderRadius: '15px',
                            }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            disableElevation
                            >
                            ตกลง
                            </Button>
                        </form>
                    </CardContent>
            </Card>

        </div>
    );
};

export default Set_Permissions;
