import * as React from 'react';
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
import { useMediaQuery, useTheme } from '@mui/material';

import backgroundImg from './images-iclaim/blur-hospital.jpg';
import logo from './images-iclaim/download (2).png';
import iClaim1 from './images-iclaim/iClaim/1.png';
import iClaim2 from './images-iclaim/iClaim/2.png';

let username = "วุฒินันท์ ปรางมาศ";
const settings = ['กำหนดสิทธิ์', 'Log', 'ออกจากระบบ'];

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const containerStyle = {
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const cardStyle = {
    backgroundColor: 'rgb(217, 217, 217)',
    boxShadow: 'none',
    borderRadius: '8px',
    marginTop: '20px',
    width: isMobile ? '90%' : '60%',
    height: '60%',
  };

  const appBarStyle = {
    backgroundColor: 'white',
    boxShadow: 'none',
    color: 'white',
    padding: '10px',
  };

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [checkedImages, setCheckedImages] = React.useState({
    iClaim1: false,
    iClaim2: false,
  });

  const handleImageCheckboxChange = (imageName) => {
    setCheckedImages((prevCheckedImages) => ({
      ...prevCheckedImages,
      [imageName]: !prevCheckedImages[imageName],
    }));
  };

  return (
    <div style={containerStyle}>
      <AppBar position="static" sx={appBarStyle}>
        <Toolbar>
          <Box sx={{ position: 'absolute', left: '0' }}>
            <img src={logo} alt="Logo" style={{ height: '60px', marginRight: '10px', padding: '10px' }} />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ position: 'absolute', right: '0' }}>
            <Tooltip title="เปิดการตั้งค่า">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    backgroundColor: 'rgb(217,217,217)',
                    border: '1px  rgb(217,217,217)',
                    borderRadius: '6px',
                    padding: '6px',
                  }}
                >
                  <Avatar
                    alt="Remy Sharp"
                    src="https://1.bp.blogspot.com/-2PZ5N_3DEhY/VWGBjmg_yiI/AAAAAAAAAdo/OBu_pBiqAr4/s1600/mdicth4.jpg"
                    sx={{
                      marginRight: '9px',
                      width: '28px',
                      height: '28px',
                    }}
                  />
                  <Typography variant="body1" style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: "'Kanit', sans-serif", marginRight: '9px' }}>
                    {username}
                  </Typography>
                  <KeyboardArrowDownIcon />
                </Box>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px', padding: '0' }}
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
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Card style={cardStyle}>
        <CardContent>
          <FormGroup>
            <div style={{ marginBottom: '20px', textAlign: 'center', position: 'relative' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    style={{
                      position: 'absolute',
                      top: '1px',
                      left: '10px',
                      zIndex: '1',
                      borderRadius: '50%', // Set border-radius to make it circular
                    }}
                    icon={<RadioButtonUncheckedIcon />} // Icon when unchecked
                    checkedIcon={<CheckCircleIcon />} // Icon when checked
                    checked={checkedImages.iClaim1}
                    onChange={() => handleImageCheckboxChange('iClaim1')}
                  />
                }
                label={
                  <Typography
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      fontFamily: "'Kanit', sans-serif",
                      marginTop: '5px',
                      padding: '5px',
                      color: checkedImages.iClaim1 ? 'green' : 'black', // Change color based on checkbox state
                    }}
                  >
                    สรุปยอดเคลมประกันผ่าน iClaim โรงพยาบาลไทยนครินทร์  ข้อมูล  ณ วันที่ 11/01/2024 เวลา 23:59 น.
                  </Typography>
                }
              />
              <img
                src={iClaim1}
                alt="iClaim1"
                style={{
                  width: '100%',
                  height: '50%',
                  objectFit: 'cover',
                  borderRadius: '0 0 8px 8px',
                }}
              />
            </div>

            <div style={{ textAlign: 'center', position: 'relative' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    style={{
                      position: 'absolute',
                      top: '1px',
                      left: '10px',
                      zIndex: '1',
                      borderRadius: '50%', // Set border-radius to make it circular
                    }}
                    icon={<RadioButtonUncheckedIcon />} // Icon when unchecked
                    checkedIcon={<CheckCircleIcon />} // Icon when checked
                    checked={checkedImages.iClaim2}
                    onChange={() => handleImageCheckboxChange('iClaim2')}
                  />
                }
                label={
                  <Typography
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      fontFamily: "'Kanit', sans-serif",
                      marginTop: '5px',
                      padding: '5px',
                      color: checkedImages.iClaim2 ? 'green' : 'black', // Change color based on checkbox state
                    }}
                  >
                    สรุปยอดเคลมประกันผ่าน iClaim โรงพยาบาลไทยนครินทร์  ข้อมูล  ณ วันที่ 11/01/2024 เวลา 23:59 น.
                  </Typography>
                }
              />
              <img
                src={iClaim2}
                alt="iClaim2"
                style={{
                  width: '100%',
                  height: '50%',
                  objectFit: 'cover',
                  borderRadius: '0 0 8px 8px',
                }}
              />
            </div>
          </FormGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
