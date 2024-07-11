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

import { Dropdown, ButtonToolbar } from 'rsuite';

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

    const [isFirstChecked, setIsFirstChecked] = useState(true);
    const [isSecondChecked, setIsSecondChecked] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const fileInputRefFile = useRef(null);
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
                    endpoint = 'http://localhost:443/get/data/hospital/government';
                } else if (isSecondChecked) {
                    endpoint = 'http://localhost:443/get/data/hospital/private';
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
                    formData.append('file', file);
                });
    
                // Add the message_id to FormData
                const message_id = messageResponse.data.message_id;
                formData.append('message_id', message_id);
    
                const fileUploadResponse = await axios.post('http://localhost:443/api/New/attachment', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                console.log('Files uploaded successfully:', fileUploadResponse.data);
            }
    
            // Clear the form fields after successful submission
            setMessageText('');
            setSelectedCheckboxes({});
            setAttachedFiles([]);
            setFileNames([]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleMessageChange = (event) => {
        setMessageText(event.target.value);
        setCharCount(event.target.value.length); // Update charCount
    };

    const handleFileInputChangeFile = (event) => {
        const files = Array.from(event.target.files);
        setAttachedFiles(files);
        const fileNamesArray = files.map((file) => file.name);
        setFileNames(fileNamesArray);
    };

    const handleFileInputChangeImage = (event) => {
        const files = Array.from(event.target.files);
        setAttachedFiles(files);
        const fileNamesArray = files.map((file) => file.name);
        setFileNames(fileNamesArray);
    };

    return (
        <div>
            <div className="bar-custom">
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" className="bar-custom">
                        <Toolbar className="bar-custom">
                            <div className="logo-container">
                                <img src={logo} alt="Company Logo" className="logo-image" />
                            </div>
                            <div className="centered-buttons">
                                <button className="button-custom" onClick={handleInternaliNetClick}>Internal Inet</button>
                                <button className="button-custom" onClick={handleHospitalNews}>Hospital News</button>
                                <button className="button-custom" onClick={handleSetPermissions}>Set Permissions</button>
                                <button className="button-custom" onClick={handleEdithospitalClick}>Edit Hospital</button>
                                <button className="button-custom" onClick={handleLogClick}>Log</button>
                            </div>
                            <div className="custom-icon-button">
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="User Avatar" src={employee} />
                                        <KeyboardArrowDownIcon className="icon-white" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
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
                                    <MenuItem onClick={handleLogout}>
                                        <Typography textAlign="center">Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </div>
                        </Toolbar>
                    </AppBar>
                </Box>
            </div>
            <div className="content-custom">
                <div className={`sidebar ${isSmallScreen ? 'sidebar-hidden' : ''}`}>
                    <div className="sidebar-content">
                        <button className="button-custom" onClick={handleReload}>
                            <img src={HomeIcon} alt="Home Icon" className="button-icon" />
                            <span className="button-text">Home</span>
                        </button>
                    </div>
                </div>
                <div className={`main-content ${isSmallScreen ? 'main-content-expanded' : ''}`}>
                    <div className="container-news">
                        <div className="container">
                            <div className="toggle-switch">
                                <ButtonToolbar>
                                    <div className="custom-radio-toolbar">
                                        <input
                                            type="radio"
                                            id="toggle1"
                                            name="toggle"
                                            value="option1"
                                            checked={isFirstChecked}
                                            onChange={handleFirstToggle}
                                        />
                                        <label htmlFor="toggle1">Government</label>
                                    </div>
                                    <div className="custom-radio-toolbar">
                                        <input
                                            type="radio"
                                            id="toggle2"
                                            name="toggle"
                                            value="option2"
                                            checked={isSecondChecked}
                                            onChange={handleSecondToggle}
                                        />
                                        <label htmlFor="toggle2">Private</label>
                                    </div>
                                </ButtonToolbar>
                            </div>
                        </div>
                        <div className="search-container">
                            <TextField
                                label="Search"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-box"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <Card className="data-card">
                            <CardContent>
                                {loading ? (
                                    <div>Loading...</div>
                                ) : (
                                    <>
                                        <div className="table-container">
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <input
                                                                type="checkbox"
                                                                onChange={handleSelectAll}
                                                                checked={
                                                                    Object.keys(checkedItems).length === filteredData.length
                                                                }
                                                            />
                                                        </th>
                                                        <th>Hospital</th>
                                                        <th>Token</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredData.map((item) => (
                                                        <tr key={item.hospital}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={checkedItems[isFirstChecked ? item.Hospital_Government : item.Hospital_Private] || false}
                                                                    onChange={(event) => handleCheckboxChange(event, item)}
                                                                />
                                                            </td>
                                                            <td>{isFirstChecked ? item.Hospital_Government : item.Hospital_Private}</td>
                                                            <td>{item.token}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="message-card">
                            <CardContent>
                                <TextField
                                    label="Message"
                                    variant="outlined"
                                    value={MessageText}
                                    onChange={handleMessageChange}
                                    multiline
                                    rows={4}
                                    className="message-box"
                                    inputProps={{ maxLength: 2000 }}
                                />
                                <div className="character-count">{charCount}/2000</div>
                            </CardContent>
                        </Card>
                        <Card className="attachment-card">
                            <CardContent>
                                <div className="attachment-container">
                                    <div className="file-upload">
                                        <input
                                            type="file"
                                            id="file-input-file"
                                            multiple
                                            onChange={handleFileInputChangeFile}
                                            style={{ display: 'none' }}
                                            ref={fileInputRefFile}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={() => fileInputRefFile.current.click()}
                                            style={{ marginRight: '10px' }}
                                        >
                                            Attach Files
                                        </Button>
                                        <input
                                            type="file"
                                            id="file-input-image"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileInputChangeImage}
                                            style={{ display: 'none' }}
                                            ref={fileInputRefImage}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={() => fileInputRefImage.current.click()}
                                        >
                                            Attach Images
                                        </Button>
                                    </div>
                                    <ul className="attachment-list">
                                        {fileNames.map((fileName, index) => (
                                            <li key={index}>
                                                {fileName}
                                                <IconButton onClick={() => {
                                                    const newAttachedFiles = [...attachedFiles];
                                                    const newFileNames = [...fileNames];
                                                    newAttachedFiles.splice(index, 1);
                                                    newFileNames.splice(index, 1);
                                                    setAttachedFiles(newAttachedFiles);
                                                    setFileNames(newFileNames);
                                                }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="send-message-card">
                            <CardContent>
                                <Button variant="contained" color="primary" onClick={handleSendMessage}>
                                    Send Message
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hospital_News;
