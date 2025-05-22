import React, { useState, useEffect } from 'react';
import './Style/Edit_hospital.css';
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
import 'react-datepicker/dist/react-datepicker.css';
import logo from './images-iclaim/download (2).png';
import employee from './images-iclaim/employee.png'
import HomeIcon from './images-iclaim/home-regular-60.png';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useMediaQuery, useTheme } from '@mui/material';

const usernameJson = JSON.parse(localStorage.getItem('username'));
const settings = ['External 3','Internal INET','Internal V2','Report Team Iclaim','กำหนดสิทธิ์','แก้ไขโรงพยาบาล' , 'Log','ข่าวสารโรงพยาบาล', 'ออกจากระบบ'];

const Edit_hospital = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [ListHospital, setListHospital] = useState([]);
    const [, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newHospitalData, setNewHospitalData] = useState({ hospital: '', mails: [''] });
    const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
    const [hospitalToDelete, setHospitalToDelete] = useState(null);
    const [editingHospital, setEditingHospital] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [originalHospitalName, setOriginalHospitalName] = useState(''); // <- เก็บชื่อเดิม
    
    //const [editedHospitalData, setEditedHospitalData] = useState({ hospital: '', token: '' });

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();
    const handleExternal3 = () => {
      navigate('/Dashboard/External3')
      window.location.reload();
    }
    const handleReportTeamIClaim = () => {
      navigate('/Report/Team/iClaim')
      window.location.reload();
    }
    const handleInternalv2 = () => {
      navigate('/Internal/v2')
      window.location.reload();
    }

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
    const handleHospitalNews = () => {
      navigate('/Hospital/News')
      window.location.reload();
    }
    const handleEdithospitalClick = () => {
      navigate('/Edit/Hospital')
      window.location.reload();
  };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };
  
    const handleLogout = () => {
      localStorage.clear();
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
        const timestamp = new Date().getTime();
        const response = await axios.get(`https://rpa-apiprd.inet.co.th:443/iClaim/list/hospital?t=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
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
  useEffect(() => {
    let lastActivityTime = new Date().getTime();

    const checkInactivity = () => {
      const currentTime = new Date().getTime();
      const inactiveTime = currentTime - lastActivityTime;
      const twoMinutes = 10 * 60 * 1000;

      if (inactiveTime > twoMinutes) {
        handleLogout();
      }
    };

    const handleActivity = () => {
      lastActivityTime = new Date().getTime();
    };

    const activityInterval = setInterval(checkInactivity, 60000);

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

    const handleOpenAddDialog = () => {
      setOpenAddDialog(true);
    };

    const handleAddHospital = async () => {
      const cleanedMails = newHospitalData.mails.filter(mail => mail.trim() !== '');
  
      console.log("📦 ส่งข้อมูลโรงพยาบาล:", newHospitalData.hospital);
      console.log("📬 รายการอีเมลที่จะส่ง:", cleanedMails);
  
      const data = {
        hospital: newHospitalData.hospital,
        mails: cleanedMails,
        username: usernameJson.username,
        remark: 'add hospital and mails'
      };
  
      try {
        const response = await axios.post(
          'https://rpa-apiprd.inet.co.th:443/iClaim/add/hospital',
          {
            hospital_name: newHospitalData.hospital,
            mails: cleanedMails
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
  
      try {
        await axios.post("https://rpa-apiprd.inet.co.th:443/OnePlatform/add/hospital/iclaim", data);
        console.log("Data sent successfully to server");
      } catch (error) {
        console.log('Error sending hospital and mails to server:', error);
      }
  
      setNewHospitalData({ hospital: '', mails: [''] });
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
    };

    const handleEditHospital = (item) => {
      setEditingHospital(item);
      setOriginalHospitalName(item.hospital); // ← เก็บชื่อเดิม
      setEditDialogOpen(true);
    };
    
    const handleSaveEdit = async () => {
      if (!editingHospital) return;

      const updatedData = {
        oldHospitalName: originalHospitalName,
        newHospitalName: editingHospital.hospital,
        email: editingHospital.Email,
        username: usernameJson.username,
      };

      console.log("ข้อมูลที่แก้ไข:", updatedData);

      try {
        await axios.post('https://rpa-apiprd.inet.co.th:443/iClaim/update/hospital/edit', updatedData);
        setEditDialogOpen(false);
        setEditingHospital(null);
        setOriginalHospitalName('');
        window.location.reload();
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลโรงพยาบาล:", error);
      }
        try {
          await axios.post("https://rpa-apiprd.inet.co.th:443/OnePlatform/edit/hospital/iclaim", updatedData);
          console.log("Data sent successfully to server");
        } catch (error) {
          console.log('Error sending hospital and mails to server:', error);
        }
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
                <Box
                  className='Box2'
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isSmallScreen ? '4px' : '8px', // ระยะห่างระหว่าง avatar และ text
                  }}
                >
                  <Avatar
                    alt="employee.png"
                    src={employee}
                    className='Avatar-img'
                    sx={{
                      width: isSmallScreen ? 24 : 40,
                      height: isSmallScreen ? 24 : 40,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: isSmallScreen ? '10px' : '16px',
                      fontWeight: 'bold',
                      fontFamily: "'Kanit', sans-serif",
                    }}
                  >
                    {usernameJson.username}
                  </Typography>
                  <KeyboardArrowDownIcon
                    sx={{ fontSize: isSmallScreen ? '16px' : '24px' }}
                  />
                </Box>
              </IconButton>
            </Tooltip>

            <Menu
              style={{ position: 'fixed' }}
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
                  width: isSmallScreen ? '120px' : '155px',
                },
              }}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={
                    setting === 'ออกจากระบบ' ? handleLogout :
                    setting === 'Log' ? handleLogClick :
                    setting === 'แก้ไขโรงพยาบาล' ? handleEdithospitalClick :
                    setting === 'กำหนดสิทธิ์' ? handleSetPermissions :
                    setting === 'Internal INET' ? handleInternaliNetClick :
                    setting === 'ข่าวสารโรงพยาบาล' ? handleHospitalNews :
                    setting === 'Internal V2' ? handleInternalv2 :
                    setting === 'Report Team Iclaim' ? handleReportTeamIClaim :
                    setting === 'External 3' ? handleExternal3 : null
                  }
                  sx={{
                    px: isSmallScreen ? 1 : 2,
                    py: isSmallScreen ? 0.5 : 1,
                    minHeight: isSmallScreen ? '28px' : 'auto',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Kanit', sans-serif",
                      fontSize: isSmallScreen ? '10px' : '16px',
                      lineHeight: isSmallScreen ? '1.2' : '1.5',
                    }}
                  >
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
            <button className="Dashboard-Internal-button" onClick={handleDashboardInternalClick} >Dashboard External 1</button>
          </div>
          <div className='Fixlocation'>
            <button className="Dashboard-Internal-button" onClick={handleDashboardExternalClick} >Dashboard External 2</button>
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
                    <th
                      className='Name_Hospital_Style'
                      style={{
                        padding: isSmallScreen ? '0px 30px 0px 30px' : '5px',
                        width: '40%',
                      }}
                    >
                      ชื่อโรงพยาบาล
                    </th>
                    <th
                      className='Token_Style'
                      style={{
                        padding: isSmallScreen ? '0' : '5px',
                        width: '60%',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                      }}
                    >
                      Mail
                    </th>
                    <th
                      style={{
                        paddingLeft: isSmallScreen ? '9px' : '15px',
                        minWidth: isSmallScreen ? '30px' : '80px',
                      }}>
                      <button className='button_Add_Hospital' onClick={handleOpenAddDialog}>เพิ่ม</button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td
                        className='data_Style'
                        style={{ width: '40%' }}
                      >
                        {item.hospital}
                      </td>
                      <td
                        className='data_Style'
                        style={{
                          width: '60%',
                          wordBreak: 'break-word',
                          whiteSpace: 'normal',
                        }}
                      >
                        {Array.isArray(item.Email) ? item.Email.join(', ') : item.Email}
                      </td>
                      <td className='data_Style'>
                        <button className='button_Edit' onClick={() => handleEditHospital(item)}>แก้ไข</button>
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
          {editDialogOpen && (
            <div className="popup-overlay">
              <div className="popup-container">
                <h2 className="popup-title">แก้ไขโรงพยาบาล</h2>

                <div className="popup-input-group">
                  <label style={{fontWeight:"300"}} className="popup-label">ชื่อโรงพยาบาล :</label>
                  <input
                    type="text"
                    className="popup-input"
                    value={editingHospital?.hospital || ''}
                    onChange={(e) =>
                      setEditingHospital({ ...editingHospital, hospital: e.target.value })
                    }
                  />
                </div>

                <div className="popup-input-group">
                  <label style={{fontWeight:"300"}} className="popup-label">อีเมล (คั่นด้วย , ) :</label>
                  <input
                    type="text"
                    className="popup-input"
                    value={
                      Array.isArray(editingHospital?.Email)
                        ? editingHospital.Email.join(', ')
                        : editingHospital?.Email || ''
                    }
                    onChange={(e) =>
                      setEditingHospital({
                        ...editingHospital,
                        Email: e.target.value.split(',').map((email) => email.trim()),
                      })
                    }
                  />
                </div>

                <div className="popup-actions">
                  <button className="popup-button save" onClick={handleSaveEdit}>บันทึก</button>
                  <button className="popup-button cancel" onClick={() => setEditDialogOpen(false)}>ยกเลิก</button>
                </div>
              </div>
            </div>
          )}
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
  const handleMailChange = (index, value) => {
    const updatedMails = [...newHospitalData.mails];
    updatedMails[index] = value;

    console.log(`📧 พิมพ์ Mail ช่องที่ ${index + 1}:`, value);
    console.log("📋 รายการอีเมลทั้งหมดตอนนี้:", updatedMails);

    setNewHospitalData({ ...newHospitalData, mails: updatedMails });
  };
  
  const handleAddMailField = () => {
    setNewHospitalData({ ...newHospitalData, mails: [...newHospitalData.mails, ''] });
  };
  const handleRemoveMailField = (index) => {
    const updatedMails = [...newHospitalData.mails];
    updatedMails.splice(index, 1);
    setNewHospitalData({ ...newHospitalData, mails: updatedMails });
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: '20px',
          padding: '10px',
        }
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontFamily: "'Kanit', sans-serif",
          fontWeight: 400,
          fontSize: { xs: '18px', sm: '20px', md: '20px', lg: '24px' }
        }}
      >
        เพิ่มโรงพยาบาล
      </DialogTitle>

      <DialogContent>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '300px' }}>
            <label htmlFor="hospitalName" style={{ fontFamily: "'Kanit', sans-serif", marginBottom: '5px', display: 'block' }}>
              ชื่อโรงพยาบาล :
            </label>
            <input
              className='Style_Dialog_Edit'
              style={{
                fontFamily: "'Kanit', sans-serif",
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
              id="hospitalName"
              type="text"
              value={newHospitalData.hospital}
              onChange={(e) => {
                const value = e.target.value;
                console.log("📌 พิมพ์ชื่อโรงพยาบาล:", value);
                setNewHospitalData({ ...newHospitalData, hospital: value });
              }}
            />
          </div>
        </div>

        {newHospitalData.mails.map((mail, index) => (
          <div key={index} style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <label
                htmlFor={`hospitalMail-${index}`}
                style={{ fontFamily: "'Kanit', sans-serif", marginBottom: '5px', display: 'block' }}
              >
                Mail {index + 1} :
              </label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  id={`hospitalMail-${index}`}
                  type="text"
                  value={mail}
                  onChange={(e) => handleMailChange(index, e.target.value)}
                  style={{
                    fontFamily: "'Kanit', sans-serif",
                    flexGrow: 1,
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc'
                  }}
                />
                {newHospitalData.mails.length > 1 && (
                  <button
                    onClick={() => handleRemoveMailField(index)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'red',
                      fontSize: '10px',
                      cursor: 'pointer',
                      marginLeft: '10px'
                    }}
                    title="ลบช่องนี้"
                  >
                    ❌
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button
            variant="outlined"
            onClick={handleAddMailField}
            sx={{
              fontFamily: "'Kanit', sans-serif",
              color: 'white',
              border:'none',
              backgroundColor: '#717d7e',
              borderRadius: '20px',
              width: '120px',
              '&:hover': {
                backgroundColor: '#4d5656',
                color: 'white',
                border:'none'
              }
            }}
          >
            + เพิ่ม Mail
          </Button>
        </div>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          sx={{
            color: 'white',
            backgroundColor: '#cb4335',
            fontFamily: "'Kanit', sans-serif",
            borderRadius: '20px',
            mx: 1,
            '&:hover': {
              backgroundColor: '#7b241c',
              color: 'white'
            }
          }}
          onClick={handleClose}
        >
          ยกเลิก
        </Button>
        <Button
          sx={{
            color: 'white',
            backgroundColor: '#2874a6',
            fontFamily: "'Kanit', sans-serif",
            borderRadius: '20px',
            mx: 1,
            '&:hover': {
              backgroundColor: '#154360',
              color: 'white'
            }
          }}
          onClick={handleAddHospital}
        >
          เพิ่ม
        </Button>
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
        window.location.reload();
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
