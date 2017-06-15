import React from 'react'
import {Container,Row,Col} from 'react-grid-system'
import {purple500,orange500,amber600} from 'material-ui/styles/colors'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Avatar from 'material-ui/Avatar'
import {translate} from '../client/lang/translation'
import DropzoneComponent from 'react-dropzone-component'
import TextField from 'material-ui/TextField'
import FontIcon from 'material-ui/FontIcon'
import Dialog from 'material-ui/Dialog'
import {getUrlParameter} from '../client/js/helper'
import socket from '../client/js/socket'
import Checkbox from 'material-ui/Checkbox'
import {observer} from 'mobx-react'
import stores from '../stores/vrestores'
import messenger from '../stores/messenger.js'
import FloatingActionButton from 'material-ui/FloatingActionButton'

var styles = {
 paper:{
  height:400,
  marginTop:-10,
  marginBottom:-10,
  backgroundRepeat:"no-repeat",
  backgroundPosition:"center center",
  backgroundSize:"cover",
  position:"relative",
  cursor:"pointer"
 },
 backgroundImageHint:{
  textAlign:"center",
  paddingTop:175,
  fontSize:"200%",
  color:"rgba(200,200,200,.5)"
 },
 indicator:{
  position:"absolute",
  left:10,
  top:10,
  color:amber600
 }
}

@observer
class ImageUpload extends React.Component {
  render () {
    const ui = stores.ui.imageupload
    const store = stores.app.backgroundimage
    const bgImg = store.path !== '' ? store.path + '?v='+Math.random() : null
    const degreeIcon = store.isPanorama ? 'sphere' : 'cylinder'

    return (
     <Container>
      <Row>
       <Col md={12}>
        <Paper
         zDepth={1}
         onTouchTap={ui.handleOpen}
         style={
          Object.assign(
           {},
           styles.paper,
           {backgroundImage:"url("+bgImg+")"}
          )
         }
         >
         {bgImg &&
           <FloatingActionButton
            style={Object.assign({},styles.indicator,{color: "#ffffff"})}
            onTouchTap={this.changeDegree}
            backgroundColor={amber600}
            className="animated tada"
           >
            <img src={"client/images/"+degreeIcon+".png"} style={{width:55,height:"auto"}} />
          </FloatingActionButton>
         }
         {!bgImg &&
           <FontIcon
            className="material-icons"
            style={Object.assign({},styles.indicator,{transform: "rotate(320deg)",fontSize:"500%"})}
           >touch_app</FontIcon>
         }
         {!bgImg &&
          <div style={styles.backgroundImageHint}>{translate("vreditor").backgroundImageTitle}</div>
         }
         <Dialog
          title={translate("vreditor").uploadImage}
          modal={false}
          open={ui.open}
          onRequestClose={ui.handleClose}
         >
          <Uploader
           setPanoramaBackground={store.setTypeServer}
           isPanorama={store.isPanorama}
           pasteURL={this.pasteURL}
           setBackground={this.setBackground}
          />
         </Dialog>
        </Paper>
       </Col>
      </Row>
     </Container>
    )
  }

  changeDegree (e) {
    e.stopPropagation()
    const bgImg = stores.app.backgroundimage
    const msg = bgImg.isPanorama ? messenger.MESSAGES.cylinder : messenger.MESSAGES.sphere

    bgImg.setTypeServer()

    messenger.show(msg, () => {
      window.location = stores.app.getCardboardLink
    })
  }

  pasteURL (path) {
    stores.app.backgroundimage.setPathServer(path)
    stores.app.updateScene(stores.app.share_uid_public) // hack
    stores.ui.imageupload.handleClose()
  }

  setBackground (path) {
    stores.app.backgroundimage.setPath(path)
    stores.app.updateScene(stores.app.share_uid_public) // hack
    stores.ui.imageupload.handleClose()
  }

  deleteImage () {
    stores.app.backgroundimage.deleteImage()
    stores.app.updateScene(stores.app.share_uid_public) // hack
    stores.ui.imageupload.handleClose()
  }


}

@observer
class Uploader extends React.Component {
  constructor (props) {
    super(props)
    this.fileSuccess = this.fileSuccess.bind(this)
    this.pasteURL = this.pasteURL.bind(this)
    this.setPanoramaBackground = this.setPanoramaBackground.bind(this)
  }

 render () {
   const componentConfig = {
    postUrl:'/upload'
   }
   const djsConfig = {
    autoProcessQueue: true,
    addRemoveLinks: false,
    maxFiles:1,
    multiple: false,
    maxFilesize: 20,
    dictDefaultMessage:translate("global").dropzoneMessage,
    params:{vr:getUrlParameter('vr'),type:'background',from:socket.id}
   }
   const eventHandlers = {
    success: this.fileSuccess,
    addedfile:this.addedFile
   }

   return (
    <div>

     <p> {translate("vreditor").backgroundImageDescription} </p>

     <DropzoneComponent
   	  config={componentConfig}
      eventHandlers={eventHandlers}
      djsConfig={djsConfig}
     />

    {/*
     <p style={{textAlign:"center",marginTop:40}}> {translate("global").or.toUpperCase()} </p>

     <TextField
      hintText={translate("vreditor").pasteURL}
      onChange={this.pasteURL}
      fullWidth={true}
     />
     */}
    </div>

   )
  }

  setPanoramaBackground (e,value) {
    this.props.setPanoramaBackground(value)
  }

 fileSuccess (file) {
  const {path} = JSON.parse(file.xhr.response)
  this.props.setBackground(path)
 }

 addedFile (file) {
  if (!file.type.match(/image.*/)) {
   console.log("not an image")
  }
 }

 pasteURL (e,input) {
  this.props.pasteURL(input)
 }

}


export default ImageUpload
