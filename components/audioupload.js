import React from 'react'
import {Container,Row,Col} from 'react-grid-system'
import {purple500,orange500,amber600} from 'material-ui/styles/colors'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Avatar from 'material-ui/Avatar'
import {translate} from '../client/lang/translation'
import {getUrlParameter} from '../client/js/helper'
import TextField from 'material-ui/TextField'
import FontIcon from 'material-ui/FontIcon'
import Dialog from 'material-ui/Dialog'
import Checkbox from 'material-ui/Checkbox'
import {observer} from 'mobx-react'
import stores from '../stores/vrestores'
import {AudioPlayer,AudioPlayerWaves} from './mediaplayer'
import Waypoint from 'react-waypoint'
import ReactPlayer from 'react-player'
import {List, ListItem} from 'material-ui/List'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import IconButton from 'material-ui/IconButton'
import DropzoneComponent from 'react-dropzone-component'
import socket from '../client/js/socket'


const styles = {
 paper:{
  height:400,
  marginBottom:30,
  marginTop:-10,
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
 },
 searchIcon:{
  verticalAlign:"middle"
 },
 searchBar:{
  width:"92%"
 }
}

@observer
class AudioUpload extends React.Component {
  render () {
    const ui = stores.ui.audioupload
    const store = stores.app.backgroundaudio
    const hasAudio = store.path && store.path !== ''

    return (
     <Container>
      <Row>
       <Col md={12}>
        <Paper
         zDepth={1}
         onTouchTap={this.openUploadDialog.bind(this,hasAudio)}
         style={
          Object.assign(
           {},
           styles.paper,
           {backgroundImage:"url("+(hasAudio?store.getBackgroundImage:"")+")"}
          )
         }
         >
         {hasAudio && <AudioPlayerWaves audio={store} />}
         {!hasAudio &&
           <FontIcon
            className="material-icons"
            style={Object.assign({},styles.indicator,{transform: "rotate(320deg)",fontSize:"500%"})}
           >touch_app</FontIcon>
         }
         {hasAudio &&
          <FloatingActionButton
           style={Object.assign({},styles.indicator,{color: "#ffffff"})}
           onTouchTap={this.deleteAudio.bind(this)}
          >
            <FontIcon className="material-icons">delete_forever</FontIcon>
          </FloatingActionButton>
         }
         {!hasAudio &&
          <div style={styles.backgroundImageHint}>{translate("vreditor").backgroundAudioTitle}</div>
         }
         <Dialog
          title={translate("vreditor").uploadAudio}
          modal={false}
          open={ui.open}
          onRequestClose={ui.handleClose}
          autoScrollBodyContent={true}
          contentStyle={{position: 'absolute',left: '50%',top: '50%',transform: 'translate(-50%, -50%)',width:"100%"}}
         >
          <UploaderDirect />
         </Dialog>
        </Paper>
       </Col>
      </Row>
     </Container>
    )
  }

  openUploadDialog (hasAudio) {
    // only trigger uploadevent if no audio is there, otherwise
    if (!hasAudio) {
     const ui = stores.ui.audioupload
     ui.handleOpen()
    }
  }

  deleteAudio (e) {
    e.stopPropagation()
    stores.app.backgroundaudio.deleteAudio()
    stores.ui.audioupload.handleClose()
  }

}

@observer
class UploaderDirect extends React.Component {
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
     params:{vr:getUrlParameter('vr'),type:'background_audio',from:socket.id}
    }

    const eventHandlers = {
     success: this.fileSuccess,
     addedfile:this.addedFile
    }

    return (
     <div>

      <p> {translate("vreditor").backgroundAudioDescription} </p>

      <DropzoneComponent
       config={componentConfig}
       eventHandlers={eventHandlers}
       djsConfig={djsConfig}
      />

    </div>
   )
  }

  fileSuccess (file) {
   const {path} = JSON.parse(file.xhr.response)
   const audio = stores.ui.audioplayer
   audio.setCurrentUrl(path)
   stores.app.backgroundaudio.setPathServer(audio.currentUrl)
   stores.ui.audioupload.handleClose()
  }

}

@observer
class UploaderYoutube extends React.Component {
  constructor (props) {
    super(props)
  }

 render () {
   const youtube = stores.ui.youtube
   const audio = stores.ui.audioplayer
   return (
     <div>
       <IconButton style={styles.searchIcon}>
        <FontIcon className="material-icons" onTouchTap={this.showResults.bind(this)}>search</FontIcon>
       </IconButton>
       <TextField
        key="youtube-bg-audio"
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
        <Row>
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
      <FloatingActionButton mini={true} onClick={this.addBackgroundAudio}>
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

    audio.setCurrentSelectedIndex(this.props.index)
    audio.setCurrentUrl(video.id.videoId)
    audio.startPlaying()
  }

  addBackgroundAudio () {
    const audio = stores.ui.audioplayer
    stores.app.backgroundaudio.setPathServer(audio.currentUrl)
    stores.ui.audioupload.handleClose()
  }
}


export default AudioUpload
