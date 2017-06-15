import React from 'react'
import ReactPlayer from 'react-player'
import Wavesurfer from 'react-wavesurfer'
import FontIcon from 'material-ui/FontIcon'
import Slider from 'material-ui/Slider'
import stores from '../stores/vrestores'
import {observer} from 'mobx-react'
import {translate} from '../client/lang/translation'

var styles = {
 container: {
 },
 audioPlayPause:{
  color:'#fff',
  fontSize:"800%",
  position:"absolute",
  top:"25%",
  left:"50%",
  left:0,
  right:0,
  textAlign:"center",
  width:"45%",
  maxWidth:180,
  backgroundColor:"rgba(0,0,0,.6)",
  margin:"0 auto"
 },
 audioplayer_volume:{
  position:"absolute",
  height:"100%",
  top:0,
  right:0,
  zIndex:1
 },
 volumeText:{
   position:"absolute",
   right:20,
   top:0,
   backgroundColor:"rgba(0,0,0,.6)",
   padding:10,
   color:"rgba(255,255,255,0.9)"
 },
 sliderStyle:{
   marginBottom:0,
   marginTop:0
 },
 wave:{
   position:"absolute",
   width:"98%",
   bottom:0
 }
}

@observer
class AudioPlayerWaves extends React.Component {
  render () {
   const audio = this.props.audio
   const ui = stores.ui.backgroundaudio
   const volumeInPercentage = parseInt(audio.volume*100)

   return (
    <div>

     <FontIcon
      style={styles.audioPlayPause}
      className="material-icons"
      onTouchTap={this.togglePlaying.bind(this)}
     >
      {ui.playing?"pause":"play_arrow"}
     </FontIcon>
     <Slider
      style={styles.audioplayer_volume}
      sliderStyle={styles.sliderStyle}
      axis="y"
      value={audio.volume}
      onChange={this.setVolume.bind(this)}
      onDragStop={this.setVolumeServer.bind(this)}
     />

     <div style={styles.volumeText}>
      {translate("vreditor").volume} {volumeInPercentage} %
     </div>

     <div style={styles.wave}>
       <Wavesurfer
        audioFile={audio.path}
        playing={ui.playing}
        volume={audio.volume}
        options={{
          backend: 'MediaElement',
          waveColor: '#FFB300',
          progressColor: '#FF8F00'
        }}
       />
     </div>

    </div>
   )
  }

  togglePlaying (e) {
    e.stopPropagation()
    stores.ui.backgroundaudio.togglePlaying()
  }

  setVolume (e,value) {
   e.stopPropagation()
   this.props.audio.setVolume(value)
  }

  setVolumeServer () {
    this.props.audio.setVolumeServer()
  }

}

@observer
class AudioPlayer extends React.Component {

 render () {
  const audio = this.props.audio
  const ui = stores.ui.backgroundaudio
  const volumeInPercentage = parseInt(audio.volume*100)

  return (
   <div>

    <FontIcon
     style={styles.audioPlayPause}
     className="material-icons"
     onTouchTap={this.togglePlaying.bind(this)}
    >
     {ui.playing?"pause":"play_arrow"}
    </FontIcon>
    <Slider
     style={styles.audioplayer_volume}
     sliderStyle={styles.sliderStyle}
     axis="x"
     defaultValue={0.8}
     value={audio.volume}
     onChange={this.setVolume.bind(this)}
     onDragStop={this.setVolumeServer.bind(this)}
    />

    <div style={styles.volumeText}>
     {translate("vreditor").volume} {volumeInPercentage} %
    </div>

    <ReactPlayer
     url={audio.path}
     playing={ui.playing}
     volume={audio.volume}
     hidden={true}
    />
   </div>
  )
 }

 togglePlaying (e) {
   e.stopPropagation()
   stores.ui.backgroundaudio.togglePlaying()
 }

 setVolume (e,value) {
  e.stopPropagation()
  this.props.audio.setVolume(value)
 }

 setVolumeServer () {
   this.props.audio.setVolumeServer()
 }



}


export {AudioPlayer,AudioPlayerWaves}
