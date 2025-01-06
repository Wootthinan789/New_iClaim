import React, { useState, useEffect, useRef } from 'react';
import './Style/In_inet.css';
import AppBar from '@mui/material/AppBar';
import './Style/Hospital_News.css';
import Box from '@mui/material/Box';
import axios from 'axios';
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
import 'react-datepicker/dist/react-datepicker.css';
import logo from './images-iclaim/download (2).png';
import employee from './images-iclaim/employee.png';
import HomeIcon from './images-iclaim/home-regular-60.png';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useMediaQuery, useTheme, TextField, Button, Snackbar, Alert, Dialog, DialogContent, DialogActions ,CircularProgress,Select,InputLabel,FormControl,DialogTitle,DialogContentText} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Hospital_News = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const usernameJson = JSON.parse(localStorage.getItem('username'));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [checkedItems, setCheckedItems] = useState({});
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [MessageText, setMessageText] = useState('')
    const [charCount, setCharCount] = useState(0);
    const [fileNames, setFileNames] = useState([]);

    const [previewImage, setPreviewImage] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isFirstChecked, setIsFirstChecked] = useState(true);
    const [isSecondChecked, setIsSecondChecked] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const fileInputRefImage = useRef(null);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [hospitalName, setHospitalName] = useState('');
    const [token, setToken] = useState('');

    const [hospitalData, setHospitalData] = useState([]);
    const [isListPopupOpen, setIsListPopupOpen] = useState(false);
    const [hospitalType, setHospitalType] = useState('');

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState(null);

    const handleOpenPopup = () => setIsPopupOpen(true);
    const handleClosePopup = () => setIsPopupOpen(false);
    const handleOpenListPopup = () => {
        setIsListPopupOpen(true);
        fetchHospitalData(hospitalType);
    };

    const handleDeleteHospital = (hospital) => {
        //console.log("Hospital to delete:", hospital);
        setSelectedHospital(hospital);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteHospital = async () => {
        if (!selectedHospital) {
            console.error("No hospital selected for deletion");
            return;
        }
    
        const payload = {
            list_tpye: selectedHospital.list_type,
            Hospital_: selectedHospital.Hospital
        };
    
        console.log("Payload being sent:", payload);
    
        try {
            //const response = await fetch("http://localhost:443/delete/hospital/post", {
            const response = await fetch("https://rpa-apiprd.inet.co.th/delete/hospital/post", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify(payload)
            });
    
            if (response.ok) {
                console.log("Delete successful");
                setHospitalData((prevData) =>
                    prevData.filter((hospital) => hospital.id !== selectedHospital.id)
                );
                try {
                    const alertResponse = await axios.post("https://rpa-apiprd.inet.co.th/Alert/delete/data", payload);
                    console.log("API Alert Response:", alertResponse);
    
                    if (alertResponse.status === 200) {
                        console.log("แจ้งเตือนสำเร็จ");
                    } else {
                        console.error("ไม่สามารถแจ้งเตือนได้:", alertResponse);
                    }
                } catch (alertError) {
                    console.error("เกิดข้อผิดพลาดขณะเรียก API แจ้งเตือน:", alertError);
                }
                handleClosePopup();
                resetFormFields(); 
                window.location.reload();
            } else {
                console.error("Failed to delete hospital", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error deleting hospital:", error);
        } finally {
            console.log("Closing all popups");
            setIsDeleteConfirmOpen(false);
            setIsListPopupOpen(false);
            console.log("isDeleteConfirmOpen:", isDeleteConfirmOpen);
            console.log("isListPopupOpen:", isListPopupOpen);
        }
    };
    
    
    const handleCancelDelete = () => {
        setIsDeleteConfirmOpen(false);
    };
    
    const fetchHospitalData = async (type) => {
        setLoading(true);
        try {
            const timestamp = new Date().getTime();
            //const response = await fetch(`http://localhost:443/get/hospital/post?type=${type}&_=${timestamp}`);
            const response = await fetch(`https://rpa-apiprd.inet.co.th/get/hospital/post?type=${type}&_=${timestamp}`);
            if (response.ok) {
                const data = await response.json();
                const updatedData = data.map((hospital) => ({
                    ...hospital,
                    list_type: type,
                }));
                console.log('Updated data:', updatedData);
    
                setHospitalData(updatedData);
            } else {
                console.error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleTypeChange = (event) => {
        const selectedType = event.target.value;
        setHospitalType(selectedType);
        fetchHospitalData(selectedType);
    };

    const handleCloseListPopup = () => {
        setIsListPopupOpen(false);
        setHospitalData([]);
    };

    const handleAddHospital = async () => {
        if (!hospitalType || !hospitalName || !token) {
            setSnackbarMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }
    
        const newHospital = {
            list_tpye: hospitalType,
            Hospital_: hospitalName,
            Token_: token,
        };
        console.log("ข้อมูลโรงพยาบาลที่เพิ่ม:", newHospital);
    
        try {
            const response = await axios.post("https://rpa-apiprd.inet.co.th/insert/hospital/post", newHospital);
            console.log("API Response:", response);
    
            if (response.status === 200) {
                console.log("เพิ่มโรงพยาบาลสำเร็จ:", response.data);
                setSnackbarMessage('เพิ่มโรงพยาบาลสำเร็จ!');
                setSnackbarSeverity('success');
                setHospitalData((prevData) => [...prevData, newHospital]);
                try {
                    const alertResponse = await axios.post("https://rpa-apiprd.inet.co.th/Alert/insert/data", newHospital);
                    console.log("API Alert Response:", alertResponse);
    
                    if (alertResponse.status === 200) {
                        console.log("แจ้งเตือนสำเร็จ");
                    } else {
                        console.error("ไม่สามารถแจ้งเตือนได้:", alertResponse);
                    }
                } catch (alertError) {
                    console.error("เกิดข้อผิดพลาดขณะเรียก API แจ้งเตือน:", alertError);
                }
                handleClosePopup();
                resetFormFields(); 
                window.location.reload();
            } else {
                setSnackbarMessage('ไม่สามารถเพิ่มโรงพยาบาลได้');
                setSnackbarSeverity('error');
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            setSnackbarMessage('รายชื่อโรงพยาบาลนี้มีอยู่แล้ว!!');
            setSnackbarSeverity('error');
        }
        setOpenSnackbar(true);
    };    

    const resetFormFields = () => {
        setHospitalType('');
        setHospitalName('');
        setToken('');
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleFirstToggle = () => {
        setIsFirstChecked(true);
        setIsSecondChecked(false);
        setCheckedItems({});
        setSelectedCheckboxes({});
    };
    
    const handleSecondToggle = () => {
        setIsFirstChecked(false);
        setIsSecondChecked(true);
        setCheckedItems({});
        setSelectedCheckboxes({});
    };
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

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        localStorage.removeItem("account_id");
        localStorage.removeItem("user_role");
        localStorage.removeItem("role");
        window.location.href = "/";
    };

    const handleReload = () => {
        navigate('/Dashboard/External');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let endpoint = '';
                const timestamp = new Date().getTime();
                
                if (isFirstChecked) {
                    endpoint = `https://rpa-apiprd.inet.co.th:443/get/data/hospital/government?_=${timestamp}`;
                } else if (isSecondChecked) {
                    endpoint = `https://rpa-apiprd.inet.co.th:443/get/data/hospital/private?_=${timestamp}`;
                }
                
                const response = await axios.get(endpoint);
                setData(response.data);
                setLoading(false);
                console.log(`Data from ${endpoint}:`, response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
    
        fetchData();
    }, [isFirstChecked, isSecondChecked]);

    const handleCheckboxChange = (event, item) => {
        const isChecked = event.target.checked;
        const hospitalKey = isFirstChecked ? item.Hospital_Government : item.Hospital_Private;
        const updatedCheckedItems = { ...checkedItems, [hospitalKey]: isChecked };

        let hospitalKeyField, tokenKeyField;
        if (isFirstChecked) {
            hospitalKeyField = 'Hospital_Government';
            tokenKeyField = 'Token_Government';
        } else if (isSecondChecked) {
            hospitalKeyField = 'Hospital_Private';
            tokenKeyField = 'Token_Private';
        }

        const selectedItem = item;
        const { [hospitalKeyField]: hospital, [tokenKeyField]: token } = selectedItem;

        const updatedSelectedCheckboxes = { ...selectedCheckboxes };
        if (isChecked && !updatedSelectedCheckboxes[hospitalKey]) {
            updatedSelectedCheckboxes[hospitalKey] = {
                Hospital: hospital,
                Token: token,
                user_name: usernameJson.username,
            };
        } else if (!isChecked && updatedSelectedCheckboxes[hospitalKey]) {
            delete updatedSelectedCheckboxes[hospitalKey];
        }

        setCheckedItems(updatedCheckedItems);
        setSelectedCheckboxes(updatedSelectedCheckboxes);

        if (Object.keys(updatedCheckedItems).length === filteredData.length) {
            setCheckedItems((prevCheckedItems) => ({
                ...prevCheckedItems,
                all: true,
            }));
        } else {
            setCheckedItems((prevCheckedItems) => {
                const { all, ...rest } = prevCheckedItems;
                return rest;
            });
        }

        console.log('Current selected checkboxes:', updatedSelectedCheckboxes);
    };

    const handleSelectAll = (event) => {
        if (Object.keys(checkedItems).length === filteredData.length) {
            setCheckedItems({});
            setSelectedCheckboxes({});
        } else {
            const newCheckedItems = {};
            const newSelectedCheckboxes = {};
    
            if (event.target.checked) {
                filteredData.forEach((item) => {
                    const hospitalKey = isFirstChecked ? item.Hospital_Government : item.Hospital_Private;
                    newCheckedItems[hospitalKey] = true;
                    let hospitalKeyField, tokenKeyField;
                    if (isFirstChecked) {
                        hospitalKeyField = 'Hospital_Government';
                        tokenKeyField = 'Token_Government';
                    } else if (isSecondChecked) {
                        hospitalKeyField = 'Hospital_Private';
                        tokenKeyField = 'Token_Private';
                    }
                    const { [hospitalKeyField]: hospital, [tokenKeyField]: token } = item;
                    newSelectedCheckboxes[hospitalKey] = {
                        Hospital: hospital,
                        Token: token,
                        user_name: usernameJson.username,
                    };
                });
            }
    
            setCheckedItems(newCheckedItems);
            setSelectedCheckboxes(newSelectedCheckboxes);
            console.log('Selected items:', newSelectedCheckboxes);
        }
    };

    const filteredData = data.filter(item => {
        const governmentHospital = item.Hospital_Government?.toLowerCase() || '';
        const privateHospital = item.Hospital_Private?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();
        
        return governmentHospital.includes(searchLower) || privateHospital.includes(searchLower);
    });
 
    const handleSendMessage = async () => {
        setLoading(true);
        try {
            const messagePayload = {
                message: MessageText,
                selectedHospitals: Object.values(selectedCheckboxes)
            };
    
            const formData = new FormData();
            attachedFiles.forEach((file) => {
                formData.append('files', file);
            });
    
            formData.append('message', JSON.stringify(messagePayload));
            // Test http://localhost:443/send/Message/New
            const response = await axios.post('https://rpa-apiprd.inet.co.th:443/send/Message/New', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log('Message sent successfully:', response.data);
            setMessageText('');
            setAttachedFiles([]);
            setFileNames([]);
    
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
        //window.location.reload();
    };

    const handleChange = (event) => {
        const text = event.target.value;
        setMessageText(text);
        setCharCount(text.length);
    };

    const handleSelectImage = () => {
        if (fileInputRefImage.current) {
            fileInputRefImage.current.click();
        }
    };

    const handleImageChange = (event) => {
        const files = event.target.files;
        const newFiles = Array.from(files);
    
        setAttachedFiles([...attachedFiles, ...newFiles]);
        
        const newFileNames = newFiles.map(file => file.name);
        setFileNames([...fileNames, ...newFileNames]);
    };

    const handleRemoveFile = (index) => {
        const newAttachedFiles = attachedFiles.filter((file, i) => i !== index);
        const newFileNames = fileNames.filter((name, i) => i !== index);
    
        setAttachedFiles(newAttachedFiles);
        setFileNames(newFileNames);
    };
    const handlePreviewImage = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewImage(e.target.result);
            setIsPreviewOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setPreviewImage(null);
    };

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
            <div className='container'>
                <div className='Fixlocation'>
                    <button onClick={handleReload}>
                        <img src={HomeIcon} alt="HomeIcon" className='homeicon' />
                    </button>
                </div>
            <div className='Fixlocation'>
                <button className="Dashboard-Internal-button-post" style={{ background: '#559cbf',color:'#ffffff' , fontSize:'14px' }} onClick={handleOpenPopup} >เพิ่มโรงพยาบาล</button>
            </div>
            <div className='Fixlocation'>
                <button className="Dashboard-Internal-button-post" style={{ background: '#60a931',color:'#ffffff' , fontSize:'14px' }} onClick={handleOpenListPopup} >รายการโรงพยาบาล</button>
            </div>
            </div>
            <Card className='cardStyle_New' style={{ backgroundColor: '#D9D9D9', boxShadow: 'none', borderRadius: '15px' }}>
                <CardContent>
                    <h1 className='newsTitle'>
                        <span className="leftRotate">📢</span>  แจ้งข่าวสารโรงพยาบาล <span className="rightRotate">📢</span>
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Card
                            style={{
                                marginRight: '20px',
                                width: 'auto',
                                borderRadius: '10px',
                                boxShadow: 'none',
                                border: 'none',
                                height: '420px',
                                backgroundColor: 'rgb(238, 239, 239)',
                            }}>
                            <CardContent>
                                <input
                                    style={{
                                        textAlign: "center",
                                        width: '100%',
                                        height: '30px',
                                        borderWidth: 'thin',
                                        borderRadius: '10px',
                                        marginBottom:'5px'
                                    }}
                                    type="text"
                                    placeholder="ค้นหาด้วยชื่อโรงพยาบาล"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <div style={{ fontFamily: "'Kanit', sans-serif"}}>
                                        <div className='container-checkbox'>
                                            <p>จำนวนทั้งหมด : {Object.keys(selectedCheckboxes).length}</p> {/* Display count */}
                                        <div>
                                        <label className="radio-label">
                                        <input
                                            type="radio"
                                            checked={isFirstChecked}
                                            onChange={handleFirstToggle}
                                            className="custom-radio"
                                            />
                                            โรงพยาบาลรัฐ
                                        </label>
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                checked={isSecondChecked}
                                                onChange={handleSecondToggle}
                                                className="custom-radio"
                                            />
                                            โรงพยาบาลเอกชน
                                        </label>
                                        </div>
                                        </div>                            
                                        <div className="scrollable-container">
                                            <table className="tableStyle">
                                                <thead>
                                                    <tr>
                                                        <th className='checkbox-all'>
                                                            <input
                                                                style={{cursor : "pointer",marginRight:'5px',whiteSpace: 'nowrap'}}
                                                                type="checkbox"
                                                                checked={Object.keys(checkedItems).length === filteredData.length}
                                                                onChange={handleSelectAll}
                                                            />
                                                            ทั้งหมด
                                                        </th>
                                                        <th>ลำดับ</th>
                                                        <th style={{ padding: '0px 50px' }}>ชื่อโรงพยาบาล</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredData.map((item,index) => (
                                                        <tr key={`${item.hospital}-${index}`}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={checkedItems[isFirstChecked ? item.Hospital_Government : item.Hospital_Private] || false}
                                                                    onChange={(event) => handleCheckboxChange(event, item)}
                                                                />
                                                            </td>
                                                            <td>{index + 1}</td>
                                                            <td>{isFirstChecked ? item.Hospital_Government : isSecondChecked ? item.Hospital_Private : null}</td>
                                                            <td>{item.token}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <div className='container-hospital'>
                        <TextField
                            placeholder="เขียนข้อความ"
                            multiline
                            rows={7}
                            variant="outlined"
                            className="textFieldStyle"
                            onChange={handleChange}
                            inputProps={{ maxLength: 1000 }}
                            InputProps={{
                                classes: { input: 'textFieldInput' },
                                sx: {
                                    fontSize: '14px',
                                    borderRadius: '10px',
                                    '& fieldset': {
                                        // border: 'none',
                                    },
                                }
                            }}
                            style={{ flexGrow: 1, fontSize: '10px' }}
                        />
                        <p style={{fontSize:'10px',margin:'5px 10px 10px 10px',fontFamily:"'Kanit', sans-serif"}}>{charCount} / 1000</p> {/* แสดงจำนวนอักษรที่ป้อน */}
                        <Card 
                            className='Card-List-data' 
                            style={{
                                backgroundColor: 'rgb(238, 239, 239)',
                                marginBottom:"10px",
                                marginTop:'10px', 
                                boxShadow: 'none', 
                                borderRadius: '10px'
                            }}>
                            <CardContent>
                                <Typography 
                                    style={{
                                        textAlign:'center',
                                        fontFamily:"'Kanit', sans-serif",
                                        textDecoration: 'underline',
                                        fontSize:'12px'
                                    }} 
                                >
                                    รายละเอียดไฟล์แนบ
                                </Typography>
                                <div className='scrolla-list'>
                                {fileNames.map((fileName, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2px'}}>
                                    <Typography style={{ fontFamily: "'Kanit', sans-serif", fontSize: '14px' }}>
                                        {index + 1}. {fileName}
                                    </Typography>
                                    <div>
                                    <IconButton onClick={() => handlePreviewImage(attachedFiles[index])}>
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleRemoveFile(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    </div>
                                </div>
                                ))}
                                </div>
                            </CardContent>
                        </Card>
                        </div>
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                            <Button 
                                style={{
                                    fontSize:'12px',
                                    fontWeight: '700',
                                    fontFamily:"'Kanit', sans-serif",
                                    textTransform: 'none' ,
                                    margin:'20px 10px 0 20px',
                                    width:'70%',
                                    textAlign:'center',
                                    borderRadius:'10px',
                                    backgroundColor:'#3498DB',
                                    color:'#FDFEFE',
                                }}
                                type="submit"
                                variant="contained"
                                onClick={handleSendMessage}
                                //disabled={loading} // ปิดปุ่มเมื่อโหลด
                                >
                               ส่งข้อความ
                            </Button>
                            {loading && (
                                <Box 
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        zIndex: 9999,
                                    }}
                                >
                                    <CircularProgress size={60} style={{ color: '#FDFEFE' }} />
                                </Box>
                            )}
                            <Button 
                                style={{
                                    fontSize:'12px',
                                    fontWeight: '700',
                                    fontFamily:"'Kanit', sans-serif",
                                    textTransform: 'none' ,
                                    margin:'20px 10px 0 20px',
                                    width:'70%',
                                    textAlign:'center',
                                    borderRadius:'10px',
                                    backgroundColor:'#1D8348',
                                    color:'#FDFEFE',
                                }}
                                type="submit"
                                variant="contained"
                                onClick={handleSelectImage}>
                                เลือกรูปภาพ
                            </Button>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                                ref={fileInputRefImage}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={isPreviewOpen} onClose={handleClosePreview} maxWidth="lg" fullWidth>
                <DialogActions>
                    <IconButton edge="end" color="inherit" onClick={handleClosePreview} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
                <DialogContent >
                    {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />}
                </DialogContent>
            </Dialog>
            <Dialog open={isPopupOpen} onClose={handleClosePopup} maxWidth="sm" fullWidth>
            <DialogTitle
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Typography
                        variant="h6"
                        component="div"
                        style={{ fontFamily: "'Kanit', sans-serif", color: '#333' }}
                    >
                        เพิ่มโรงพยาบาล
                    </Typography>
                    <IconButton onClick={handleClosePopup}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2} style={{ fontFamily: "'Kanit', sans-serif" }}>
                        <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
                            <InputLabel>ประเภทโรงพยาบาล</InputLabel>
                            <Select
                                value={hospitalType}
                                onChange={(e) => setHospitalType(e.target.value)}
                                label="ประเภทโรงพยาบาล"
                            >
                                <MenuItem value="โรงพยาบาลรัฐ">โรงพยาบาลรัฐ</MenuItem>
                                <MenuItem value="โรงพยาบาลเอกชน">โรงพยาบาลเอกชน</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="ชื่อโรงพยาบาล"
                            variant="outlined"
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                        />

                        <TextField
                            fullWidth
                            label="Token"
                            variant="outlined"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClosePopup} color="secondary" style={{ fontFamily: "'Kanit', sans-serif" }}>
                        ยกเลิก
                    </Button>
                    <Button onClick={handleAddHospital} variant="contained" color="primary" style={{ fontFamily: "'Kanit', sans-serif", backgroundColor: '#559cbf' }}>
                        เพิ่มโรงพยาบาล
                    </Button>
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert
                            onClose={handleCloseSnackbar}
                            severity={snackbarSeverity}
                            sx={{ width: '100%' }}
                        >
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </DialogActions>
            </Dialog>
            <Dialog open={isListPopupOpen} onClose={handleCloseListPopup} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography
                        variant="h6"
                        style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 'bold', textAlign: 'center' }}
                    >
                        รายการโรงพยาบาล
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleCloseListPopup}
                        aria-label="close"
                        style={{ position: 'absolute', right: '20px', top: '20px' }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box display="flex" alignItems="center" mb={2} justifyContent="center">
                        <Typography
                            variant="body1"
                            style={{ fontFamily: "'Kanit', sans-serif", marginRight: '10px' }}
                        >
                            ประเภทโรงพยาบาล
                        </Typography>
                        <Select
                            value={hospitalType}
                            onChange={handleTypeChange}
                            size="small"
                            style={{ width: 'auto', fontFamily: "'Kanit', sans-serif", borderRadius: '8px', backgroundColor: '#f5f5f5' }}
                        >
                            <MenuItem value="โรงพยาบาลรัฐ">โรงพยาบาลรัฐ</MenuItem>
                            <MenuItem value="โรงพยาบาลเอกชน">โรงพยาบาลเอกชน</MenuItem>
                        </Select>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box>
                            {hospitalData.length > 0 ? (
                                <Box display="flex" flexDirection="column" gap={2}>
                                    {hospitalData.map((hospital, index) => (
                                        <Box
                                            key={index}
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            p={1.5}
                                            borderRadius="12px"
                                            bgcolor="#f1f3f4"
                                            boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
                                            style={{ transition: 'all 0.3s ease-in-out' }}
                                        >
                                            <Box display="flex" alignItems="center" style={{ width: '100%' }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: hospitalType === 'โรงพยาบาลรัฐ' ? '#3b82f6' : '#ef4444',
                                                        marginRight: '10px',
                                                        fontSize: '0.875rem',
                                                    }}
                                                >
                                                    {hospitalType}
                                                </Typography>
                                                <Box flexGrow={1}>
                                                    <Typography
                                                        variant="body2"
                                                        style={{ fontWeight: '500', fontSize: '0.875rem', color: '#333' }}
                                                    >
                                                        {hospital.name} : {hospital.Hospital}
                                                    </Typography>
                                                </Box>
                                                <IconButton onClick={() => handleDeleteHospital(hospital)} size="small">
                                                    <DeleteIcon style={{ color: '#e11d48', fontSize: '20px' }} />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography
                                    variant="body1"
                                    align="center"
                                    style={{ fontFamily: "'Kanit', sans-serif", color: '#888', marginTop: '10px' }}
                                >
                                    ไม่มีข้อมูลโรงพยาบาลที่เลือก
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
            <Dialog open={isDeleteConfirmOpen} onClose={handleCancelDelete}>
                <DialogTitle>ยืนยันการลบ</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        คุณแน่ใจหรือไม่ว่าต้องการลบโรงพยาบาลนี้? การลบนี้ไม่สามารถย้อนกลับได้
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="secondary">ยกเลิก</Button>
                    <Button onClick={confirmDeleteHospital} color="primary">ยืนยัน</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Hospital_News;