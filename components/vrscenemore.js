import React from 'react'
import {observer} from 'mobx-react'
import {Container,Row,Col} from 'react-grid-system'
import SocialShare from './socialshare'
import FlagMail from './mailFlag'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FontIcon from 'material-ui/FontIcon'
import FlatButton from 'material-ui/FlatButton'
import Messenger from './messenger'
import vrscenemorestore from '../stores/vrscenemoreui'
import {amber600,lightBlue400} from 'material-ui/styles/colors'
import { SpeedDial, BubbleList, BubbleListItem } from 'react-speed-dial'
import {translate} from '../client/lang/translation'
import messenger from '../stores/messenger.js'
import Avatar from 'material-ui/Avatar'


@observer
class VRSceneMore extends React.Component {
  render () {
    const ui = vrscenemorestore
    const style = this.props.style

    return (
      <span style={style}>
       <SpeedDial
        positionH="right"
        positionV="top"
        isOpen={ui.speedDialOpen}
        icon={<FontIcon className="material-icons">more_vert</FontIcon>}
        onChange={ui.toggleSpeedDialOpen}
       >

        <BubbleList>

         <BubbleListItem
          primaryText={translate("socialShare").title}
          onTouchTap={this.shareScene}
          rightAvatar={
           <Avatar size={40} backgroundColor={lightBlue400} icon={<FontIcon className="material-icons">share</FontIcon>}/>
          }
         />

         <BubbleListItem
          primaryText={translate("socialShare").like}
          onTouchTap={this.likeScene}
          rightAvatar={
           <Avatar size={40} backgroundColor={lightBlue400} icon={<FontIcon className="material-icons">thumb_up</FontIcon>}/>
          }
         />

         <BubbleListItem
          primaryText={translate("socialShare").flag}
          rightAvatar={
           <Avatar size={40} backgroundColor={lightBlue400} icon={<FontIcon className="material-icons">flag</FontIcon>}/>
          }
          onTouchTap={this.flagScene}
         />

  			</BubbleList>

       </SpeedDial>

       <SocialShare />
       <FlagMail />
      </span>
    )
  }

  shareScene () {
    const ui = vrscenemorestore
    ui.handleCloseSpeedDial()
    ui.handleShareingDialogOpen()
  }

  likeScene () {
   const ui = vrscenemorestore
   ui.addLike()
   ui.handleCloseSpeedDial()
  }

  flagScene () {
    const ui = vrscenemorestore
    ui.handleCloseSpeedDial()
    ui.handleOpenFlagDialog()
  }

}


export default VRSceneMore
