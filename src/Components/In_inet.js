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
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import employee from './images-iclaim/employee.png'
import HomeIcon from './images-iclaim/home-regular-60.png';
import { useNavigate } from 'react-router-dom';
import SuccessIcon from './images-iclaim/checked.png';
import swal from 'sweetalert';

const Ininet = () => {

    const [anchorElUser, setAnchorElUser] = useState(null);
    const [notification, setNotification] = useState({ message: '', show: false });
    const [darkBackground, setDarkBackground] = useState(false);
    const usernameJson = JSON.parse(localStorage.getItem('username'));
    const [openModal, setOpenModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const handleApproveButtonClick = async () => {
        setNotification(swal({
            text: 'ส่ง report Success',
            icon: 'success',
            buttons: false,
            show: true
        }));
        setDarkBackground(true);

        try {
            //await axios.post("http://203.154.39.190:5000/rpa/iclaim/send-image/Internal")
            await axios.post("https://rpa-apiprd.inet.co.th:443/rpa/iclaim/sendImageInternal")
        } catch (error) {
            console.error('Error:', error.message);
        }

        // Clear selected checkboxes and hide notification after 2.5 seconds
        setTimeout(() => {
        }, 2500);
        setTimeout(() => {
            window.location.reload(); // Reload the page
        }, 2500);
    };

    const handleRejectButtonClick = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setRejectReason('');
        setOpenModal(false);
    };

    const handleRejectConfirm = async () => {
        console.log(rejectReason)
        const data = {
            message: rejectReason,
        };
        try {
            // await axios.post("http://203.154.39.190:5000/rpa/iclaim/reject-image/Internal", data);
            await axios.post("https://rpa-apiprd.inet.co.th:443/rpa/iclaim/RejectImageInternal", data);
            setRejectReason(''); // Clear the textarea
        } catch (error) {
            console.error('Error:', error.message);
        }
        setOpenModal(false);
    };

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

    const handleHospitalNews = () => {
        navigate('/Hospital/News')
        window.location.reload();
      }

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
        localStorage.removeItem("account_id");
        localStorage.removeItem("user_role");
        localStorage.removeItem("role");
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
                                    maxHeight: isSmallScreen ? '' : 'auto',
                                    width: isSmallScreen ? '108px' : '155px',
                                },
                            }}
                        >
                            {['กำหนดสิทธิ์', 'แก้ไขโรงพยาบาล', 'Log', 'Internal INET','ข่าวสารโรงพยาบาล', 'ออกจากระบบ'].map((setting) => (
                                <MenuItem key={setting} style={{ padding: isSmallScreen ? '0 5px' : '5px 5px' }} onClick={setting === 'ออกจากระบบ' ? handleLogout : setting === 'แก้ไขโรงพยาบาล' ? handleEdithospitalClick : setting === 'กำหนดสิทธิ์' ? handleSetPermissions : setting === 'Log' ? handleLogClick : setting === 'Internal INET' ? handleInternaliNetClick : setting === 'ข่าวสารโรงพยาบาล' ? handleHospitalNews : null}>
                                    <Typography style={{ fontFamily: "'Kanit', sans-serif", padding: isSmallScreen ? '0 12px' : '0 10px', fontSize: isSmallScreen ? '8px' : '16px', margin: isSmallScreen ? '1px 0' : '0 0' }}>
                                        {setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modalStyle-inet">
                    <div className="contentContainer-inet">
                        <textarea
                            placeholder="เพิ่มรายละเอียด" // Add placeholder text
                            className="rejectReasonInput_External-inet"
                            style={{ fontFamily: "'Kanit', sans-serif" }}
                            value={rejectReason} // Set the value to the state variable
                            onChange={(e) => setRejectReason(e.target.value)} // Update state on change
                        />
                    </div>
                    <div className="buttonContainer">
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#1095c6', color: 'white', fontFamily: "'Kanit', sans-serif" }}
                            onClick={handleRejectConfirm}
                        >
                            Confirm
                        </Button>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#9c0606', color: 'white', fontFamily: "'Kanit', sans-serif" }}
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
            {notification.show && (
                <div className="notification">
                    <img src={SuccessIcon} alt="Success Icon" className='SuccessIcon-img' />
                    <p>{notification.message}</p>
                </div>
            )}
            <div className='container'>
                <div className='Fixlocation'>
                    <button onClick={handleReload}>
                        <img src={HomeIcon} alt="HomeIcon" className='homeicon' />
                    </button>
                </div>
                <div className='Fixlocation'>
                    <button className="Dashboard-Internal-button" onClick={handleDashboardInternalClick} style={{ lineHeight: '1' }}>Dashboard External 1</button>
                </div>
                <div className='Fixlocation'>
                    <button className="Dashboard-Internal-button" onClick={handleDashboardExternalClick} style={{ lineHeight: '1' }} >Dashboard External 2</button>
                </div>
            </div>
            <Card className='cardStyle_Log' style={{ backgroundColor: '#D9D9D9', boxShadow: 'none', borderRadius: '15px' }}>
                <CardContent>
                    <div className='Title-inet'>Report กลุ่มผู้บริหาร</div>
                    <div className='Title2-inet'>สามารถตรวจสอบ Report ได้ที่กลุ่ม Line : Dashboard iClaim OD</div>
                    <div className='container-approve-reject-inet'>
                        <div className='Fixlocation-approve-reject-inet'>
                            <button className="button-Approve-inet" onClick={handleApproveButtonClick} >Approve</button>
                        </div>
                        <div className='Fixlocation-approve-reject-inet'>
                            <button className="button-Reject-inet" onClick={handleRejectButtonClick}>Reject</button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Ininet;