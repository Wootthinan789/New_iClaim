import React, { useState, useEffect } from 'react';
import  axios  from 'axios';
import './Style/Internal.css';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { useMediaQuery, useTheme } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import logo from './images-iclaim/download (2).png';
import employee from './images-iclaim/employee.png'
import HomeIcon from './images-iclaim/home-regular-60.png';
import SuccessIcon from './images-iclaim/checked.png';
import FailIcon from './images-iclaim/cancel.png';
import { useNavigate } from 'react-router-dom';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

//let username = "วุฒินันท์ ปรางมาศ";
const settings = ['กำหนดสิทธิ์','แก้ไขโรงพยาบาล' , 'Log', 'ออกจากระบบ'];

const Internal = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [putdate, setPutDate] = useState(selectedDate.toISOString().slice(0, 10));
  const [notification, setNotification] = useState({ message: '', show: false });
  const [darkBackground, setDarkBackground] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectedImage, setRejectedImage] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const usernameJson = JSON.parse(localStorage.getItem('username'));
  const [keyIds, setKeyIds] = useState([]);
  const [id_hospital, setIdHospital] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

  const [selectAll, setSelectAll] = useState(false);
  const role = localStorage.getItem("role")
  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().slice(0, 10);
    setPutDate(formattedDate);
  };
  useEffect(() => {
    // เมื่อ selectedDate เปลี่ยนแปลง กำหนดค่า putdate ใหม่
    const formattedDate = selectedDate.toISOString().slice(0, 10);
    setPutDate(formattedDate);
  }, [selectedDate]);
  useEffect(() => {
    // สร้างฟังก์ชันเพื่อกำหนดวันที่ลดลง 1 วันจากวันปัจจุบัน
    const currentDate = new Date();
    const previousDay = new Date(currentDate);
    previousDay.setDate(currentDate.getDate() - 1);

    // กำหนดวันที่ลดลงให้กับ state
    setSelectedDate(previousDay);
  }, []);

  const navigate = useNavigate();
  const handleDashboardExternalClick = () => {
      navigate('/Dashboard/External')
      window.location.reload();
    };

  const handleRejectButtonClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setRejectReason('');
    setRejectedImage(null);
    setOpenModal(false);
  };

  const handleRejectReasonChange = (event, index) => {
    const value = event.target.value;
    setSelectedCheckboxes(prevState => ({
      ...prevState,
      [index]: {
        ...prevState[index],
        rejectReason: value
      }
    }));
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
  
  const handleRejectConfirm = async () => {
    // สร้าง Array ใหม่เพื่อเก็บข้อมูลที่จะส่งไปยัง API หรือทำงานอื่น ๆ
    const newDataArray = Object.keys(selectedCheckboxes).map((index) => ({
      id_hospital: selectedCheckboxes[index].id_hospital,
      img_7_Array: selectedCheckboxes[index].img_7_Array,
      token: selectedCheckboxes[index].token,
      user_name: selectedCheckboxes[index].user_name,
      menu: selectedCheckboxes[index].menu,
      title: selectedCheckboxes[index].title,
      rejectReason: selectedCheckboxes[index].rejectReason // ข้อความจาก textarea
    }));
    
    console.log(newDataArray);
  
    try {
      // ทำการแปลง object เป็น array เพื่อนำไปใช้งานหรือส่งข้อมูล
      const selectedHospitalsArrayReject = Object.values(newDataArray);
      // ส่งข้อมูลตามต้องการ
      const data = {
        message: selectedHospitalsArrayReject
      };
      console.log(data)
      // ส่งข้อมูลไปยัง API
      //await axios.post("http://localhost:443/send-message/Reject", data);
      await axios.post("http://rpa-apiprd.inet.co.th:443/send-message/Reject", data);
      console.log("Data sent successfully send message Reject");

      const response = await axios.post('http://203.154.39.190:5000/rpa/iclaim/InsertRequest', data);
      console.log("Data sent successfully ake : ", response.data);

      // ส่งข้อมูลไปยัง API insert log
      const logPromises = selectedHospitalsArrayReject.map(async (checkbox) => {
        const logData = {
          doc_name: "-",
          status: "Reject",
          user_name: usernameJson.username,
          remark: checkbox.title, // Use the checkbox title as the remark
          data_type: "Internal"
        };
  
      await axios.post("http://rpa-apiprd.inet.co.th:443/iClaim/insert/log", logData);
      console.log("Log data inserted successfully");
    });
    await Promise.all(logPromises);

      //await axios.post("http://localhost:443/send-message/alertReject", data);
      await axios.post("http://rpa-apiprd.inet.co.th:443/send-message/alertReject", data);
      console.log("Data sent successfully send message alert Reject");

    } catch (error) {
      console.error('Error sending data:', error.message);
    }
    // เคลียร์ข้อมูลของ textarea และปิด Modal
    setSelectedCheckboxes({});
    setOpenModal(false);
    window.location.reload();
  };
  

  // ตรวจสอบว่ามี img_7_Array ที่ถูกเลือกหรือไม่ ถ้ามีให้แสดงใน Modal
  // const renderSelectedImages = () => {
  //   return Object.values(selectedCheckboxes).map((checkbox, index) => (
  //     <div key={index}><img src={checkbox.img_7_Array} alt={`Image ${index + 1}`} className="imageInModal_Internal" /></div>
  //   ));
  // };
  

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleApproveButtonClick = async () => {
    if (Object.keys(selectedCheckboxes).length === 0) {
      console.error('ไม่ได้เลือกข้อมูลใด ๆ เพื่อดำเนินการ');
      return;
    }
  
    setNotification({ message: 'ยืนยันเรียบร้อยแล้ว', show: true });
    setDarkBackground(true);
  
    try {
      // ทำการแปลง object เป็น array เพื่อนำไปใช้งานหรือส่งข้อมูล
      const selectedHospitalsArray = Object.values(selectedCheckboxes);
      // ส่งข้อมูลตามต้องการ
      const data = {
        message: selectedHospitalsArray
      };
      console.log(data)
      // ส่งข้อมูลไปยัง API ส่งรูปไปยัง Line notify
      //await axios.post("http://localhost:443/send-message", data);
      await axios.post("http://rpa-apiprd.inet.co.th:443/send-message", data);
      console.log("Data sent successfully send message");

      // ส่งข้อมูลไปยัง API insert log
      // const logData = {
      //   doc_name: "-",
      //   status: "Approved",
      //   user_name: usernameJson.username, // นำ username จาก local storage มาใช้งาน
      //   remark: "-",
      //   data_type: "Internal"
      // };
      const logPromises = selectedHospitalsArray.map(async (checkbox) => {
        const logData = {
          doc_name: "-",
          status: "Approved",
          user_name: usernameJson.username,
          remark: checkbox.title, // Use the checkbox title as the remark
          data_type: "Internal"
        };
      // ส่งข้อมูลเข้า log
      await axios.post("http://rpa-apiprd.inet.co.th:443/iClaim/insert/log", logData);
      console.log("Log data inserted successfully for", checkbox.title);
    });
    await Promise.all(logPromises);
      // ส่ง Alert ไปยัง line notify Group team
      //await axios.post("http://localhost:443/send-message/alert", data);
      await axios.post("http://rpa-apiprd.inet.co.th:443/send-message/alert", data);
      console.log("Data sent successfully send message alert");

    } catch (error) {
      console.error('Error sending data:', error.message);
    }
  
    setTimeout(() => {
      setNotification({ message: '', show: false });
      setDarkBackground(false);
    }, 2500);
    window.location.reload();
  };
  


  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    localStorage.removeItem("account_id")
    localStorage.removeItem("user_role")
    localStorage.removeItem("role")
    window.location.href = "/";
  };

  const handleLogClick = () => {
    navigate('/Log')
    window.location.reload();
  }

  const handleEdithospitalClick = () => {
    navigate('/Edit/Hospital')
    window.location.reload();
  }
  const handleSetPermissions = () => {
    navigate('/Set/Permission')
    window.location.reload();
}

  const handleCheckboxChange = (event, index) => {
    const isChecked = event.target.checked;
    setCheckedItems(prevState => ({
      ...prevState,
      [index]: isChecked
    }));
    
    if (isChecked) {
      const checkboxData = countries[index];
      const id_hospital = checkboxData.id_hospital;
      const img_7_Array = checkboxData.img_7;
      const title = checkboxData.title;
      const token = keyIds.find((hospital) => hospital.id === id_hospital)?.token;
      // console.log('id_hospital : ', id_hospital);
      // console.log('img_7_Array : ', img_7_Array);
      // console.log('Token : ', token);
      // console.log('title : ', title);
  
      // Create a new object representing the selected checkbox data
      const selectedCheckbox = {
        id_hospital: id_hospital,
        img_7_Array: img_7_Array,
        token: token,
        user_name: usernameJson.username,
        menu : "Internal",
        title:title
      };
  
      // Add the selected checkbox data to the state
      setSelectedCheckboxes(prevState => ({
        ...prevState,
        [index]: selectedCheckbox
      }));
    } else {
      // Remove the unselected checkbox data from the state
      setSelectedCheckboxes(prevState => {
        const newState = { ...prevState };
        delete newState[index];
        return newState;
      });
    }
  };
  useEffect(() => {
  // ทำอะไรก็ตามที่ต้องการเมื่อมีการเปลี่ยนแปลงใน selectedCheckboxes
  console.log('Selected checkboxes:', selectedCheckboxes);
}, [selectedCheckboxes]);

  useEffect(() => {
    // สร้างฟังก์ชันเพื่อดึงข้อมูลจาก API
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://rpa-apiprd.inet.co.th:443/iClaim/list/hospital`);
            const data = response.data;
            // นำ key id ทั้งหมดมาเก็บไว้ใน state
            setKeyIds(data.map(hospital => ({
                id: hospital.id,
                matched: hospital.id === id_hospital,
                token: hospital.token,
            })));
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูลจาก API:", error);
        }
    };

    // เรียกใช้งานฟังก์ชัน fetchData เมื่อ component ถูก mount
    fetchData();

}, [id_hospital]);

const handleSelectAllCheckboxChange = (event) => {
  const isChecked = event.target.checked;
  const newSelectedCheckboxes = isChecked ? countries.map((country, index) => {
    const { id_hospital, img_7: img_7_Array, title } = country;
    const token = keyIds.find((hospital) => hospital.id === id_hospital)?.token;
    return {
      id_hospital,
      img_7_Array,
      token,
      user_name: usernameJson.username,
      menu : "Internal",
      title
    };
  }) : [];

  setSelectedCheckboxes(isChecked ? newSelectedCheckboxes : {});
  setSelectAll(isChecked);

  // Update checkedItems for all checkboxes
  const updatedCheckedItems = {};
  countries.forEach((_, index) => {
    updatedCheckedItems[index] = isChecked;
  });
  setCheckedItems(updatedCheckedItems);
};


  const handleReload = () => {
    window.location.reload();
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
  

  useEffect(() => {
    const initialCheckedItems = {};
    countries.forEach((_, index) => {
      initialCheckedItems[index] = false;
    });
    setCheckedItems(initialCheckedItems);
  }, [countries]);

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
              style={{position:'fixed'}}
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
                //className='Menu-list-icon'
                style={{    
                  padding: isSmallScreen ? '0 5px' : '8px 12px',}} // ปรับขนาดของ MenuItem
                onClick={setting === 'ออกจากระบบ' ? handleLogout : setting === 'Log' ? handleLogClick : setting === 'แก้ไขโรงพยาบาล' ? handleEdithospitalClick : setting === 'กำหนดสิทธิ์' ? handleSetPermissions : null}
                
              >
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
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modalStyle">
          <div className="contentContainer">
            {Object.keys(selectedCheckboxes).map((index) => (
              <div key={index}>
                <img src={selectedCheckboxes[index].img_7_Array} alt={`Image ${index + 1}`} className="imageInModal_Internal" />
                <textarea
                  placeholder="เพิ่มรายละเอียดสำหรับรูปภาพนี้"
                  value={selectedCheckboxes[index].rejectReason || ''} // ใช้ค่า rejectReason ของแต่ละรายการ
                  onChange={(e) => handleRejectReasonChange(e, index)} // เพิ่มการเรียกใช้ฟังก์ชัน handleRejectReasonChange
                  className="rejectReasonInput_Internal"
                  style={{fontFamily:"'Kanit', sans-serif"}}
                />
              </div>
            ))}
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
      {darkBackground && <div className="dark-background"></div>}
      <div className='container'>
        <div className='Fixlocation'>
          <button onClick={handleReload}>
            <img src={HomeIcon} alt="HomeIcon" className='homeicon' />
          </button>
        </div>
        <div className='Fixlocation'>
        <button className="Dashboard-Internal-button" style={{ background: '#2D7951' }}>Dashboard Internal</button>
        </div>
        <div className='Fixlocation'>
        <button className="Dashboard-Internal-button" onClick={handleDashboardExternalClick} >Dashboard External</button>
        </div>
        <div className='Fixlocation'>
          <DatePicker className='Dashboard-Internal-button-date'
            selected={selectedDate} onChange={handleDateChange} dateFormat="dd/MM/yyyy" />
        </div>
      </div>
      <Card className='cardStyle' style={{ backgroundColor: '#D9D9D9', boxShadow: 'none', borderRadius: '15px' }}>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : countries && countries.length > 0 ? (
          <CardContent>
            {countries.map((country, index) => (
              <div key={index} style={{ marginBottom: '20px', textAlign: 'center', position: 'relative' }}>
                <FormGroup row >
                  <FormControlLabel className="custom-checkbox1"
                    control={
                      <label className="custom-checkbox" >
                        <Checkbox
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<CheckCircleIcon />}
                          checked={checkedItems[index] || false}
                          onChange={(event) => handleCheckboxChange(event, index)}
                          size="small"
                        />
                        <span className='checkmark'></span>
                      </label>
                    }
                    label={
                      <Typography
                        style={{
                          fontWeight: 'bold',
                          background: checkedItems[index] ? '#1768C4' : '#FFFF',
                          borderRadius: '10px',
                          borderWidth: '10px',
                          fontFamily: "'Kanit', sans-serif",
                          marginTop: '5px',
                          padding: isSmallScreen ? '5px' : '10px',
                          margin: isSmallScreen ? '0px 5px' : '0px 15px',
                          fontSize: isSmallScreen ? '8px' : '16px',
                          color: checkedItems[index] ? '#FFFF' : 'black',
                        }}
                      >
                        {country.title}
                      </Typography>
                    }
                  />
                </FormGroup>
                <img
                  src={country.img_7}
                  alt={`iClaim${index + 1}`}
                  style={{
                    width: '80%',
                    height: '50%',
                    objectFit: 'cover',
                    borderRadius: '0 0 8px 8px',
                    paddingTop: isSmallScreen ? '3px' : '10px',
                    paddingLeft: isSmallScreen ? '10px' : '0px',
                  }}
                />
              </div>
            ))}
            <FormGroup row>
              <FormControlLabel
                control={
                  <label className="custom-checkbox" >
                    <Checkbox
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      checked={Object.values(checkedItems).every(Boolean)}
                      onChange={handleSelectAllCheckboxChange}
                      size="small"
                    />
                    <span className='checkmark'></span>
                  </label>

                }
                label={
                  <Typography
                    style={{
                      fontWeight: 'bold',
                      fontFamily: "'Kanit', sans-serif",
                      marginTop: '5px',
                      margin: isSmallScreen ? '0px 0px 2px' : '0px 7px',
                      fontSize: isSmallScreen ? '10px' : '18px',
                    }}
                  >
                    Select All
                  </Typography>
                }
              />
            </FormGroup>
          </CardContent>
        ) : (
          <p style={{ textAlign: "center", fontFamily: "'Kanit', sans-serif", fontSize: isSmallScreen ? '8px' : '20px', }}>ไม่มีข้อมูลสําหรับวันที่เลือก</p>
        )}
      </Card>
      {!loading && countries && countries.length > 0 && (role === 'admin' || role === 'user' || role === 'Admin' || role === 'User') && (
        <div className='container-approve-reject'>
          <div className='Fixlocation-approve-reject'>
            <button className="button-Approve" onClick={handleApproveButtonClick}>Approve</button>
          </div>
          <div className='Fixlocation-approve-reject'>
            <button className="button-Reject" onClick={handleRejectButtonClick}>Reject</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Internal;
