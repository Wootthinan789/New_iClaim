import React, { useState, useEffect } from 'react';
import  axios  from 'axios';
import './Style/Profile.css';
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
// import FailIcon from './images-iclaim/cancel.png';
import { useNavigate } from 'react-router-dom';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

//let username = "วุฒินันท์ ปรางมาศ";
const settings = ['External 3','Internal INET','Internal V2','Report Team Iclaim','กำหนดสิทธิ์','แก้ไขโรงพยาบาล' , 'Log','ข่าวสารโรงพยาบาล', 'ออกจากระบบ'];

const External3 = () => {
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
  const [selectedCheckboxCount, setSelectedCheckboxCount] = useState(0);

  const [selectAll, setSelectAll] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const role = localStorage.getItem("role")

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '');
  
    const month = formattedDate.slice(2, 4); // ดึงค่าเดือน
    const year = formattedDate.slice(4); // ดึงค่าปี
    const thaiMonth = convertMonthToThai(month);
  
    setPutDate(formattedDate);
    console.log("formattedDate : ", formattedDate);
    console.log("เดือนภาษาไทย : ", thaiMonth, "ปี : ", year);
  };
  
  
  useEffect(() => {
    const formattedDate = selectedDate
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '');
    setPutDate(formattedDate);
    console.log("formattedDate : ",formattedDate)
  }, [selectedDate]);
  
  const convertMonthToThai = (month) => {
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", 
      "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", 
      "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return months[parseInt(month, 10) - 1];
  };
  
  useEffect(() => {
    const currentDate = new Date();
    const previousDay = new Date(currentDate);
    previousDay.setDate(currentDate.getDate() - 1);
    setSelectedDate(previousDay);
  }, []);

  const navigate = useNavigate();

  const handleDashboardInternalClick = () => {
      navigate('/Dashboard/Internal')
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
  
  const handleRejectConfirm = async () => {
    const isComplete = Object.keys(selectedCheckboxes).every(
    (key) => selectedCheckboxes[key].rejectReason && selectedCheckboxes[key].rejectReason.trim() !== ""
    );
        
    if (!isComplete) {
        alert("กรุณากรอกข้อมูลในทุกช่องก่อนยืนยัน");
    return;
    }
    const newDataArray = Object.keys(selectedCheckboxes).map((index) => ({
      doc_id: selectedCheckboxes[index].id_hospital,
      date_on: putdate,
      src_img: selectedCheckboxes[index].src_img_Array,
      token: selectedCheckboxes[index].token,
      user_approve: selectedCheckboxes[index].user_name,
      user_name: selectedCheckboxes[index].user_name,
      menu: selectedCheckboxes[index].menu,
      title: selectedCheckboxes[index].title,
      rejectReason: selectedCheckboxes[index].rejectReason
    }));
    try {
      const selectedHospitalsArrayReject = Object.values(newDataArray);
      const data = {
        message: selectedHospitalsArrayReject
      };
      console.log("data : ",data)
      const response = await axios.post('https://rpa-apiprd.inet.co.th:443/rpa/iclaim/RejectImageExternalV3', data);
      console.log("Data sent successfully ake : ", response.data);
      await axios.post("https://rpa-apiprd.inet.co.th:443/send-message/Reject", data);
      console.log("Data sent successfully send message Reject");
      const logPromises = selectedHospitalsArrayReject.map(async (checkbox) => {
        const logData = {
          doc_name: "-",
          status: "Reject",
          user_name: usernameJson.username,
          remark: checkbox.title,
          data_type: "External 3"
        };
  
      await axios.post("https://rpa-apiprd.inet.co.th:443/iClaim/insert/log", logData);
      console.log("Log data inserted successfully");
    });
    await Promise.all(logPromises);
      await axios.post("https://rpa-apiprd.inet.co.th:443/send-message/alertReject", data);
      console.log("Data sent successfully send message alert Reject");

    } catch (error) {
      console.error('Error sending data:', error.message);
    }
    setSelectedCheckboxes({});
    setOpenModal(false);
    // window.location.reload();
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleApproveButtonClick = async () => {
    if (Object.keys(selectedCheckboxes).length === 0) {
      console.error('No data selected for processing');
      return;
    }
      setNotification({ message: 'Successfully approved', show: true });
      setDarkBackground(true);

  
    setTimeout(() => {
      setNotification({ message: '', show: false });
      setDarkBackground(false);
      window.location.reload();
    }, 2500);
  
    const selectedHospitalsArray = Object.values(selectedCheckboxes);
    const data = {
      message: selectedHospitalsArray
    };
    console.log(data);
  
    (async () => {
      try {
        const logPromises = selectedHospitalsArray.map(async (checkbox) => {
          const logData = {
            doc_name: "-",
            status: "Approved",
            user_name: usernameJson.username,
            remark: checkbox.title,
            data_type: "External 3"
          };
          await axios.post("https://rpa-apiprd.inet.co.th:443/iClaim/insert/log", logData);
          console.log("Log data inserted successfully for", checkbox.title);
        });
  
        // await axios.post("http://localhost:443/send-message/uat", data);
        await axios.post("https://rpa-apiprd.inet.co.th:443/prd/send-message/mail", data);
        console.log("Data sent successfully send message");
  
        await Promise.all(logPromises);
      } catch (error) {
        console.error('Error:', error.message);
      }
    })();
  };

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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const handleReportTeamIClaim = () => {
    navigate('/Report/Team/iClaim')
    window.location.reload();
  }
  const handleInternalv2 = () => {
    navigate('/Internal/v2')
    window.location.reload();
  }

  const handleExternal3 = () => {
    navigate('/Dashboard/External3')
    window.location.reload();
  }

  const handleLogClick = () => {
    navigate('/Log')
  }

  const handleHospitalNews = () => {
    navigate('/Hospital/News')
    window.location.reload();
  }

  const handleEdithospitalClick = () => {
    navigate('/Edit/Hospital')
    window.location.reload();
  }
  const handleDashboardExternalClick = () => {
    navigate('/Dashboard/External')
    window.location.reload();
};
  const handleInternaliNetClick = () => {
    navigate('/Internal/inet')
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
    setSelectedCheckboxCount(prevCount =>
      isChecked ? prevCount + 1 : prevCount - 1
    );

    
    if (isChecked) {
      const checkboxData = countries[index];
      const id_hospital = checkboxData.id_hospital;
      const src_img_Array = checkboxData.src_img;
      const title = checkboxData.title_name;
      const token = keyIds.find((hospital) => hospital.id === id_hospital)?.token;

      const month = putdate.slice(2, 4);
      const year = putdate.slice(4);
      const thaiMonth = convertMonthToThai(month);

      const selectedCheckbox = {
        id_hospital: id_hospital,
        src_img_Array: src_img_Array,
        token: token,
        user_name: usernameJson.username,
        menu : "External 3",
        title: `${title} ยอดเคลมประจำเดือน ${thaiMonth} ${year}`,
        Email: keyIds.find((hospital) => hospital.id === id_hospital)?.Email,
        hospital: keyIds.find((hospital) => hospital.id === id_hospital)?.hospital
      };
      setSelectedCheckboxes(prevState => ({
        ...prevState,
        [index]: selectedCheckbox
      }));
    } else {
      setSelectedCheckboxes(prevState => {
        const newState = { ...prevState };
        delete newState[index];
        return newState;
      });
    }
  };
  useEffect(() => {
   console.log('Selected checkboxes:', selectedCheckboxes);
}, [selectedCheckboxes]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`https://rpa-apiprd.inet.co.th:443/iClaim/list/hospital`);
            const data = response.data;
            setKeyIds(data.map(hospital => ({
                id: hospital.id,
                matched: hospital.id === id_hospital,
                hospital : hospital.hospital,
                token: hospital.token,
                Email: hospital.Email,
            })));
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูลจาก API:", error);
        }
    };
    fetchData();

}, [id_hospital]);

const handleSelectAllCheckboxChange = (event) => {
  const isChecked = event.target.checked;
  const newSelectedCheckboxes = isChecked ? countries.map((country, index) => {
    const { id_hospital, src_img : src_img_Array, title_name : title } = country;
    const token = keyIds.find((hospital) => hospital.id === id_hospital)?.token;
    const month = putdate.slice(2, 4);
    const year = putdate.slice(4);
    const thaiMonth = convertMonthToThai(month);
    return {
      id_hospital,
      src_img_Array,
      token,
      user_name: usernameJson.username,
      menu : "External 3",
      title: `${title} ยอดเคลมประจำเดือน ${thaiMonth} ${year}`,
      Email: keyIds.find((hospital) => hospital.id === id_hospital)?.Email,
      hospital: keyIds.find((hospital) => hospital.id === id_hospital)?.hospital
    };
  }) : [];

  setSelectedCheckboxes(isChecked ? newSelectedCheckboxes : {});
  setSelectAll(isChecked);
  const updatedCheckedItems = {};
  countries.forEach((_, index) => {
    updatedCheckedItems[index] = isChecked;
  });
  setCheckedItems(updatedCheckedItems);
  setSelectedCheckboxCount(isChecked ? countries.length : 0);
};


  const handleReload = () => {
    window.location.reload();
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {

        const response = await fetch(`https://rpa-apiprd.inet.co.th/iClaim/get/img?id_process=Src_000004&date_on=${putdate}`);
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
                <img src={selectedCheckboxes[index].src_img_Array} alt={`Image ${index + 1}`} className="imageInModal_External" />
                <textarea
                  placeholder="เพิ่มรายละเอียดสำหรับรูปภาพนี้"
                  value={selectedCheckboxes[index].rejectReason || ''}
                  onChange={(e) => handleRejectReasonChange(e, index)}
                  className="rejectReasonInput_External"
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
          <button className="Dashboard-Internal-button" onClick={handleDashboardInternalClick}>External 1</button>
        </div>
        <div className='Fixlocation'>
          <button className="Dashboard-Internal-button" onClick={handleDashboardExternalClick}>External 2</button>
        </div>
        <div className='Fixlocation'>
          <DatePicker className='Dashboard-Internal-button-date'
            selected={selectedDate} onChange={handleDateChange} dateFormat="dd/MM/yyyy" />
        </div>
      </div>
      <div style={{
                textAlign: 'center',
                fontFamily: "'Kanit', sans-serif",
                fontSize: isSmallScreen ? '8px' : '18px',
                marginBottom : isSmallScreen ? '6px' : '12px'
            }}>
                External 3
            </div>
      <Card className='cardStyle_Log cardContainer' style={{ backgroundColor: '#D9D9D9', boxShadow: 'none', borderRadius: '15px' }}>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : countries && countries.length > 0 ? (
          <CardContent className='CardScrallber'>
            {countries.map((country, index) => (
              <div key={index}                
              style={{
                marginBottom: '20px',
                textAlign: 'center',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
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
                          fontFamily: isSmallScreen ? "'Bai Jamjuree', sans-serif" : "'Kanit', sans-serif",
                          marginTop: '5px',
                          padding: isSmallScreen ? '5px' : '10px',
                          margin: isSmallScreen ? '0px 5px' : '0px 15px',
                          fontSize: isSmallScreen ? '6px' : '16px',
                          color: checkedItems[index] ? '#FFFF' : 'black',
                        }}
                      >
                        {index + 1}. {country.title_name}
                      </Typography>
                    }
                  />
                </FormGroup>
                <img
                  src={country.src_img}
                  alt={`iClaim${index + 1}`}
                  style={{
                    width: '70%',
                    height: '50%',
                    objectFit: 'cover',
                    borderRadius: '0 0 8px 8px',
                    paddingTop: isSmallScreen ? '3px' : '10px',
                    paddingLeft: isSmallScreen ? '10px' : '0px',
                  }}
                />
              </div>
            ))}

          </CardContent>
        ) : (
          <p style={{ textAlign: "center", fontFamily: "'Kanit', sans-serif", fontSize: isSmallScreen ? '8px' : '20px', }}>ไม่มีข้อมูลสําหรับวันที่เลือก</p>
        )}
      </Card>
      {!loading && countries && countries.length > 0 && (role === 'admin' || role === 'user' || role === 'Admin' || role === 'User') && (
      <div className='SelectallStyle' style={{fontfamily: "'Kanit', sans-serif" ,marginRight: isSmallScreen ? '50%' : '75%'}}>
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
                      margin: isSmallScreen ? '0px 10px 2px' : '0px 7px',
                      fontSize: isSmallScreen ? '10px' : '18px',
                    }}
                  >
                    Select All ({selectedCheckboxCount}/{countries.length})
                  </Typography>
                }
              />
        </FormGroup>
      </div>
      )}
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

export default External3;