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
import { useMediaQuery, useTheme, TextField, Button } from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import logo from './images-iclaim/download (2).png';
import employee from './images-iclaim/employee.png';
import HomeIcon from './images-iclaim/home-regular-60.png';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const Hospital_News = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const usernameJson = JSON.parse(localStorage.getItem('username'));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [checkedItems, setCheckedItems] = useState({});
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageName, setImageName] = useState('');
    const [fileName, setFileName] = useState('');
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [MessageText, setMessageText] = useState('')
    const [charCount, setCharCount] = useState(0); // State เก็บจำนวนอักษรที่ป้อนเข้าไป
    const [fileNames, setFileNames] = useState([]);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const fileInputRefFile = useRef(null);
    const fileInputRefImage = useRef(null);

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
                const response = await axios.get('http://localhost:443/iClaim/list/hospital');
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCheckboxChange = (event, index) => {
        const isChecked = event.target.checked;
        setCheckedItems(prevState => ({
            ...prevState,
            [index]: isChecked
        }));

        if (isChecked) {
            const checkboxData = data[index];
            const { id, hospital, token } = checkboxData;

            const selectedCheckbox = {
                id_hospital: id,
                token: token,
                user_name: usernameJson.username,
                title: hospital
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

    const handleSelectAll = () => {
        if (Object.keys(checkedItems).length === filteredData.length) {
            setCheckedItems({});
            setSelectedCheckboxes({});
        } else {
            const newCheckedItems = {};
            const newSelectedCheckboxes = {};

            filteredData.forEach((item, index) => {
                newCheckedItems[index] = true;

                const { id, hospital, token } = item;

                newSelectedCheckboxes[index] = {
                    id_hospital: id,
                    token: token,
                    user_name: usernameJson.username,
                    title: hospital
                };
            });

            setCheckedItems(newCheckedItems);
            setSelectedCheckboxes(newSelectedCheckboxes);
        }
    };

    const filteredData = data.filter(item => {
        return item.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSendMessage = async () => {
        try {
            // Step 1: Send the message text
            const messagePayload = {
                message: MessageText,
                selectedHospitals: Object.values(selectedCheckboxes)
            };
    
            const messageResponse = await axios.post('http://localhost:443/api/New/message', messagePayload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            console.log('Message sent successfully:', messageResponse.data);
    
            // Step 2: Upload attached files (if any)
            if (attachedFiles.length > 0) {
                const formData = new FormData();
    
                // Append each file to FormData
                attachedFiles.forEach((file) => {
                    formData.append('files', file, file.name);
                });
    
                const filesResponse = await axios.post('http://localhost:443/api/New/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                console.log('Files uploaded successfully:', filesResponse.data);
            }
    
            // Clear the message text and attached files after sending
            setMessageText('');
            setAttachedFiles([]);
            setFileNames([]);
    
            // Optionally, reload or update UI after sending
            //window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
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
    const handleSelectPDF = () => {
        if (fileInputRefFile.current) {
            fileInputRefFile.current.click();
        }
    };

    const handleImageChange = (event) => {
        const files = event.target.files;
        const newFiles = Array.from(files);
    
        setAttachedFiles([...attachedFiles, ...newFiles]);
        
        const newFileNames = newFiles.map(file => file.name);
        setFileNames([...fileNames, ...newFileNames]);
    };
    const handleFileChange = (event) => {
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
            <Card className='cardStyle_Log' style={{ backgroundColor: '#D9D9D9', boxShadow: 'none', borderRadius: '15px' }}>
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
                                height: '440px',
                                backgroundColor: 'rgb(238, 239, 239)',
                            }}>
                            <CardContent>
                                <input
                                    style={{
                                        textAlign: "center",
                                        width: '100%',
                                        height: '30px',
                                        borderWidth: 'thin',
                                        borderRadius: '10px'
                                    }}
                                    type="text"
                                    placeholder="ค้นหาด้วยชื่อโรงพยาบาล"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <div style={{ fontFamily: "'Kanit', sans-serif" }}>
                                        <p>จำนวนทั้งหมด : {Object.keys(selectedCheckboxes).length}</p> {/* Display count */}
                                        <div className="scrollable-container">
                                            <table className="tableStyle">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <input
                                                                type="checkbox"
                                                                checked={Object.keys(checkedItems).length === filteredData.length}
                                                                onChange={handleSelectAll}
                                                            />
                                                        </th>
                                                        <th>จำนวน</th>
                                                        <th style={{ padding: '0px 50px' }}>ชื่อโรงพยาบาล</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredData.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={!!checkedItems[index]}
                                                                    onChange={(e) => handleCheckboxChange(e, index)}
                                                                />
                                                            </td>
                                                            <td>{index + 1}</td>
                                                            <td style={{ padding: '0px 10px 0px 50px' }}>{item.hospital}</td>
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
                                    borderRadius: '10px',
                                    '& fieldset': {
                                        // border: 'none',
                                    },
                                }
                            }}
                            style={{ flexGrow: 1, fontSize: '16px' }}
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
                                        textDecoration: 'underline'
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
                                    <IconButton onClick={() => handleRemoveFile(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                                ))}
                                </div>
                            </CardContent>
                        </Card>
                        </div>
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                            <Button 
                                style={{
                                    fontSize:'16px',
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
                                    fontSize:'16px',
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
                            <Button 
                                style={{
                                    fontSize:'16px',
                                    fontWeight: '700',
                                    fontFamily:"'Kanit', sans-serif",
                                    textTransform: 'none' ,
                                    margin:'20px 10px 0 20px',
                                    width:'70%',
                                    textAlign:'center',
                                    borderRadius:'10px',
                                    backgroundColor:'#212F3D',
                                    color:'#FDFEFE',
                                }}
                                type="submit"
                                variant="contained"
                                onClick={handleSelectPDF}>
                                แนบไฟล์ PDF
                            </Button>
                            <input
                                type="file"
                                accept="application/pdf"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                ref={fileInputRefFile}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Hospital_News;
