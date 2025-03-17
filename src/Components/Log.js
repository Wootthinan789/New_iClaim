import React, { useState, useEffect, useCallback } from 'react';
import './Style/Log.css'
import axios from "axios";
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
import { useMediaQuery, useTheme } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import logo from './images-iclaim/download (2).png';
import employee from './images-iclaim/employee.png'
import HomeIcon from './images-iclaim/home-regular-60.png';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import File_export from './images-iclaim/file-export24.png'

const Log = () => {

    const [logData, setLogData] = useState(null);
    const [selectedType, setSelectedType] = useState('External 2');
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [, setPutDate] = useState(selectedDate.toISOString().slice(0, 10));
    const [anchorElUser, setAnchorElUser] = useState(null);

    const usernameJson = JSON.parse(localStorage.getItem('username'));

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        console.log('Selected value:', selectedValue);
        if (selectedValue === 10) {
            setSelectedType("External 2");
        }else if (selectedValue === 20) {
            setSelectedType("External 1");
        }else if (selectedValue === 30) {
            setSelectedType("Internal");
        }
        else if (selectedValue === 40) {
            setSelectedType("Internal v2");
        }
        else if (selectedValue === 50) {
            setSelectedType("Report Team iClaim");
        }
        else if (selectedValue === 60) {
            setSelectedType("External 3");
        }
        console.log('Selected type:', selectedType);
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

  const fetchLogs = useCallback(async () => {
    try {
        setLoading(true);
        const formattedDate = selectedDate.toISOString().split('T')[0];
        console.log('Formatted date:', formattedDate);
        const response = await axios.get(`https://rpa-apiprd.inet.co.th:443/iClaim/list/log?data_type=${selectedType}&date=${formattedDate}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch logs');
        }
        let data = response.data || [];
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format');
        }
        if (data.length === 0) {
            throw new Error('No data available for selected date');
        }
        data = data.filter(log => {
            const logDate = new Date(log.Date_on);
            return logDate.toISOString().split('T')[0] === formattedDate && log.Data_Type === selectedType;
        });
        console.log('Fetched data:', data);
        setLogData(data);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching logs:', error.message);
        setLoading(false);
        if (error.message === 'Invalid data format' || error.message === 'No data available for selected date') {
            setLogData([]);
        }
    }
}, [selectedType, selectedDate]);



    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = date.toISOString().slice(0, 10);
        setPutDate(formattedDate);
        fetchLogs();
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

    const handleDashboardInternalClick = () => {
        navigate('/Dashboard/Internal')
        window.location.reload();
    };

    const handleHospitalNews = () => {
        navigate('/Hospital/News')
        window.location.reload();
      }

    const handleDashboardExternalClick = () => {
        navigate('/Dashboard/External')
        window.location.reload();
    };
    
    const handleLogClick = () => {
        navigate('/Log')
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleEdithospitalClick = () => {
        navigate('/Edit/Hospital')
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

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const handleReload = () => {
        navigate('/Dashboard/External')
    };

    const downloadExcel = () => {
        const excelData = logData.map(log => ({
            Date: log.Date_on,
            List: log.List,
            Status: log.Status,
            User: log.User_name,
            Remark: log.Remark,
            DataType: log.Data_Type
        }));

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        XLSX.writeFile(wb, `Log_Data_${year}-${month}-${day}_${selectedType}.xlsx`);
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

                                    maxHeight: isSmallScreen ? '' : 'auto',
                                    width: isSmallScreen ? '108px' : '155px',
                                },
                            }}
                        >
                            {['External 3','Internal INET','Internal V2','Report Team Iclaim','กำหนดสิทธิ์','แก้ไขโรงพยาบาล' , 'Log','ข่าวสารโรงพยาบาล', 'ออกจากระบบ'].map((setting) => (
                                <MenuItem key={setting} style={{ padding: isSmallScreen ? '0 5px' : '5px 2px' }} onClick={setting === 'ออกจากระบบ' ? handleLogout : setting === 'แก้ไขโรงพยาบาล' ? handleEdithospitalClick :setting === 'กำหนดสิทธิ์' ? handleSetPermissions : setting === 'Log' ? handleLogClick : setting === 'Internal INET' ? handleInternaliNetClick : setting === 'ข่าวสารโรงพยาบาล' ? handleHospitalNews : setting === 'Internal V2' ? handleInternalv2 : setting === 'Report Team Iclaim' ? handleReportTeamIClaim : setting === 'External 3'? handleExternal3 : null}>
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
                    <button className="Dashboard-Internal-button" onClick={handleDashboardInternalClick} style={{lineHeight: '1'}}>External 1</button>
                </div>
                <div className='Fixlocation'>
                    <button className="Dashboard-Internal-button" onClick={handleDashboardExternalClick} style={{lineHeight: '1'}} >External 2</button>
                </div>
                <div className='Fixlocation'>
                    <DatePicker className='Dashboard-Internal-button-date' selected={selectedDate} onChange={handleDateChange} dateFormat="dd/MM/yyyy" />
                </div>
                <div className='Fixlocation'>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                        <Select
                            style={{
                                fontFamily: "'Kanit', sans-serif",
                                fontWeight: '700',
                                width: isSmallScreen ? '100px' : 'auto',
                                height: isSmallScreen ? '22.1px' : '34px',
                                fontSize: isSmallScreen ? '6px' : '16px',
                                marginTop: '5px',
                                borderRadius: '10px',
                                background: '#c7c7c7',
                                border: 'none',
                            }}
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            onChange={handleChange}
                            defaultValue={10}
                        >
                            <MenuItem value={20}
                            style={{
                                fontFamily: "'Kanit', sans-serif",
                                fontWeight: '700',
                                textAlign:'center',
                                fontSize: isSmallScreen ? '6px' : '16px',
                                margin: '0',
                            }}
                            >Dashboard External 1</MenuItem>
                            <MenuItem value={10} 
                            style={{
                                fontFamily: "'Kanit', sans-serif",
                                fontWeight: '700',
                                textAlign:'center',
                                fontSize: isSmallScreen ? '6px' : '16px',
                                margin: '0',
                            }}
                            >Dashboard External 2</MenuItem>
                            <MenuItem value={60}
                            style={{
                                fontFamily: "'Kanit', sans-serif",
                                fontWeight: '700',
                                textAlign:'center',
                                fontSize: isSmallScreen ? '6px' : '16px',
                                margin: '0',
                            }}
                            >Dashboard External 3</MenuItem>
                            <MenuItem value={30}
                            style={{
                                fontFamily: "'Kanit', sans-serif",
                                fontWeight: '700',
                                textAlign:'center',
                                fontSize: isSmallScreen ? '6px' : '16px',
                                margin: '0',
                            }}
                            >Dashboard Internal</MenuItem>
                            <MenuItem value={40}
                            style={{
                                fontFamily: "'Kanit', sans-serif",
                                fontWeight: '700',
                                textAlign:'center',
                                fontSize: isSmallScreen ? '6px' : '16px',
                                margin: '0',
                            }}
                            >Dashboard Internal V2</MenuItem>
                            <MenuItem value={50}
                            style={{
                                fontFamily: "'Kanit', sans-serif",
                                fontWeight: '700',
                                textAlign:'center',
                                fontSize: isSmallScreen ? '6px' : '16px',
                                margin: '0',
                            }}
                            >Report Team Iclaim</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <Card className='cardStyle_Log' style={{ backgroundColor: '#D9D9D9', boxShadow: 'none', borderRadius: '15px' }}>
                {loading ? (
                    <p style={{ textAlign: "center" }}>Loading...</p>
                ) : logData && logData.length > 0 ? (
                    <CardContent>
                        <div>
                            <h1 className='Text_Log' style={{ fontFamily: "'Kanit', sans-serif" }}>Log Dashboard {selectedType}</h1>
                            <div><img src={File_export} alt="HomeIcon" className='file_export' onClick={downloadExcel} /></div>
                        </div>
                        <div className='background_log'>
                            <p className='insert_date1' style={{ borderRadius: isSmallScreen ? '4px 0 0 4px' : '8px 0 0 8px' }}>Date</p>
                            <p className='insert_date1'>Status</p>
                            <p className='insert_date1'>Action By</p>
                            <p className='insert_date1' style={{ borderRadius: isSmallScreen ? '0 4px 4px 0' : '0 8px 8px 0' }}>Comment</p>
                        </div>
                        {logData.map((log, index) => (
                            <div key={index} className='box_insert_data2'>
                                <p className='insert_date2'>{log.Date_on}</p>
                                <p className='insert_date2'>{log.Status}</p>
                                <p className='insert_date2'>{log.User_name}</p>
                                <p className='insert_date2'>{log.Remark}</p>
                            </div>
                        ))}
                    </CardContent>
                ) : (
                    <p style={{ textAlign: "center", fontFamily: "'Kanit', sans-serif", fontSize: isSmallScreen ? '8px' : '20px' }}>ไม่มีข้อมูลสําหรับวันที่เลือก</p>
                )}
            </Card>

        </div>
    );
};

export default Log;
