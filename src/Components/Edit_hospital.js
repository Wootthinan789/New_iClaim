import React, { useState, useEffect } from 'react';
import './Style/Edit_hospital.css'
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
import axios from "axios";

const usernameJson = JSON.parse(localStorage.getItem('username'));
const settings = ['กำหนดสิทธิ์','แก้ไขโรงพยาบาล' , 'Log', 'ออกจากระบบ'];

const Edit_hospital = () => {

    const [anchorElUser, setAnchorElUser] = useState(null);

    const [ListHospital, setListHospital] = useState([]); // Corrected variable name
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

    const handleLogClick = () => {
        navigate('/Log')
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
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:443/iClaim/list/hospital');
          setListHospital(response.data); // Corrected function call
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

    const filteredData = ListHospital ? ListHospital.filter(item => {
      return item.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    }) : [];

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
                      maxHeight:isSmallScreen ? '' : '200px', // ปรับสูงความสูงตามที่ต้องการ
                      width: isSmallScreen ? '108px' : '150px', // ปรับความกว้างตามที่ต้องการ
                    },
                  }}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} 
                  style={{    
                    padding: isSmallScreen ? '0 5px' : '8px 12px',}
                }
                  onClick={setting === 'ออกจากระบบ' ? handleLogout : setting === 'Log' ? handleLogClick : null}>
                <Typography       
                style={{
                  fontFamily: "'Kanit', sans-serif",
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
        </div>
        <Card className='cardStyle_EditHospital' style={{ backgroundColor: '#D9D9D9', boxShadow: 'none', borderRadius: '15px' }}>
            <div>
          <h1 style={{ textAlign: "center" }}>รายชื่อ โรงพยาบาล</h1>
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อโรงพยาบาล"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Name Hospital</th>
                    <th>Token</th>
                  </tr>
                </thead>
                <tbody className="scrollable-container">
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.hospital}</td>
                      <td>{item.token}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
          </Card>

      </div>
      
    );
  };

export default Edit_hospital;
