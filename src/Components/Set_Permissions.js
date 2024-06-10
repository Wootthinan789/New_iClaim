import React, { useState, useEffect } from 'react';
import './Style/Log.css';
import './Style/Set_Permissions.css';
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import AppBar from '@mui/material/AppBar';
import Button from '@material-ui/core/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import swal from 'sweetalert';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useMediaQuery, useTheme } from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import logo from './images-iclaim/download (2).png';
import employee from './images-iclaim/employee.png';
import HomeIcon from './images-iclaim/home-regular-60.png';
import { useNavigate } from 'react-router-dom';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const DeleteConfirmationDialog = ({ open, handleClose, handleDelete }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle style={{fontFamily:"'Kanit', sans-serif"}}>ยืนยันการลบ</DialogTitle>
            <DialogContent>
                <Typography style={{fontFamily:"'Kanit', sans-serif"}}>คุณต้องการลบชื่อผู้ใช้นี้ใช่หรือไม่?</Typography>
            </DialogContent>
            <DialogActions>
                <Button style={{fontFamily:"'Kanit', sans-serif"}} onClick={handleClose}>ยกเลิก</Button>
                <Button style={{fontFamily:"'Kanit', sans-serif"}} onClick={handleDelete} color="error">ลบ</Button>
            </DialogActions>
        </Dialog>
    );
};

const Set_Permissions = () => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [usernames, setUsernames] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Username:', username);
        console.log('Role:', role);

        const data = {
            username: username,
            role: role
        };

        axios.post('http://rpa-apiprd.inet.co.th:443/Role-user/insert', data)
        .then(response => {
            console.log(response.data);
            const delayInMilliseconds = 1500;
            setUsername('');
            setRole('');
            swal({
                text: 'Success',
                icon: 'success',
                buttons: false,
                timer: 2000,
              });
              setTimeout(() => {
                 window.location.reload();
              }, delayInMilliseconds);
        })
        .catch(error => {
            console.error(error);
        });
    };

    const [anchorElUser, setAnchorElUser] = useState(null);
    const usernameJson = JSON.parse(localStorage.getItem('username'));

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleLogClick = () => {
        navigate('/Log');
        window.location.reload();
    };
    const handleSetPermissions = () => {
        navigate('/Set/Permission')
        window.location.reload();
    }

    const handleEdithospitalClick = () => {
        navigate('/Edit/Hospital');
        window.location.reload();
    };
    const handleInternaliNetClick = () => {
        navigate('/Internal/inet')
        window.location.reload();
      }
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

    const handleReload = () => {
        navigate('/Dashboard/External');
        window.location.reload();
    };

    const fetchUsernames = () => {
        axios.get('http://rpa-apiprd.inet.co.th:443/Role-user')
        .then(response => {
            setUsernames(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    };

    const handleOpenModal = () => {
        fetchUsernames();
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        /*axios.delete('http://localhost:443/Role-user/del/user', { data: { username_role: selectedUser.username_role } })*/
        axios.delete('http://rpa-apiprd.inet.co.th:443/Role-user/del/user', { data: { username_role: selectedUser.username_role } })
        .then(response => {
            console.log(response.data);
            setDeleteDialogOpen(false);
            fetchUsernames(); // Refresh the usernames list
            swal({
                text: 'Deleted Successfully',
                icon: 'success',
                buttons: false,
                timer: 2000,
            });
        })
        .catch(error => {
            console.error(error);
        });
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
                                    <Typography variant="body1" style={{ fontSize: isSmallScreen ? '8px' : '16px', fontWeight: 'bold', fontFamily: "'Kanit', sans-serif", color: 'rgba(0, 0, 0, 0.54)' }}>
                                        {usernameJson.username}
                                    </Typography>
                                    <KeyboardArrowDownIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
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
                                    maxHeight: isSmallScreen ? '' : '200px',
                                    width: isSmallScreen ? '108px' : '150px',
                                },
                            }}
                        >
                            {['กำหนดสิทธิ์','แก้ไขโรงพยาบาล' , 'Log','Internal INET', 'ออกจากระบบ'].map((setting) => (
                                <MenuItem key={setting} style={{ padding: isSmallScreen ? '0 5px' : '5px 12px' }} onClick={setting === 'ออกจากระบบ' ? handleLogout : setting === 'แก้ไขโรงพยาบาล' ? handleEdithospitalClick :setting === 'กำหนดสิทธิ์' ? handleSetPermissions : setting === 'Log' ? handleLogClick : setting === 'Internal INET' ? handleInternaliNetClick : null}>
                                    <Typography style={{ fontFamily: "'Kanit', sans-serif", padding: isSmallScreen ? '0 12px' : '0 10px', fontSize: isSmallScreen ? '12px' : '16px', margin: isSmallScreen ? '1px 0' : '0 0' }}>
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
            <Card className='cardStyle_Set_Permissons' style={{ backgroundColor: '#D9D9D9', boxShadow: 'none', borderRadius: '15px' }}>
                <CardContent>
                    <div className='Text_SetPermissons'>
                        <h1 style={{ fontFamily: "'Kanit', sans-serif" }}>กำหนดสิทธิ์</h1>
                    </div>
                    <form className='form-set' onSubmit={handleSubmit}>
                        <Typography style={{ fontFamily: "'Kanit', sans-serif", fontSize: isSmallScreen ? '8px' : '16px' }}>กรอก username</Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="Username"
                            name="Username"
                            placeholder="Enter your Username"
                            size="small"
                            InputProps={{ style: { borderRadius: 4, fontSize: isSmallScreen ? '8px' : '16px' } }}
                            InputLabelProps={{ style: { marginLeft: 10 } }}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Typography style={{ fontFamily: "'Kanit', sans-serif", fontSize: isSmallScreen ? '8px' : '16px', marginTop: '10px' }}>กรอกสิทธิ์</Typography>
                        <FormControl variant="outlined" margin="normal" required fullWidth size="small" style={{}}>
                            <InputLabel style={{ fontSize: isSmallScreen ? '8px' : '16px' }}>Select Role</InputLabel>
                            <Select
                                id="Role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                label="Select Role"
                                inputProps={{className:"Select-root"}}
                            >
                                <MenuItem value="admin" style={{ fontSize: isSmallScreen ? '8px' : '16px' }}>admin</MenuItem>
                                <MenuItem value="user" style={{ fontSize: isSmallScreen ? '8px' : '16px' }}>user</MenuItem>
                            </Select>
                        </FormControl>
                        <div className='text-role' style={{ lineHeight: '0.2' }}>
                            <Typography style={{ fontFamily: "'Kanit', sans-serif", fontSize: isSmallScreen ? '8px' : '16px' }}>* สิทธิ์ที่สามารถกรอกได้ *</Typography>
                            <Typography style={{ fontFamily: "'Kanit', sans-serif", fontSize: isSmallScreen ? '8px' : '16px' }}>- admin = ไม่จำกัดในการเข้าถึงหน้าเว็บไซต์</Typography>
                            <Typography style={{ fontFamily: "'Kanit', sans-serif", fontSize: isSmallScreen ? '8px' : '16px' }}>- user = มีข้อจำกัดในการเข้าถึงหน้าเว็บไซต์</Typography>
                        </div>
                        <Button
                            style={{
                                fontSize: isSmallScreen ? '8px' : '16px',
                                fontWeight: 'bold',
                                marginTop: '20px',
                                fontFamily: "'Kanit', sans-serif",
                                width: '50%',
                                padding: '5px',
                                marginLeft: '25%',
                                marginRight: 'auto',
                                borderRadius: '15px',
                                backgroundColor:'#2347AC',
                                color: 'white'
                            }}
                            type="submit"
                            variant="contained"
                        >
                            ตกลง
                        </Button>
                    </form>
                    <Button
                        style={{
                            fontSize: isSmallScreen ? '8px' : '16px',
                            fontWeight: 'bold',
                            marginTop: '2px',
                            fontFamily: "'Kanit', sans-serif",
                            width: isSmallScreen ? '60%' : '50%',
                            padding: '5px',
                            marginLeft: isSmallScreen ? '20%' :'25%',
                            marginRight: 'auto',
                            borderRadius: '15px',
                            backgroundColor: '#f0ad4e',
                            color: 'white'
                        }}
                        onClick={handleOpenModal}
                    >
                        ดูรายการ Username ที่มีอยู่
                    </Button>
                </CardContent>
            </Card>
            <Modal open={modalOpen} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ 
                    width: isSmallScreen ? '70%' : '50%', 
                    height: isSmallScreen ? '60%' : '80%', 
                    bgcolor: 'background.paper', 
                    boxShadow: 24, p: 4 }}>
                    <DialogTitle 
                    style={{
                        fontSize:  isSmallScreen ? '16px' :'32px',
                        fontFamily:"'Kanit', sans-serif"
                        ,fontWeight:'700'

                    }}>รายการ Username ที่มีอยู่</DialogTitle>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell style={{fontSize:'18px',fontFamily:"'Kanit', sans-serif",fontWeight:'600'}} >Username</TableCell>
                            <TableCell style={{fontSize:'18px',fontFamily:"'Kanit', sans-serif",fontWeight:'600'}} >Role</TableCell>
                        </TableRow>
                        </TableHead>
                    </Table>
                    <DialogContent className="modalContent">
                    <Table>
                    <TableBody>
                            {usernames.map((user) => (
                                <TableRow key={user.username_role}>
                                    <TableCell style={{fontSize:'14px',fontFamily:"'Kanit', sans-serif"}}>{user.username_role}</TableCell>
                                    <TableCell style={{ display: 'flex',marginLeft:'250px',padding:'6px',fontSize:'14px' }}>
                                        <span>{user.role}</span>
                                        <Button
                                            style={{fontFamily:"'Kanit', sans-serif", marginLeft: 'auto', padding: '2px 8px', minWidth: '30%',backgroundColor:'#d31414',color:'white'}}
                                            onClick={() => handleDeleteClick(user)}
                                        >
                                            ลบ
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </DialogContent>
                </Box>
            </Modal>
            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                handleClose={() => setDeleteDialogOpen(false)}
                handleDelete={handleDelete}
            />
        </div>
    );
};

export default Set_Permissions;
