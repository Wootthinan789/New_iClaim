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
const settings = ['กำหนดสิทธิ์','แก้ไขโรงพยาบาล' , 'Log','Internal INET', 'ออกจากระบบ'];

const Edit_hospital = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [ListHospital, setListHospital] = useState([]);
    const [, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newHospitalData, setNewHospitalData] = useState({ hospital: '', token: '' });
    const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
    const [hospitalToDelete, setHospitalToDelete] = useState(null);
    
    //const [editedHospitalData, setEditedHospitalData] = useState({ hospital: '', token: '' });


    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();

    const handleDashboardInternalClick = () => {
        navigate('/Dashboard/Internal')
        window.location.reload();
    };
    const handleInternaliNetClick = () => {
      navigate('/Internal/inet')
      window.location.reload();
    }
    
    const handleDashboardExternalClick = () => {
        navigate('/Dashboard/External')
        window.location.reload();
    };
  
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };

    const handleLogClick = () => {
        navigate('/Log')
    };
    const handleEdithospitalClick = () => {
      navigate('/Edit/Hospital')
      window.location.reload();
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
  
    const handleReload = () => {
        navigate('/Dashboard/External')
        window.location.reload();
    };
    const handleSetPermissions = () => {
      navigate('/Set/Permission')
      window.location.reload();
  }

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('https://rpa-apiprd.inet.co.th:443/iClaim/list/hospital');
          console.log("Data from API:", response.data);
          setListHospital(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      };
      fetchData();
    }, []);

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

    const filteredData = ListHospital ? ListHospital.filter(item => {
      return item.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    }) : [];

    const handleOpenEditDialog = (hospital) => {
        console.log("Fetching hospital ID:", hospital.id);
        setSelectedHospital(hospital);
    };

    const handleOpenAddDialog = () => {
      setOpenAddDialog(true);
    };

    const handleAddHospital = async () => {
      console.log("Adding new hospital:", newHospitalData);
      console.log("Hospital:", newHospitalData.hospital);
      console.log("Token:", newHospitalData.token);

      try {
        const response = await axios.post(
          'https://rpa-apiprd.inet.co.th:443/iClaim/add/hospital',
          {
            hospital_name: newHospitalData.hospital,
            token_line: newHospitalData.token
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
    
        if (response.status === 200) {
          console.log("Hospital added successfully");
          window.location.reload();
        } else {
          console.error("Failed to add hospital");
        }
      } catch (error) {
        console.error('Error adding hospital:', error);
      }

      setOpenAddDialog(false);
      setNewHospitalData({ hospital: '', token: '' });
    };

    const handleOpenDeleteConfirmationDialog = (hospital) => {
        setHospitalToDelete(hospital);
        setDeleteConfirmationDialogOpen(true);
    };

    const handleDeleteHospital = async() => {
        console.log("Deleting hospital:", hospitalToDelete.id);
        try {
          const response = await axios.post(
            'https://rpa-apiprd.inet.co.th:443/iClaim/del/hospital',
            {
              id_hospital: hospitalToDelete.id,
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
      
          if (response.status === 200) {
            console.log("Hospital Delete successfully");
            window.location.reload();
          } else {
            console.error("Failed to Delete hospital");
          }
        } catch (error) {
          console.error('Error Deleting hospital:', error);
        }
        setDeleteConfirmationDialogOpen(false);
        // ตรวจสอบและลบโรงพยาบาล
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
                  <MenuItem key={setting} style={{ padding: isSmallScreen ? '0 5px' : '5px 12px' }} onClick={setting === 'ออกจากระบบ' ? handleLogout : setting === 'แก้ไขโรงพยาบาล' ? handleEdithospitalClick :setting === 'กำหนดสิทธิ์' ? handleSetPermissions : setting === 'Log' ? handleLogClick : setting === 'Internal INET' ? handleInternaliNetClick : null}>
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
            <div style={{ marginBottom: '10px' }}>
              <input
                className='Search_Style'
                type="text"
                placeholder="ค้นหาด้วยชื่อโรงพยาบาล"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='hard_name'>
              <table className='table_Style'>
                <thead>
                  <tr>
                    <th className='Name_Hospital_Style' style={{ padding: isSmallScreen ? '0px 30px 0px 30px' : '5px' }}>Hospital</th>
                    <th className='Token_Style' style={{ padding: isSmallScreen ? '0' : '5px' }}>Token</th>
                    <th>
                      <button className='button_Add_Hospital' onClick={handleOpenAddDialog}>เพิ่ม</button>
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
                        <button className='button_Delete' onClick={() => handleOpenDeleteConfirmationDialog(item)}>ลบ</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
        <AddHospitalDialog //เพิ่ม
          open={openAddDialog}
          handleClose={() => setOpenAddDialog(false)}
          newHospitalData={newHospitalData}
          setNewHospitalData={setNewHospitalData}
          handleAddHospital={handleAddHospital}
        />
        <EditHospitalDialog //แก้ไข
          open={!!selectedHospital}
          handleClose={() => setSelectedHospital(null)}
          hospital={selectedHospital}
        />
        <DeleteConfirmationDialog //ลบ
          open={deleteConfirmationDialogOpen}
          handleClose={() => setDeleteConfirmationDialogOpen(false)}
          handleDelete={handleDeleteHospital}
        />
      </div>
    );
  };
//เพิ่มโรงพยาบาล
const AddHospitalDialog = ({ open, handleClose, newHospitalData, setNewHospitalData, handleAddHospital }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{textAlign:'center', fontFamily:"'Kanit', sans-serif",fontWeight:'400',}}>เพิ่มโรงพยาบาล</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="hospitalName" style={{textAlign:'center', fontFamily:"'Kanit', sans-serif",padding:'0 10px'}}>ชื่อโรงพยาบาล :</label>
          <input
            style={{fontFamily:"'Kanit', sans-serif"}}
            id="hospitalName"
            type="text"
            value={newHospitalData.hospital}
            onChange={(e) => setNewHospitalData({ ...newHospitalData, hospital: e.target.value })}
          />
        </div>
        <div style={{ marginBottom: '20px',marginLeft:'57px' }}>
          <label htmlFor="hospitalToken" style={{textAlign:'center', fontFamily:"'Kanit', sans-serif",padding:'0 10px'}}>Token:</label>
          <input
            style={{fontFamily:"'Kanit', sans-serif"}}
            id="hospitalToken"
            type="text"
            value={newHospitalData.token}
            onChange={(e) => setNewHospitalData({ ...newHospitalData, token: e.target.value })}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button style={{color:'white',background:'#CD6155',fontFamily:"'Kanit', sans-serif",borderRadius:'20px',}} onClick={handleClose}>ยกเลิก</Button>
        <Button style={{color:'white',background:'#2E86C1',fontFamily:"'Kanit', sans-serif",borderRadius:'20px'}} onClick={handleAddHospital}>เพิ่ม</Button>
      </DialogActions>
    </Dialog>
  );
};

const EditHospitalDialog = ({ open, handleClose, hospital }) => {
  const [editedHospitalData, setEditedHospitalData] = useState({ hospital: hospital?.hospital || '', token: hospital?.token || '' });

  const handleEdit = async () => {
    console.log("Editing hospital:", hospital);
    console.log("New data:", editedHospitalData);

    try {
      const response = await axios.post(
        'https://rpa-apiprd.inet.co.th:443/iClaim/edit/hospital',
        {
          hospital_name: editedHospitalData.hospital,
          token_line: editedHospitalData.token,
          id_hospital: hospital.id
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        console.log("Hospital edited successfully");
        window.location.reload(); // หรือจะใช้วิธีการอื่นในการอัพเดทข้อมูลหน้าจอตามต้องการ
      } else {
        console.error("Failed to edit hospital");
      }
    } catch (error) {
      console.error('Error editing hospital:', error);
    }

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: 'center', fontFamily: "'Kanit', sans-serif", fontWeight: '400' }}>แก้ไขโรงพยาบาล</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ textAlign: 'center', fontFamily: "'Kanit', sans-serif", padding: '0 10px' }} htmlFor="editHospitalName">ชื่อโรงพยาบาล : </label>
          <input
            style={{ fontFamily: "'Kanit', sans-serif" }}
            id="editHospitalName"
            type="text"
            defaultValue={hospital?.hospital}
            onChange={(e) => setEditedHospitalData({ ...editedHospitalData, hospital: e.target.value })}
          />
        </div>
        <div style={{ marginBottom: '20px', marginLeft: '53px' }}>
          <label style={{ textAlign: 'center', fontFamily: "'Kanit', sans-serif", padding: '0 10px' }}>Token : </label>
          <input
            style={{ fontFamily: "'Kanit', sans-serif" }}
            id="editHospitalToken"
            type="text"
            defaultValue={hospital?.token}
            onChange={(e) => setEditedHospitalData({ ...editedHospitalData, token: e.target.value })}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button style={{ color: 'white', background: '#CD6155', fontFamily: "'Kanit', sans-serif", borderRadius: '20px', }} onClick={handleClose}>ยกเลิก</Button>
        <Button style={{ color: 'white', background: '#2E86C1', fontFamily: "'Kanit', sans-serif", borderRadius: '20px' }} onClick={handleEdit}>บันทึก</Button>
      </DialogActions>
    </Dialog>
  );
};

//ลบรายการโรงพยาบาล
const DeleteConfirmationDialog = ({ open, handleClose, handleDelete }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle style={{fontFamily:"'Kanit', sans-serif"}}>ยืนยันการลบ</DialogTitle>
            <DialogContent>
                <Typography style={{fontFamily:"'Kanit', sans-serif"}}>คุณต้องการลบโรงพยาบาลนี้ใช่หรือไม่?</Typography>
            </DialogContent>
            <DialogActions>
                <Button style={{fontFamily:"'Kanit', sans-serif"}} onClick={handleClose}>ยกเลิก</Button>
                <Button style={{fontFamily:"'Kanit', sans-serif"}} onClick={handleDelete} color="error">ลบ</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Edit_hospital;
