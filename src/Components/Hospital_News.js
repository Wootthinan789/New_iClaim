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
import { useMediaQuery, useTheme, TextField, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
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
    const [charCount, setCharCount] = useState(0); // State เก็บจำนวนอักษรที่ป้อนเข้าไป
    const [fileNames, setFileNames] = useState([]);

    const [previewImage, setPreviewImage] = useState(null); // State to manage the image preview
    const [isPreviewOpen, setIsPreviewOpen] = useState(false); // State to manage the preview dialog open/close
    const [isFirstChecked, setIsFirstChecked] = useState(true);
    const [isSecondChecked, setIsSecondChecked] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const fileInputRefImage = useRef(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleFirstToggle = () => {
        setIsFirstChecked(true);
        setIsSecondChecked(false);
            // Clear the checkbox states
        setCheckedItems({});
        setSelectedCheckboxes({});
    };
    
    const handleSecondToggle = () => {
        setIsFirstChecked(false);
        setIsSecondChecked(true);
            // Clear the checkbox states
        setCheckedItems({});
        setSelectedCheckboxes({});
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
                if (isFirstChecked) {
                    // endpoint = 'http://localhost:443/get/data/hospital/government';
                    endpoint = 'https://rpa-apiprd.inet.co.th:443/get/data/hospital/government';
                } else if (isSecondChecked) {
                    // endpoint = 'http://localhost:443/get/data/hospital/private';
                    endpoint = 'https://rpa-apiprd.inet.co.th:443/get/data/hospital/private';
                }
                
                const response = await axios.get(endpoint);
                setData(response.data);
                setLoading(false);
    
                // Log the response data
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

        // Check if this checkbox was previously selected
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

        // Update the "Select All" checkbox state
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
        const governmentHospital = item.Hospital_Government ? item.Hospital_Government.toLowerCase() : '';
        const privateHospital = item.Hospital_Private ? item.Hospital_Private.toLowerCase() : '';
        const searchLower = searchTerm.toLowerCase();
    
        return governmentHospital.includes(searchLower) || privateHospital.includes(searchLower);
    });
 
    const handleSendMessage = async () => {
        try {
            // Step 1: Prepare message payload
            const messagePayload = {
                message: MessageText,
                selectedHospitals: Object.values(selectedCheckboxes)
            };
    
            // Step 2: Prepare form data for files
            const formData = new FormData();
            attachedFiles.forEach((file) => {
                formData.append('files', file);
            });
    
            // Step 3: Append message data to form data
            formData.append('message', JSON.stringify(messagePayload));
    
            // Step 4: Send data to API endpoint
            const response = await axios.post('http://localhost:443/send/Message/New', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Step 4: Send data to API endpoint
            // const response = await axios.post('https://rpa-apiprd.inet.co.th:443/send/Message/New', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
    
            console.log('Message sent successfully:', response.data);
    
            // Step 5: Clear message text and attached files after sending
            setMessageText('');
            setAttachedFiles([]);
            setFileNames([]);
    
            // Optionally, reload or update UI after sending
            // window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
        window.location.reload();
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
        // ลบไฟล์ออกจาก attachedFiles และ fileNames ตาม index ที่ระบุ
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
                            {['กำหนดสิทธิ์', 'แก้ไขโรงพยาบาล', 'Log', 'Internal INET', 'ข่าวสารโรงพยาบาล', 'ออกจากระบบ'].map((setting) => (
                                <MenuItem key={setting} style={{ padding: isSmallScreen ? '0 5px' : '5px 5px' }} onClick={setting === 'ออกจากระบบ' ? handleLogout : setting === 'แก้ไขโรงพยาบาล' ? handleEdithospitalClick : setting === 'กำหนดสิทธิ์' ? handleSetPermissions : setting === 'Log' ? handleLogClick : setting === 'Internal INET' ? handleInternaliNetClick : setting === 'ข่าวสารโรงพยาบาล' ? handleHospitalNews : null}>
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
            </div>
            <Card className='cardStyle_New' style={{ backgroundColor: '#D9D9D9', boxShadow: 'none', borderRadius: '15px' }}>
                <CardContent>
                    <h1 className='newsTitle'>
                        <span className="leftRotate">📢</span>  ข่าวสารโรงพยาบาล <span className="rightRotate">📢</span>
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
                                onClick={handleSendMessage}>
                                ส่งข้อความ
                            </Button>
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
        </div>
    );
};

export default Hospital_News;