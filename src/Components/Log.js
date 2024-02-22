import React, { useState, useEffect } from 'react';
import './Style/Log.css'
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import logo from './images-iclaim/download (2).png';
import HomeIcon from './images-iclaim/home-regular-60.png';
import { useNavigate } from 'react-router-dom';

const usernameJson = JSON.parse(localStorage.getItem('username'));
const settings = ['กำหนดสิทธิ์', 'Log', 'ออกจากระบบ'];

const DataLog = ['21/02/2024 10:24', 'Approved','วุฒินันท์ ปรางมาศ','-']
const DataLog1 = ['22/02/2024 09:36', 'Approved','สุธัญญา ชั้นประเสริฐโยธิน ','-']
const DataLog2 = ['21/02/2024 11:45', 'Approved','โทนี่ ชั้นประเสริฐโยธิน','-']

const Log = () => {

    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [putdate, setPutDate] = useState(selectedDate.toISOString().slice(0, 10));

    const [anchorElUser, setAnchorElUser] = useState(null);
  
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
      const formattedDate = date.toISOString().slice(0, 10);
      setPutDate(formattedDate);
    };

    const navigate = useNavigate();
    const handleDashboardInternalClick = () => {
        navigate('/Dashboard/Internal')
      };
    
    const handleDashboardExternalClick = () => {
        navigate('/Dashboard/External')
      };
  
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };
  
    const handleLogout = () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("username");
      window.location.href = "/";
    };
  
    const handleReload = () => {
        navigate('/Dashboard/External')
      //window.location.reload();
    };
  
    useEffect(() => {
      const fetchCountries = async () => {
        try {
          const response = await fetch(`http://rpa-apiprd.inet.co.th:443/iClaim/list?date_on=${putdate}`);
          const data = await response.json();
          if (!Array.isArray(data) || data.length === 0) {
            setCountries([]);
            setLoading(false);
          } else {
            setCountries(data);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching countries:', error);
          setLoading(false);
        }
      };
  
      fetchCountries();
    }, [putdate]);
  
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
                      alt="Remy Sharp"
                      //src="https://1.bp.blogspot.com/-2PZ5N_3DEhY/VWGBjmg_yiI/AAAAAAAAAdo/OBu_pBiqAr4/s1600/mdicth4.jpg"
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
                      maxHeight:isSmallScreen ? '' : '200px', // ปรับสูงความสูงตามที่ต้องการ
                      width: isSmallScreen ? '100px' : '150px', // ปรับความกว้างตามที่ต้องการ
                    },
                  }}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} 
                  style={{    
                    padding: isSmallScreen ? '0 5px' : '8px 12px',}
                }
                  onClick={setting === 'ออกจากระบบ' ? handleLogout : handleCloseUserMenu}>
                <Typography       
                style={{
                  padding: isSmallScreen ? '0 12px' : '0 10px',
                  fontSize: isSmallScreen ? '12px' : '16px',
                  margin: isSmallScreen ? '1px 0' : '0 0',
                  }}
                  >{setting}</Typography>
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
            <button className="Dashboard-Internal-button" onClick={handleDashboardInternalClick} >Dashboard Internal</button>
          </div>
          <div className='Fixlocation'>
            <button className="Dashboard-Internal-button" onClick={handleDashboardExternalClick} >Dashboard External</button>
          </div>
          <div className='Fixlocation'>
            <DatePicker className='Dashboard-Internal-button-date'
              selected={selectedDate} onChange={handleDateChange} dateFormat="dd/MM/yyyy" />
          </div>
        </div>
        <Card className='cardStyle_Log' style={{ backgroundColor: '#D9D9D9', boxShadow: 'none', borderRadius: '15px' }}>
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : countries && countries.length > 0 ? (
            <CardContent>
                <div>
                    <h1 className='Text_Log' style={{fontFamily:"'Kanit', sans-serif"}}>Log</h1>
                </div>
                <div className='background_log'>
                    <p className='insert_date1' style={{borderRadius : isSmallScreen ? '4px 0 0 4px' :'8px 0 0 8px'}}>Date</p>
                    <p className='insert_date1'>Status</p>
                    <p className='insert_date1'>Action By</p>
                    <p className='insert_date1' style={{borderRadius : isSmallScreen ? '0 4px 4px 0' :'0 8px 8px 0'}}>Comment</p>
                </div>
                <div className='box_insert_data2'>
                    <p className='insert_date2'>{DataLog[0]}</p>
                    <p className='insert_date2'>{DataLog[1]}</p>
                    <p className='insert_date2'>{DataLog[2]}</p>
                    <p className='insert_date2'>{DataLog[3]}</p>
                </div>
                <div className='box_insert_data2'>
                    <p className='insert_date2'>{DataLog2[0]}</p>
                    <p className='insert_date2'>{DataLog2[1]}</p>
                    <p className='insert_date2'>{DataLog2[2]}</p>
                    <p className='insert_date2'>{DataLog2[3]}</p>
                </div>
                <div className='box_insert_data2'>
                    <p className='insert_date2'>{DataLog1[0]}</p>
                    <p className='insert_date2'>{DataLog1[1]}</p>
                    <p className='insert_date2'>{DataLog1[2]}</p>
                    <p className='insert_date2'>{DataLog1[3]}</p>
                </div>
            </CardContent>
          ) : (
            <p style={{ textAlign: "center", fontFamily: "'Kanit', sans-serif", fontSize: isSmallScreen ? '8px' : '20px', }}>ไม่มีข้อมูลสําหรับวันที่เลือก</p>
          )}
        </Card>
      </div>
    );
  };

export default Log;
