//External 1
import React, { useState, useEffect } from 'react';
import './Style/In_inet.css';
import axios from "axios";
import AppBar from '@mui/material/AppBar';
import Checkbox from '@mui/material/Checkbox';
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
import Button from '@mui/material/Button';
import employee from './images-iclaim/employee.png';
import HomeIcon from './images-iclaim/home-regular-60.png';
import { useNavigate } from 'react-router-dom';
import SuccessIcon from './images-iclaim/checked.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Modal from '@mui/material/Modal';
import Swal from 'sweetalert2';


const Ininet = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [notification, setNotification] = useState({ message: '', show: false });
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const usernameJson = JSON.parse(localStorage.getItem('username'));
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [putdate, setPutDate] = useState(selectedDate.toISOString().slice(0, 10));
    const [totalItems, setTotalItems] = useState(0);
    const [currentApiDate, setCurrentApiDate] = useState(new Date().toISOString().slice(0, 10)); // New state for API date
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const role = localStorage.getItem("role")
    const [selectedItemsDetails, setSelectedItemsDetails] = useState({});
    const [rejectReason, setRejectReason] = useState('');
    const [rejectedImage, setRejectedImage] = useState(null);

    const handleDashboardInternalClick = () => {
        navigate('/Dashboard/Internal');
        window.location.reload();
    };
    const handleReportTeamIClaim = () => {
        navigate('/Report/Team/iClaim')
        window.location.reload();
      }
      const handleInternalv2 = () => {
        navigate('/Internal/v2')
        window.location.reload();
      }
    const handleDashboardExternalClick = () => {
        navigate('/Dashboard/External');
        window.location.reload();
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleHospitalNews = () => {
        navigate('/Hospital/News');
        window.location.reload();
    };

    const handleEdithospitalClick = () => {
        navigate('/Edit/Hospital');
        window.location.reload();
    };

    const handleLogClick = () => {
        navigate('/Log');
    };

    const handleInternaliNetClick = () => {
        navigate('/Internal/inet');
        window.location.reload();
    };

    const handleSetPermissions = () => {
        navigate('/Set/Permission');
        window.location.reload();
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
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
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        localStorage.removeItem("account_id");
        localStorage.removeItem("user_role");
        localStorage.removeItem("role");
        window.location.href = "/";
    };
    const handleExternal3 = () => {
        navigate('/Dashboard/External3')
        window.location.reload();
    }
    const handleReload = () => {
        navigate('/Dashboard/External');
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = date.toISOString().slice(0, 10);
        setPutDate(formattedDate);
        
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        const formattedApiDate = `${nextDay.getDate().toString().padStart(2, '0')}${(nextDay.getMonth() + 1).toString().padStart(2, '0')}${nextDay.getFullYear()}`;
        setCurrentApiDate(formattedApiDate);
    
        axios.get('https://rpa-apiprd.inet.co.th/iClaim/get/img', {
            params: {
                date_on: formattedApiDate,
                id_process: 'Src_000001'
            }
        })
        .then(response => {
            console.log("API response:", response.data);
            setImages(response.data);
            setTotalItems(response.data.length);
        })
        .catch(error => {
            console.error("Error fetching data from API:", error);
        });
    };
    
    useEffect(() => {
        const currentDate = new Date();
        const previousDay = new Date(currentDate);
        previousDay.setDate(currentDate.getDate() - 1);
    
        setSelectedDate(previousDay); // วันที่ที่แสดง
        const formattedDate = previousDay.toISOString().slice(0, 10);
        setPutDate(formattedDate);
        console.log("Initial displayed date:", formattedDate);
        const formattedApiDate = `${currentDate.getDate().toString().padStart(2, '0')}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getFullYear()}`;
        setCurrentApiDate(formattedApiDate);
    
        axios.get('https://rpa-apiprd.inet.co.th/iClaim/get/img', {
            params: {
                date_on: formattedApiDate,
                id_process: 'Src_000001'
            }
        })
        .then(response => {
            console.log("API response:", response.data);
            setImages(response.data);
            setTotalItems(response.data.length);
        })
        .catch(error => {
            console.error("Error fetching data from API:", error);
        });
    }, []);

    const handleApproveButtonClick = async () => {
        console.log('Click Approve');
        const mappedImages = Array.from(selectedImages).map(id => {
            const image = images.find(img => img.doc_id === id);
            return {
                doc_id: image.doc_id,
                title: image.title_name,
                src: image.src_img,
                username : usernameJson.username
            };
        });

        const data = {
            message: mappedImages
        };
        console.log('messages : ', data);
        try {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                timer: 2000,
                showConfirmButton: false
            });
            //const response = await axios.post('http://localhost:443/Internal/send/data/inet', data);
            const response = await axios.post('https://rpa-apiprd.inet.co.th:443/Internal/send/data/inet', data);
            console.log('API response:', response.data);

            const loginternal = mappedImages.map(async (image) => {
                const logData = {
                    doc_name: "-",
                    status: "Approved",
                    user_name: usernameJson.username,
                    remark:image.title,
                    data_type: "Internal"
                };
            console.log("logData : ",logData)
            await axios.post("https://rpa-apiprd.inet.co.th:443/iClaim/insert/log", logData);
            console.log("Log data inserted successfully for", image.title);
            })
            window.location.reload();
            await Promise.all(loginternal);

        } catch (error) {
            console.error('Error sending data to API:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to send data!',
                timer: 2000,
                showConfirmButton: false
            });
        }
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
        setSelectedItemsDetails(prevState => ({
          ...prevState,
          [index]: {
            ...prevState[index],
            rejectReason: value
          }
        }));
      };
    
    const handleRejectConfirm = async () => {
        const isComplete = Object.keys(selectedItemsDetails).every(
            (key) => selectedItemsDetails[key].rejectReason && selectedItemsDetails[key].rejectReason.trim() !== ""
        );

        if (!isComplete) {
            alert("กรุณากรอกข้อมูลในทุกช่องก่อนยืนยัน");
            return;
        }
        const newDataArray = Object.keys(selectedItemsDetails).map((doc_id) => ({
            approve:selectedItemsDetails[doc_id].approve,
            date_on:selectedItemsDetails[doc_id].date_on, 
            doc_id:selectedItemsDetails[doc_id].doc_id, 
            id_process:selectedItemsDetails[doc_id].id_process, 
            insert_approve:selectedItemsDetails[doc_id].insert_approve, 
            insert_time:selectedItemsDetails[doc_id].insert_time, 
            src_img:selectedItemsDetails[doc_id].src, 
            title:selectedItemsDetails[doc_id].title_name, 
            user_approve:selectedItemsDetails[doc_id].user_approve, 
            rejectReason:selectedItemsDetails[doc_id].rejectReason,
            user_name:selectedItemsDetails[doc_id].user_name,
            menu:'Internal'
        }))
        console.log("newDataArray : " ,newDataArray)

        try {
            const selectedHospitalsArrayReject = Object.values(newDataArray);
            const data ={
                message : selectedHospitalsArrayReject
            }
            console.log('Data : ', data)

            //send date api reject to ake
            const response = await axios.post('https://rpa-apiprd.inet.co.th:443/rpa/iclaim/RejectImageInternalV2',data)
            console.log(`Data send success to api ake : `, response.data);
            const logPromises = selectedHospitalsArrayReject.map(async (checkbox) => {
                const logData = {
                doc_name: "-",
                status: "Reject",
                user_name: usernameJson.username,
                remark: checkbox.title,
                data_type: "Internal"
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
          setSelectedItemsDetails({});
          setOpenModal(false);
          window.location.reload();
    };

    const handleCheckboxChange = (doc_id) => {
        setSelectedImages(prev => {
            const updated = new Set(prev);
            const isSelected = updated.has(doc_id);
            if (isSelected) {
                updated.delete(doc_id);
                const newDetails = { ...selectedItemsDetails };
                delete newDetails[doc_id];
                setSelectedItemsDetails(newDetails);
            } else {
                updated.add(doc_id);
                const selectedItem = images.find(img => img.doc_id === doc_id);
                setSelectedItemsDetails(prevDetails => ({
                    ...prevDetails,
                    [doc_id]: {
                        approve: selectedItem.approve,
                        date_on: selectedItem.date_on,
                        doc_id: selectedItem.doc_id,
                        id_process: selectedItem.id_process,
                        insert_approve: selectedItem.insert_approve,
                        insert_time: selectedItem.insert_time,
                        title_name: selectedItem.title_name,
                        src: selectedItem.src_img,
                        user_name: usernameJson.username,
                        user_approve:selectedItem.user_approve
                    }
                }));
            }
            if (updated.size === images.length) {
                setSelectAll(true);
            } else {
                setSelectAll(false);
            }
            return updated;
        });
    };
    
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedImages(new Set());
            setSelectedItemsDetails({});
        } else {
            const allDocIds = new Set(images.map(item => item.doc_id));
            setSelectedImages(allDocIds);
            const allDetails = images.reduce((acc, item) => {
                acc[item.doc_id] = {
                    approve: item.approve,
                    date_on: item.date_on,
                    doc_id: item.doc_id,
                    id_process: item.id_process,
                    insert_approve: item.insert_approve,
                    insert_time: item.insert_time,
                    title_name: item.title_name,
                    src: item.src_img,
                    username: usernameJson.username,
                    user_approve: item.user_approve
                };
                return acc;
            }, {});
            setSelectedItemsDetails(allDetails);
        }
        setSelectAll(!selectAll);
    };
    useEffect(() => {
         console.log('Selected checkboxes:', selectedItemsDetails);
      }, [selectedItemsDetails]);
    

    const selectedCount = selectedImages.size;

    return (
        <div className='containerStype'>
            <AppBar position="static" className='appBarStyle' style={{ backgroundColor: 'white', boxShadow: 'none' }}>
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
                            {['External 3','Internal INET','Internal V2','Report Team Iclaim','กำหนดสิทธิ์','แก้ไขโรงพยาบาล' , 'Log','ข่าวสารโรงพยาบาล', 'ออกจากระบบ'].map((setting) => (
                                <MenuItem key={setting} style={{ padding: isSmallScreen ? '0 5px' : '5px 2px' }} onClick={setting === 'ออกจากระบบ' ? handleLogout : setting === 'แก้ไขโรงพยาบาล' ? handleEdithospitalClick : setting === 'กำหนดสิทธิ์' ? handleSetPermissions : setting === 'Log' ? handleLogClick : setting === 'Internal INET' ? handleInternaliNetClick : setting === 'ข่าวสารโรงพยาบาล' ? handleHospitalNews : setting === 'Internal V2' ? handleInternalv2 : setting === 'Report Team Iclaim' ? handleReportTeamIClaim : setting === 'External 3'? handleExternal3 : null}>
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
                <div className="modalStyle">
                <div className="contentContainer">
                    {Object.keys(selectedItemsDetails).map((index) => (
                    <div key={index}>
                        <img src={selectedItemsDetails[index].src} alt={`Image ${index + 1}`} className="imageInModal_External" />
                        <textarea
                        placeholder="เพิ่มรายละเอียดสำหรับรูปภาพนี้"
                        value={selectedItemsDetails[index].rejectReason || ''}
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
            <div className='container'>
                <div className='Fixlocation'>
                    <button onClick={handleReload}>
                        <img src={HomeIcon} alt="HomeIcon" className='homeicon' />
                    </button>
                </div>
                <div className='Fixlocation'>
                    <button className="Dashboard-Internal-button" onClick={handleDashboardInternalClick} style={{ lineHeight: '1' }}>External 1</button>
                </div>
                <div className='Fixlocation'>
                    <button className="Dashboard-Internal-button" onClick={handleDashboardExternalClick} style={{ lineHeight: '1' }}>External 2</button>
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
                Internal INET
            </div>
            <Card className='cardStyle_Log cardContainer' style={{ backgroundColor: '#D9D9D9', boxShadow: 'none', borderRadius: '15px' }}>
                <CardContent className='CardScrallber-internal'>
                    {images.length > 0 ? (
                        images.map((item) => (
                            <div key={item.doc_id} style={{ padding: '10px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <label className="custom-checkbox-internal-1" style={{ marginRight: isSmallScreen ?'2px' : '5px' ,marginBottom: isSmallScreen ?'3px' : '2px' }}>
                                        <label className="custom-checkbox-internal-internalv1">
                                            <Checkbox
                                                icon={<RadioButtonUncheckedIcon />}
                                                checkedIcon={<CheckCircleIcon />}
                                                type="checkbox"
                                                checked={selectedImages.has(item.doc_id)}
                                                onChange={() => handleCheckboxChange(item.doc_id)}
                                                size="small"
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </label>
                                    <Typography
                                        variant="subtitle1"
                                        style={{
                                            fontWeight: 'bold',
                                            background: selectedImages.has(item.doc_id) ? '#1768C4' : '#FFFF',
                                            borderRadius: '10px',
                                            border: '0.1px solid transparent',
                                            padding: isSmallScreen ? '5px 8px' : '5px 10px',
                                            marginBottom: '5px',
                                            fontSize: isSmallScreen ? '6px' : '16px',
                                            color: selectedImages.has(item.doc_id) ? '#FFFF' : 'black',
                                            maxWidth: '80%',
                                            display: 'inline-block',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {item.title_name}
                                    </Typography>
                                </div>
                                <img
                                    src={item.src_img}
                                    alt={item.title_name}
                                    style={{
                                        width: '70%',
                                        borderRadius: '15px',
                                        display: 'block',
                                        margin: '0 auto',
                                    }}
                                />
                            </div>
                        ))
                    ) : (
                        <Typography variant="body1" style={{ fontFamily: "'Kanit', sans-serif",textAlign:'center' }}>
                            ไม่มีข้อมูลสําหรับวันที่เลือก
                        </Typography>
                    )}
                </CardContent>
            </Card>
            {images.length > 0 && (role === 'admin' || role === 'user' || role === 'Admin' || role === 'User') && (
            <div className='selectAllContainer' style={{fontfamily: "'Kanit', sans-serif" ,marginRight: isSmallScreen ? '60%' : ''}}>
                    <label className="custom-checkbox-internal-internalv1" >
                        <Checkbox
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<CheckCircleIcon />}
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                            size="small"
                            className="custom-checkbox-internal-internalv1"
                        />
                        <span className='checkmark'></span>
                    </label>
                    <Typography
                    style={{
                      fontWeight: 'bold',
                      fontFamily: "'Kanit', sans-serif",
                      marginTop: '5px',
                      margin: isSmallScreen ? '0px 10px 2px' : '0px 7px',
                      fontSize: isSmallScreen ? '10px' : '18px',
                    }}
                  >
                     Select All ({selectedCount}/{totalItems})
                  </Typography>
                </div>
            )}
                {images.length > 0 && (role === 'admin' || role === 'user' || role === 'Admin' || role === 'User') && (
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

export default Ininet;