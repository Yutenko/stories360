import React from 'react'
import {observer} from 'mobx-react'
import vrsceneuistore from '../stores/vrsceneuistore'
import YouTube from 'react-youtube'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import {Container,Row,Col} from 'react-grid-system'
import LinearProgress from 'material-ui/LinearProgress'

import {translate} from '../client/lang/translation'
const styles = {
  root:{
    position:"absolute",
    width:"100%",
    height:"100%",
    zIndex:999999, // to get above the cardboard layer on mobile devices
    top:0,
    left:0
  },
  relRoot:{
    position:"relative",
    width:"100%",
    height:"100%",
    background:'#000'
  },
  untouch:{
    position:"absolute",
    width:"100%",
    height:"100%"
  },
  infomessage:{
    textAlign:"center",
    color:'#fff',
    fontSize:36,
    marginTop:150,
    paddingLeft:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:"rgba(0,0,0,.5)",
    transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
    width:"47%",
    display:"inline-block"
  },
  closeButton:{
    position:"absolute",
    right:0,
    bottom:0
  },
  closeIcon:{
    fontSize:48
  }
}

@observer
class StereoYoutubeVideoPlayer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {toggleTimer:null}
  }

  render () {
    const video = vrsceneuistore.stereoVideo

    const opts = {
      height: '100%',
      width: '50%',
      playerVars: {
       controls: 0,
       disablekb: 1,
       fs: 0,
       rel: 0,
       iv_load_policy: 3,
       start: video.starttime
     }
    }

    return (
      <div style={
        Object.assign(
          {},
          styles.root,
          {display:video.visible?'block':'none'}
        )
       } id="stereo-youtube-player">
       <div style={styles.relRoot}>
        <div
         style={styles.untouch}
         onClick={this.togglePlaying}
        >
         {!video.playing &&
          <div>
           <div style={styles.infomessage}> {translate("vrscene").tapToPlay} </div>
           <div style={styles.infomessage}> {translate("vrscene").tapToPlay} </div>
          </div>
         }
        </div>
        <YouTube videoId={video.id} opts={opts} onReady={this.onReady1.bind(this)} />
        <YouTube videoId={video.id} opts={opts} onReady={this.onReady2.bind(this)} />
       </div>
      </div>
    )
  }

  togglePlaying () {
    vrsceneuistore.stereoVideo.togglePlaying()
    vrsceneuistore.setBackgroundAudioVolume(vrsceneuistore.backgroundAudioPlayer.getAttribute('data-volume'))
  }

  onReady1 (event) {
   const video = vrsceneuistore.stereoVideo
   video.setPlayer1(event.target)
  }

  onReady2 (event) {
   const video = vrsceneuistore.stereoVideo
   video.setPlayer2(event.target)
   event.target.mute()
  }
}


export default StereoYoutubeVideoPlayer


// <iframe id="ytplayer" type="text/html" width="720" height="405"
// src="https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&controls=0&disablekb=1&enablejsapi=1&fs=0&rel=0&iv_load_policy=3"
// frameborder="0" allowfullscreen>
