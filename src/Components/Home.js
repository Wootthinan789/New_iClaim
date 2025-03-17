import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  media: {
    height: '90vh',
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
}));

const Home = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  //const user = JSON.parse(localStorage.getItem('user'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Profile
          </Typography>
          <div>
            <IconButton onClick={handleMenu} color="inherit">
              <Avatar src={'https://ichef.bbci.co.uk/news/640/cpsprodpb/9970/live/9e4ab180-fd11-11ed-b2aa-9935735a579c.png'} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem>
                <ListItemIcon>
                  <Avatar img="./images-iclaim/settings.png" alt="avatar of Jese" rounded />
                </ListItemIcon>
                <ListItemText primary="กำหนดสิทธิ์" />
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <Avatar/>
                </ListItemIcon>
                <ListItemText primary="Log" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <Avatar/>
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Avatar src={'https://ichef.bbci.co.uk/news/640/cpsprodpb/9970/live/9e4ab180-fd11-11ed-b2aa-9935735a579c.png'} className={classes.large} />
          <Typography variant="h5">
             {`วุฒินันท์`} {`ปรางมาศ`}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;
