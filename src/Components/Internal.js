import React, { useState, useEffect } from 'react';
import './Internal.css'
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
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useMediaQuery, useTheme } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import logo from './images-iclaim/download (2).png';
import HomeIcon from './images-iclaim/home-regular-60.png';
import SuccessIcon from './images-iclaim/checked.png';
import FailIcon from './images-iclaim/cancel.png';

let username = "วุฒินันท์ ปรางมาศ";
const settings = ['กำหนดสิทธิ์', 'Log', 'ออกจากระบบ'];

const Internal = () => {
  // Loop img and Title API iClaim
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true); 
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [putdate, setPutDate] = useState(selectedDate.toISOString().slice(0, 10));
  const handleDateChange = date => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().slice(0, 10);
    setPutDate(formattedDate);
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

  const [notification, setNotification] = useState({ message: '', show: false });
  const [darkBackground, setDarkBackground] = useState(false); 
  const [openModal, setOpenModal] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');
  const [rejectedImage, setRejectedImage] = React.useState(null);
  const [checkedImages, setCheckedImages] = React.useState({});
  const [selectAllChecked, setSelectAllChecked] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleRejectButtonClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setRejectReason('');
    setRejectedImage(null);

    setOpenModal(false);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason) {
      console.error('Reject Reason is required');
      return;
    }
    if (!rejectedImage) {
      console.error('Rejected Image is required');
      return;
    }

    // ส่งข้อมูลไปยัง API หรือทำอย่างอื่นตามที่ต้องการ

    setRejectReason('');
    setRejectedImage(null);
    setOpenModal(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleImageCheckboxChange = (imageName) => {
    setCheckedImages((prevCheckedImages) => {
      const allImagesChecked = Object.values({
        ...prevCheckedImages,
        [imageName]: !prevCheckedImages[imageName],
      }).every((isChecked) => isChecked);

      setSelectAllChecked(allImagesChecked);

      return {
        ...prevCheckedImages,
        [imageName]: !prevCheckedImages[imageName],
      };
    });
  };

  const handleSelectAllChange = () => {
    const newCheckedImages = {};
    for (const key in checkedImages) {
      newCheckedImages[key] = !selectAllChecked;
    }
    setCheckedImages(newCheckedImages);
    setSelectAllChecked(!selectAllChecked);
  };

  const handleResetImages = () => {
    setCheckedImages({});
    setSelectAllChecked(false);
    window.location.reload();
  };

  const handleApproveButtonClick = () => {
    setNotification({ message: 'ยืนยันเรียบร้อยแล้ว', show: true });
    setDarkBackground(true); 

    setTimeout(() => {
      setNotification({ message: '', show: false });
      setDarkBackground(false); 
    }, 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className='containerStype'>
      <AppBar position="static" className='appBarStyle' style={{backgroundColor: 'white',boxShadow: 'none',}}>
        <Toolbar>
          <Box className='BoxStyle'>
            <img src={logo} alt="Logo" className='logoStyle'/>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box className = 'Box1'>
            <Tooltip>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Box className='Box2'>
                  <Avatar
                    alt="Remy Sharp"
                    src="https://1.bp.blogspot.com/-2PZ5N_3DEhY/VWGBjmg_yiI/AAAAAAAAAdo/OBu_pBiqAr4/s1600/mdicth4.jpg"
                    className='Avatar-img'
                  />
                  <Typography variant="body1" style={{fontSize: isSmallScreen ? '8px' : '16px', fontWeight: 'bold', fontFamily: "'Kanit', sans-serif"}}>
                    {username}
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
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={setting === 'ออกจากระบบ' ? handleLogout : handleCloseUserMenu}>
                  <Typography variant="h1" style={{ fontSize: isSmallScreen ? '8px' : '16px', margin: isSmallScreen ? '0' :'0' }}>{setting}</Typography>
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
        <Box className="modalStyle">
          <img src={FailIcon} alt="Fail Icon" style={{ marginRight: '10px' }} className='FailIcon-img'/>
          <p>ปฎิเสธ</p>
          <input type="text" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
          <input type="file" accept="image/*" onChange={(e) => setRejectedImage(e.target.files[0])} />
          {rejectedImage && <img src={URL.createObjectURL(rejectedImage)} alt="Rejected" style={{ width: '100px', height: '100px' }} />}
          <div style={{ marginTop: '10px' }}>
            <Button variant="contained" onClick={handleRejectConfirm} style={{ marginRight: '10px' }} >Confirm</Button>
            <Button variant="contained" onClick={handleCloseModal}>Cancel</Button>
          </div>
        </Box>
      </Modal>
      {notification.show && (
        <div className="notification">
          <img src={SuccessIcon} alt="Success Icon" className='SuccessIcon-img'/>
          <p>{notification.message}</p>
        </div>
      )}
      {darkBackground && <div className="dark-background"></div>} 
      <div className='container'>
        <div className='Fixlocation'>
          <button onClick={handleResetImages} >
            <img src={HomeIcon} alt="HomeIcon" className='homeicon'/>
          </button>
        </div>
        <div className='Fixlocation'>
          <button className="Dashboard-Internal-button" style={{ background: '#2D7951' }}>Dashboard Internal</button>
        </div>
        <div className='Fixlocation'>
          <button className="Dashboard-Internal-button">Dashboard External</button>
        </div>
        <div className='Fixlocation'>
          <DatePicker className='Dashboard-Internal-button-date'
           selected={selectedDate} onChange={handleDateChange} dateFormat="dd/MM/yyyy"/>
        </div>
      </div>
      <Card className='cardStyle' style={{backgroundColor:'#D9D9D9', boxShadow:'none', borderRadius:'15px'}}>
        <div>
        {loading ? ( // ตรวจสอบสถานะการโหลดข้อมูล
        <p style={{textAlign:"center"}}>Loading...</p>
      ) : countries && countries.length > 0 ? ( // ตรวจสอบว่ามีข้อมูลอยู่หรือไม่
        <CardContent>
        <FormGroup>
          {countries.map((country, index) => ( 
            <div key={index} style={{ marginBottom: '20px', textAlign: 'center', position: 'relative' }}>
              <FormControlLabel
                control={
                  <label className="custom-checkbox">
                    <Checkbox
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      checked={checkedImages[`iClaim${index + 1}`]}
                      onChange={() => handleImageCheckboxChange(`iClaim${index + 1}`)}
                      size="small"
                    />
                    <span className="checkmark"></span>
                  </label>
                }
                label={
                  <Typography
                    style={{
                      fontWeight: 'bold',
                      background: checkedImages[`iClaim${index + 1}`] ? '#1768C4' : '#FFFF',
                      borderRadius: '10px',
                      borderWidth: '10px',
                      fontFamily: "'Kanit', sans-serif",
                      marginTop: '5px',
                      padding: isSmallScreen ? '5px' : '10px',
                      margin: isSmallScreen ? '0px 5px':'0px 15px',
                      fontSize: isSmallScreen ? '8px' : '20px',
                      color: checkedImages[`iClaim${index + 1}`] ? '#FFFF' : 'black',
                    }}
                  >
                    {country.title}
                  </Typography>
                }
              />
              <img
                src={country.img_7}
                alt={`iClaim${index + 1}`}
                style={{
                  width: '80%',
                  height: '50%',
                  objectFit: 'cover',
                  borderRadius: '0 0 8px 8px',
                  paddingTop: isSmallScreen ? '3px':'10px',
                  paddingLeft: isSmallScreen ? '10px' : '0px',
                }}
              />
            </div>
          ))}
        </FormGroup>
        <FormControlLabel 
          style={{ 
            padding: isSmallScreen ? '0px 2px 0px' : '0px 10px 0px',
            marginTop: isSmallScreen ? '0px ' : '10px' 
          }}
          control={
            <label className="custom-checkbox">
              <Checkbox
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<CheckCircleIcon />}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                checked={selectAllChecked}
                onChange={handleSelectAllChange}
                size="small"
              />
              <span className="checkmark"></span>
            </label>
          }
          label={
            <Typography
              style={{
                fontWeight: 'bold',
                fontFamily: "'Kanit', sans-serif",
                marginTop: '5px',
                margin: isSmallScreen ? '0px 0px 2px' : '0px 7px',
                fontSize: isSmallScreen ? '10px':'18px',
                color: selectAllChecked ? '#1768C4' : 'black',
              }}
            >
              Select All
            </Typography>
          }
        />
      </CardContent>
      ) : (
        <p style={{textAlign:"center", fontFamily: "'Kanit', sans-serif", fontSize: isSmallScreen ? '8px' : '20px',}}>ไม่มีข้อมูลสําหรับวันที่เลือก</p>
      )}
        </div>
      </Card>
      <div className='container-approve-reject'>
        <div className='Fixlocation-approve-reject'>
          <button className="button-Approve" onClick={handleApproveButtonClick}>Approve</button>
        </div>
        <div className='Fixlocation-approve-reject'>
          <button className="button-Reject" onClick={handleRejectButtonClick}>Reject</button>
        </div>
      </div>
    </div>
  );
};

export default Internal;
