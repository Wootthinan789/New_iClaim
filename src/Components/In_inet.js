import React, { useState, useEffect } from 'react';
import './Style/In_inet.css'
import axios from "axios";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
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

const Ininet = () => {

    const [anchorElUser, setAnchorElUser] = useState(null);

    const usernameJson = JSON.parse(localStorage.getItem('username'));

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
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


    const handleDashboardInternalClick = () => {
        navigate('/Dashboard/Internal')
        window.location.reload();
    };

    const handleDashboardExternalClick = () => {
        navigate('/Dashboard/External')
        window.location.reload();
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleEdithospitalClick = () => {
        navigate('/Edit/Hospital')
        window.location.reload();
    };

    const handleLogClick = () => {
        navigate('/Log')
    };
    const handleInternaliNetClick = () => {
        navigate('/Internal/inet')
        window.location.reload();
    }
    const handleSetPermissions = () => {
        navigate('/Set/Permission')
        window.location.reload();
    }

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
                                    <Typography variant="body1" style={{ fontSize: isSmallScreen ? '8px' : '16px', fontWeight: 'bold', fontFamily: "'Kanit', sans-serif" }}>
                                        {usernameJson.username}
                                    </Typography>
                                    <KeyboardArrowDownIcon />
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
                            {['กำหนดสิทธิ์','แก้ไขโรงพยาบาล' , 'Log','Internal INET', 'ออกจากระบบ'].map((setting) => (
                                <MenuItem key={setting} style={{ padding: isSmallScreen ? '0 5px' : '5px 12px' }} onClick={setting === 'ออกจากระบบ' ? handleLogout : setting === 'แก้ไขโรงพยาบาล' ? handleEdithospitalClick :setting === 'กำหนดสิทธิ์' ? handleSetPermissions : setting === 'Log' ? handleLogClick : setting === 'Internal INET' ? handleInternaliNetClick : null}>
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
                <div className='Fixlocation'>
                    <button className="Dashboard-Internal-button" onClick={handleDashboardInternalClick} style={{lineHeight: '1'}}>Dashboard Internal</button>
                </div>
                <div className='Fixlocation'>
                    <button className="Dashboard-Internal-button" onClick={handleDashboardExternalClick} style={{lineHeight: '1'}} >Dashboard External</button>
                </div>
            </div>
            <Card className='cardStyle_Log' style={{ backgroundColor: '#D9D9D9', boxShadow: 'none', borderRadius: '15px' }}>
                    <CardContent>
                    <div className='Title-inet'>Report กลุ่มผู้บริหาร</div>
                    <div className='Title2-inet'>สามารถตรวจสอบ Report ได้ที่กลุ่ม Line : Dashboard iClaim OD</div>
                    <div className='container-approve-reject-inet'>
                        <div className='Fixlocation-approve-reject-inet'>
                            <button className="button-Approve-inet">Approve</button>
                        </div>
                        <div className='Fixlocation-approve-reject-inet'>
                            <button className="button-Reject-inet">Reject</button>
                        </div>
                    </div>
                    </CardContent>
            </Card>

        </div>
    );
};

export default Ininet;