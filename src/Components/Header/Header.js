import React, {Component} from 'react';
import Img from 'react-image';
import PreLoader from '../PreLoader/PreLoader';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

class Header extends Component {

  constructor(props){
    super(props);
    this.state = {
      left: false
    }
  }
  
  return(
    <header>
      <AppBar position="static">
        <Toolbar className="white blue-text text-darken-4">
          <IconButton className="" color="inherit" aria-label="menu" onClick={toggleDrawer('left', true)}>
            <MenuIcon />
          </IconButton>
          <Img loader={<PreLoader/>} className="logo right" src={`https://admin.powempresas.com/portais/logos/${props.logo}`}/>
          <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
            {sideList('left')}
          </Drawer>
          <Menu id="main-menu">
            <MenuItem>Sobre</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </header>
  )
}
export default Header;
