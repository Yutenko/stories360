import React from 'react'
import {Link, withRouter} from 'react-router'
import AppBar from 'material-ui/AppBar'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import {translate} from '../client/lang/translation'
import Drawer from 'material-ui/Drawer'
import headerui from '../stores/headerui'
import {observer} from 'mobx-react'
import MenuItem from 'material-ui/MenuItem'

const styles = {
  appbar:{
    backgroundColor: "rgb(255, 255, 255)"
  },
  title:{
    cursor:'pointer',
    color:"rgba(0, 0, 0, 0.870588)"
  },
  logo:{
    height:45
  }
}

@observer
class Header extends React.Component {

 constructor (props) {
  super(props)
  this.getHome = this.getHome.bind(this)
 }

 render () {
  const ui = headerui

  return (
   <AppBar
    style={styles.appbar}
    title={<span style={styles.title} className="stories360"> {translate("header").title} </span>}
    onTitleTouchTap={this.getHome}
    iconElementLeft={
      <img src="client/images/logo.png" style={styles.logo} />
    }
    onLeftIconButtonTouchTap={this.getHome}
    iconElementRight={
      <IconButton>
       <FontIcon
        className="material-icons"
        color={"rgba(0, 0, 0, 0.870588)"}
        hoverColor={"rgba(0, 0, 0, 0.570588)"}
       >menu</FontIcon>
      </IconButton>
    }
    onRightIconButtonTouchTap={ui.handleToggle}
   > <SiteMenu /> </AppBar>
  )
 }

 getHome () {
  this.props.router.push({
   pathname:'',
  })
 }

}

@observer
class SiteMenu extends React.Component {
  render () {
    const ui = headerui

    return (
     <Drawer docked={false} openSecondary={true} open={ui.menuOpen} onRequestChange={(open) => ui.setOpenState(open)}>
      <AppBar
       style={styles.appbar}
       title={<span style={styles.title} className="stories360"> {translate("header").title} </span>}
       iconElementRight={<img src="client/images/logo.png" style={styles.logo} />}
      />

       <Link to={"/about"}>
         <MenuItem
          rightIcon={<img src="client/images/logo.png"/>}
          primaryText={translate("header").about}
          onTouchTap={ui.handleClose}
         />
       </Link>

       <Link to={"/tips"}>
         <MenuItem
          rightIcon={<FontIcon className="material-icons">highlight</FontIcon>}
          primaryText={translate("header").tips}
          onTouchTap={ui.handleClose}
         />
       </Link>

       <Link to={"/lesson"}>
         <MenuItem
          rightIcon={<FontIcon className="material-icons">school</FontIcon>}
          primaryText={translate("header").lesson}
          onTouchTap={ui.handleClose}
         />
       </Link>

       <Link to={"/privacy"}>
        <MenuItem
         rightIcon={<FontIcon className="material-icons">security</FontIcon>}
         primaryText={translate("header").privacy}
         onTouchTap={ui.handleClose}
        />
       </Link>

       <Link to={"/tos"}>
        <MenuItem
         rightIcon={<FontIcon className="material-icons">edit</FontIcon>}
         primaryText={translate("header").tos}
         onTouchTap={ui.handleClose}
        />
       </Link>

       <Link to={"/mail"}>
         <MenuItem
          rightIcon={<FontIcon className="material-icons">mail_outline</FontIcon>}
          primaryText={translate("header").mail}
          onTouchTap={ui.handleClose}
         />
       </Link>

     </Drawer>
    )
  }
}



export default withRouter(Header)
