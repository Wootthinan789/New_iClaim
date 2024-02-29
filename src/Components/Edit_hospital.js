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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const usernameJson = JSON.parse(localStorage.getItem('username'));
const settings = ['กำหนดสิทธิ์','แก้ไขโรงพยาบาล' , 'Log', 'ออกจากระบบ'];

const Edit_hospital = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [ListHospital, setListHospital] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHospital, setSelectedHospital] = useState(null);

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
          setListHospital(response.data);
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

    const handleOpenEditDialog = (hospital) => {
        setSelectedHospital(hospital);
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
                      maxHeight:isSmallScreen ? '' : '200px', 
                      width: isSmallScreen ? '108px' : '150px', 
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
          <h1 className='hard_title'>รายชื่อ โรงพยาบาล</h1>
          <input
          className='Search_Style'
            type="text"
            placeholder="ค้นหาด้วยชื่อโรงพยาบาล"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className='hard_name'>
              <table className='table_Style'>
                <thead>
                  <tr>
                    <th className='Name_Hospital_Style' style={{ padding: '5px'}}>Name Hospital</th>
                    <th className='Token_Style' style={{ padding: '5px' }}>Token</th>
                    <th >
                      <button className='button_Add_Hospital' >เพิ่ม</button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className='data_Style'>{item.hospital}</td>
                      <td className='data_Style'>{item.token}</td>
                      <td className='data_Style'>
                        <button className='button_Edit' onClick={() => handleOpenEditDialog(item)}>แก้ไข</button>
                      </td>
                      <td className='data_Style'>
                        <button className='button_Delete' onClick={() => handleOpenEditDialog(item)}>ลบ</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          )}
        </div>
          </Card>
        <EditHospitalDialog
          open={!!selectedHospital}
          handleClose={() => setSelectedHospital(null)}
          hospital={selectedHospital}
        />
      </div>
      
    );
  };

    const EditHospitalDialog = ({ open, handleClose, hospital }) => {
      const handleEdit = () => {
        console.log("Editing hospital:", hospital);
        handleClose();
      };

      return (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>แก้ไขโรงพยาบาล</DialogTitle>
          <DialogContent>
            <p>ข้อมูลโรงพยาบาล: {hospital?.hospital}</p>
            <p>Token: {hospital?.token}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>ยกเลิก</Button>
            <Button onClick={handleEdit}>บันทึก</Button>
          </DialogActions>
        </Dialog>
      );
    };

export default Edit_hospital;
