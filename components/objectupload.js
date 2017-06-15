import React from 'react'
import {SpeedDial, SpeedDialItem} from 'react-mui-speeddial'
import FontIcon from 'material-ui/FontIcon'
import {translate} from '../client/lang/translation'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import DropzoneComponent from 'react-dropzone-component'
import TextField from 'material-ui/TextField'
import {getUrlParameter} from '../client/js/helper'
import stores from '../stores/vrestores'
import {observer} from 'mobx-react'
import socket from '../client/js/socket'
import {Card,CardTitle,CardMedia} from 'material-ui/Card'
import {Container,Row,Col} from 'react-grid-system'
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Waypoint from 'react-waypoint'
import ReactPlayer from 'react-player'
import FloatingActionButton from 'material-ui/FloatingActionButton'

const styles = {
  searchIcon:{
    verticalAlign:"middle"
  },
  searchBar:{
    width:"92%"
  }
}

@observer
class ObjectUpload extends React.Component {

 render () {
  const store = stores.app
  const ui = stores.ui.objectupload

  let actions = null
  if (ui.currentType === 'text') {
   actions = <FlatButton
     label={translate("objectUpload").add}
     primary={true}
     onTouchTap={ui.addObject}
    />
  }

  return (
   <div style={this.props.style} className={this.props.className} ref='mid'>
    <SpeedDial
     fabContentOpen={<FontIcon className="material-icons">add</FontIcon>}
     fabContentClose={<FontIcon className="material-icons">close</FontIcon>}
    >
     <SpeedDialItem
      label={translate("objectUpload").text}
      fabContent={<FontIcon className="material-icons">title</FontIcon>}
      onTouchTap={ui.handleOpen.bind(this,'text')}
     />

     <SpeedDialItem
      label={translate("objectUpload").image}
      fabContent={<FontIcon className="material-icons">image</FontIcon>}
      onTouchTap={ui.handleOpen.bind(this,'image')}
     />

     <SpeedDialItem
      label={translate("objectUpload").audio}
      fabContent={<FontIcon className="material-icons">audiotrack</FontIcon>}
      onTouchTap={ui.handleOpen.bind(this,'audio')}
     />

     <SpeedDialItem
      label={translate("objectUpload").video}
      fabContent={<FontIcon className="material-icons">video_library</FontIcon>}
      onTouchTap={ui.handleOpen.bind(this,'video')}
     />

    </SpeedDial>

    <Dialog
     title={ui.modalTitle}
     modal={false}
     open={ui.open}
     onRequestClose={ui.handleClose}
     autoScrollBodyContent={true}
     contentStyle={{position: 'absolute',left: '50%',top: '50%',transform: 'translate(-50%, -50%)',width:"100%"}}
     actions={actions}
    >
     <UploadDialog />
    </Dialog>
   </div>
  )
 }

}

@observer
class UploadDialog extends React.Component {

 render () {
  const ui = stores.ui.objectupload

  return (
   ui.currentType === 'text'  && <TextUpload  /> ||
   ui.currentType === 'image' && <ImageUpload /> ||
   ui.currentType === 'audio' && <AudioUploadDirect /> ||
   ui.currentType === 'video' && <VideoUpload />
  )
 }

}

@observer
class ImageUpload extends React.Component {

  render () {
   const ui = stores.ui.objectupload
   const componentConfig = {postUrl: '/upload'}
   const djsConfig = {
    autoProcessQueue: true,
    addRemoveLinks: false,
    multiple: false,
    maxFilesize: 20,
    dictDefaultMessage:translate("global").dropzoneMessage,
    params:{vr:getUrlParameter('vr'),type:'entity',from:socket.id}
   }
   const eventHandlers = {
    success: this.fileSuccess,
    fileadded: this.fileAdded
   }

   return (
    <div style={{paddingTop:24}}>
     <DropzoneComponent
   	  config={componentConfig}
      eventHandlers={eventHandlers}
      djsConfig={djsConfig}
 	   />
    </div>
   )
  }

 fileSuccess (file) {
   const srvObj = JSON.parse(file.xhr.response)
   stores.app.addObjectFromServer(srvObj)
   stores.ui.objectupload.handleClose()
 }

 fileAdded (file) {
  if (!file.type.match(/image.*/)) {
   console.log("not an image")
  }
 }

}

@observer
class TextUpload extends React.Component {

  render () {
   const ui = stores.ui.objectupload
   return (
    <TextField
     hintText={translate("objectUpload").shortText}
     multiLine={true}
     rows={1}
     rowsMax={4}
     fullWidth={true}
     defaultValue=""
     id="textuploadinput"
     onChange={ui.setCurrentSrc}
    />
   )
  }

}

@observer
class AudioUploadDirect extends React.Component {
  render () {
    const componentConfig = {postUrl:'/upload'}
    const djsConfig = {
     autoProcessQueue: true,
     addRemoveLinks: false,
     maxFiles:1,
     multiple: false,
     maxFilesize: 20,
     dictDefaultMessage:translate("global").dropzoneMessage,
     params:{vr:getUrlParameter('vr'),type:'audio',from:socket.id}
    }
    const eventHandlers = {
     success: this.fileSuccess,
     addedfile:this.addedFile
    }

    return (
     <div>

      <p> {translate("vreditor").uploadAudioDescription} </p>

      <DropzoneComponent
       config={componentConfig}
       eventHandlers={eventHandlers}
       djsConfig={djsConfig}
      />

    </div>
   )
  }

  fileSuccess (file) {
    const srvObj = JSON.parse(file.xhr.response)
    stores.app.addObjectFromServer(srvObj)
    stores.ui.objectupload.handleClose()
  }

}

@observer
class AudioUploadYoutube extends React.Component {

  render () {
   const youtube = stores.ui.youtube
   const audio = stores.ui.audioplayer
   return (
     <div>
       <IconButton style={styles.searchIcon} onTouchTap={youtube.search}>
        <FontIcon className="material-icons">search</FontIcon>
       </IconButton>
       <TextField
        key="youtube-audio"
        hintText={translate("objectUpload").search}
        onChange={this.search.bind(this)}
        onKeyPress={this.showResults.bind(this)}
        style={styles.searchBar}
       />
       <ReactPlayer
         url={audio.currentUrl}
         playing={audio.playing}
         volume={audio.volume}
         hidden={true}
       />
       <Container>
        <Row >
         {youtube.results.length === 0 &&
           <div style={{textAlign:"center",padding:30}}>
            <FontIcon className="fa fa-youtube" style={{color:'#e62117',fontSize:"500%"}}/>
            <p>{translate("objectUpload").youtube}</p>
           </div>
         }
         <List>
           {youtube.results.map((video,index) => {
             return <YouTubePreview
                     video={video}
                     key={index}
                     hasWaypoint={youtube.fireNextSearchAtItem==index}
                     index={index}
                    />
            })
          }
          </List>
        </Row>
       </Container>
    </div>
   )
  }

  componentDidMount () {
    const youtube = stores.ui.youtube
    const audio = stores.ui.audioplayer
    youtube.resetSearch()
    audio.resetPlayer()
  }

  showResults (e) {
    if (e.keyCode === 13 || e.which === 13) {
      stores.ui.youtube.search()
    }
  }

  search (e,value) {
    stores.ui.youtube.resetSearch(value)
  }
}


@observer
class YouTubePreview extends React.Component {
  render () {
   const video = this.props.video
   const iamSelected = stores.ui.audioplayer.currentSelectedIndex == this.props.index
   const style = {background:iamSelected?"rgba(0,0,0,.2)":"none"}
   let rightIconButton = null

   if (iamSelected) {
     rightIconButton =
      <FloatingActionButton mini={true} onClick={stores.ui.objectupload.addObject}>
       <FontIcon className="material-icons">add</FontIcon>
    </FloatingActionButton>
   }

   return (
    <ListItem
     onTouchTap={this.select.bind(this,video)}
     leftAvatar={<Avatar src={video.snippet.thumbnails.medium.url} />}
     primaryText={video.snippet.title}
     secondaryText={<p> {video.snippet.description} </p>}
     secondaryTextLines={2}
     innerDivStyle={style}
     rightIconButton={rightIconButton}
    >
     {this.props.hasWaypoint && <Waypoint onEnter={stores.ui.youtube.search}/>}
    </ListItem>
   )
  }

  select (video) {
    const audio = stores.ui.audioplayer
    const ui = stores.ui.objectupload
    const preview = stores.ui.ytpreview

    ui.setCurrentSrc(video.id.videoId)
    ui.setCurrentVideoDuration(video.id.videoId)

    audio.setCurrentSelectedIndex(this.props.index)
    audio.setCurrentUrl(video.id.videoId)

    this.props.isVideo ? preview.handleOpen() : audio.startPlaying()
  }
}


@observer
class VideoUpload extends React.Component {

  render () {
   const youtube = stores.ui.youtube
   const video = stores.ui.audioplayer
   const preview = stores.ui.ytpreview
   return (
     <div>
       <IconButton style={styles.searchIcon} onTouchTap={youtube.search}>
        <FontIcon className="material-icons">search</FontIcon>
       </IconButton>
       <TextField
        key="youtube-video"
        hintText={translate("objectUpload").search}
        onChange={this.search.bind(this)}
        onKeyPress={this.showResults.bind(this)}
        style={styles.searchBar}
       />
       <Dialog
        open={preview.open}
        onRequestClose={preview.handleClose}
        actions={
          <FlatButton
           label={translate("objectUpload").add}
           primary={true}
           onTouchTap={this.addVideo.bind(this)}
          />
        }
       >
        <VideoPreview video={video} />
       </Dialog>
       <Container>
        <Row>
        {youtube.results.length === 0 &&
          <div style={{textAlign:"center",padding:30}}>
           <FontIcon className="fa fa-youtube" style={{color:'#e62117',fontSize:"500%"}}/>
           <p>{translate("objectUpload").youtube}</p>
           <div className="bs-callout bs-callout-info">
            <FontIcon className="material-icons">info_outline</FontIcon> {translate("objectUpload").youtubeVideoWarning}
           </div>
          </div>
        }
         <List>
           {youtube.results.map((video,index) => {
             return <YouTubePreview
                     video={video}
                     key={index}
                     hasWaypoint={youtube.fireNextSearchAtItem==index}
                     index={index}
                     isVideo={true}
                    />
            })
          }
          </List>
        </Row>
       </Container>
    </div>
   )
 }

 componentDidMount () {
   const youtube = stores.ui.youtube
   const audio = stores.ui.audioplayer
   youtube.resetSearch()
   audio.resetPlayer()
 }

 showResults (e) {
   if (e.keyCode === 13 || e.which === 13) {
     stores.ui.youtube.search()
   }
 }

 search (e,value) {
   stores.ui.youtube.resetSearch(value)
 }

 addVideo () {
   stores.ui.objectupload.addObject()
   stores.ui.objectupload.handleClose()
   stores.ui.ytpreview.handleClose()
 }

}


class VideoPreview extends React.Component {

 render () {
  const video = this.props.video
  const url = 'https://youtube.com/watch?v='+video.currentUrl
  return (
   <ReactPlayer
    url={url}
    controls={true}
    playing={true}
    width={"100%"}
   />
  )
 }

}



export default ObjectUpload
