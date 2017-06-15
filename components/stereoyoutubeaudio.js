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
    padding:10,
    backgroundColor:"rgba(0,0,0,.5)",
    transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"
  },
  closeButton:{
    position:"absolute",
    right:0,
    bottom:0
  },
  closeIcon:{
    fontSize:48
  },
  image:{
    width:"50%",
    height:"100%",
    backgroundRepeat:"no-repeat",
    backgroundPosition:"center center",
    backgroundSize:"100%",
    display:"inline-block"
  }
}

@observer
class StereoYoutubeAudioPlayer extends React.Component {
  render () {
    const audio = vrsceneuistore.stereoAudio

    const opts = {
      height: '100%',
      width: '100%',
      playerVars: {
       controls: 0,
       disablekb: 1,
       fs: 0,
       rel: 0,
       iv_load_policy: 3
     }
    }

    return (
      <div style={
        Object.assign(
          {},
          styles.root,
          {display:audio.visible?'block':'none'}
        )
       }>
       <div style={styles.relRoot}>
        <div
         style={styles.untouch}
         onMouseDown={audio.togglePlaying}
         onTouchStart={audio.togglePlaying}
         onMouseUp={audio.checkLongTap}
         onMouseLeave={audio.checkLongTap}
         onTouchEnd={audio.checkLongTap}
         onTouchCancel={audio.checkLongTap}
        >
         {!audio.playing &&
          <div style={styles.infomessage}>
           {translate("vrscene").tapToPlay}
           <div>{translate("vrscene").holdToClose}</div>
          </div>
         }
        </div>
        <div style={
          Object.assign(
            {},
            styles.image,
            {backgroundImage:"url("+audio.youtubeImage+")"}
          )
        }/>
        <div style={
          Object.assign(
            {},
            styles.image,
            {backgroundImage:"url("+audio.youtubeImage+")"}
          )
        }/>
        <YouTube videoId={audio.id} opts={opts} onReady={this.onReady1.bind(this)} className="youtube-audio-iframe"/>
       </div>
      </div>
    )
  }

  onReady1 (event) {
   const audio = vrsceneuistore.stereoAudio
   audio.setPlayer(event.target)
  }

}


export default StereoYoutubeAudioPlayer


// <iframe id="ytplayer" type="text/html" width="720" height="405"
// src="https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&controls=0&disablekb=1&enablejsapi=1&fs=0&rel=0&iv_load_policy=3"
// frameborder="0" allowfullscreen>
