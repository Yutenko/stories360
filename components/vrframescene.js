{/*import 'aframe'*/}

{/*import 'aframe-bmfont-text-component'*/}
import 'aframe-look-at-component'
import 'whatwg-fetch'

import '../node_modules/artyom.js/build/artyom.min.js'
import Promise from 'promise-polyfill'
import {toJS} from 'mobx'

import React from 'react'
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react'
import {Container,Row,Col} from 'react-grid-system'
import {Scene,Entity} from 'aframe-react'
import ReactPlayer from 'react-player'
import stores from '../stores/vrestores'
import vrsceneuistore from '../stores/vrsceneuistore'
import {getUrlParameter} from '../client/js/helper'
import {translate} from '../client/lang/translation'
import StereoYoutubeVideoPlayer from './stereoyoutubevideo'
import LinearProgress from 'material-ui/LinearProgress'
import Messenger from './messenger'
import VRSceneMore from './vrscenemore'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {amber600} from 'material-ui/styles/colors'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FontIcon from 'material-ui/FontIcon'

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color:amber600
  }
})

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

AFRAME.registerComponent('overload-enter-vr-button', {
  init: function () {
    var button = this.el.querySelector('.a-enter-vr-button');
    button.addEventListener('click', function () {
     const ui = vrsceneuistore
     const audio = stores.app.backgroundaudio

     if (audio.path && audio.path !== '') {
      ui.playBackgroundAudio()
     }
    })
  }
})

AFRAME.registerComponent('page-fully-loaded', {
  init: function () {
   var interval = setInterval(function() {
    if(document.readyState === 'complete') {
     vrsceneuistore.setPageFullyLoaded()
     clearInterval(interval)
    }
   }, 100)
  }
})

const styles = {
  sceneContainer:{
    position:"absolute",
    width:"100%",
    height:"100%",
    top:0,
    left:0
  },
  preContainer:{
    position:"absolute",
    width:"100%",
    height:"100%",
    top:0,
    left:0,
    background:'rgba(255,255,255,1)',
    zIndex:99999
  },
  preCenterContainer:{
   textAlign:"center",
   position: "fixed",
   top:"50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   width:"100%"
  },
  loadingIcon: {
   width:"20%",
   maxWidth:350,
  },
  progressBar:{
   height:30,
   width:"25%",
   left:0,
   right:0,
   margin:"0 auto",
   marginTop:30
 },
 titleBar:{
   position:"absolute",
   top:0,
   left:0,
   backgroundColor:"rgba(0,0,0,.5)",
   width:"100%",
   color:'#fff',
   height:50,
   WebkitBoxShadow: "0px 5px 41px 10px rgba(0,0,0,0.63)",
   MozBoxShadow: "0px 5px 41px 10px rgba(0,0,0,0.63)",
   boxShadow: "0px 5px 41px 10px rgba(0,0,0,0.63)"
 },
 title:{
  paddingLeft:10,
  paddingRight:10,
  paddingTop:10
 },
 subtitle:{
  paddingLeft:12,
  paddingRight:12,
  fontSize:10
 },
 changeMenuDesktop:{
   position:"absolute",
   left:0,
   right:0,
   margin:"0 auto",
   bottom:10,
   width:300,
   zIndex:10,
   textAlign:"center"
 },
 sceneCount:{
   background:"rgba(0,0,0,.5)",
   color:'#fff',
   padding:10
 }
}

@observer
class PreloadMask extends React.Component {
  render () {
    const ui = vrsceneuistore

    return (
      <div style={styles.preContainer}>
       <Container>
        <Row>
         <Col lg={12} md={12} sm={12} xs={12}>
          <div style={styles.preCenterContainer}>
           <h1 className="stories360"> {translate("header").title} </h1>
           <img src="client/images/logo.png" style={styles.loadingIcon} />
           <LinearProgress
            mode="determinate"
            value={ui.preloadPercentage}
            style={styles.progressBar}
            max={100}
            min={0}
            color={amber600}
           />
           {ui.preloadingDone && false &&
            <FlatButton
             label={translate("vrscene").ready}
             onTouchTap={ui.startVr}
            />
           }
          </div>
         </Col>
        </Row>
       </Container>
      </div>
    )
  }

}

class InvalidAccess extends React.Component {
  render () {
    return (
      <div style={styles.preContainer}>
       <Container>
        <Row>
         <Col lg={12} md={12} sm={12} xs={12}>
          <div style={styles.preCenterContainer}>
           <h1 className="stories360"> {translate("header").title} </h1>
           <img src="client/images/logo.png" style={styles.loadingIcon} />
           <p> {translate("vrscene").invalid_access} </p>
          </div>
         </Col>
        </Row>
       </Container>
      </div>
    )
  }
}

class DeletedAccess extends React.Component {
  render () {
    return (
      <div style={styles.preContainer}>
       <Container>
        <Row>
         <Col lg={12} md={12} sm={12} xs={12}>
          <div style={styles.preCenterContainer}>
           <h1 className="stories360"> {translate("header").title} </h1>
           <img src="client/images/logo.png" style={styles.loadingIcon} />
           <p> {translate("vrscene").deleted_access} </p>
          </div>
         </Col>
        </Row>
       </Container>
      </div>
    )
  }
}

@observer
class VRFrameScene extends React.Component {

  constructor () {
    super()
    this.getPosition = this.getPosition.bind(this)
    this.getScale = this.getScale.bind(this)
    this.initTTS = this.initTTS.bind(this)
    this.getChangeSceneMenu = this.getChangeSceneMenu.bind(this)
    this.onEntityGaze = this.onEntityGaze.bind(this)
  }

  render () {
   const store = stores.app

   return (
     <MuiThemeProvider muiTheme={muiTheme}>
      <div>
       {store.invalid_access && <InvalidAccess />}
       {store.deleted_access && <DeletedAccess />}
       {!store.invalid_access && !store.deleted_access && this.getScene()}
      </div>
    </MuiThemeProvider>
   )
  }

 componentWillMount () {
  this.initScene()
 }

 componentDidMount () {
  this.initTTS()

  const ui = vrsceneuistore,
        bga = document.getElementById('bga'),
        scene = document.querySelector('a-scene'),
        stereoYoutubePlayer = document.getElementById('stereo-youtube-player')

  ui.setBackgroundAudioPlayer(bga)
  ui.stereoVideo.setScene(scene)
  ui.stereoVideo.setElem(stereoYoutubePlayer)
  window.addEventListener("load", function() { window.scrollTo(0, 0); })
 }

 initScene () {
   const uid = getUrlParameter('vr')
   const isPrivate = getUrlParameter('pr') === "1" ? true : false
   const app = stores.app
   const ui = vrsceneuistore
   app.init({public:!isPrivate,uid:uid},(app) => {
     ui.setScenes(app.scenes)
   })
   app.addRealtimeUpdates()
 }

 initTTS () {
   artyom.initialize({
    lang:"de-DE",
    debug:true,
    speed:1
   })
 }

 onEntityGaze (entity,id) {
  const ui = vrsceneuistore

  // only if no video is playing
  if (!ui.stereoVideo.isPlaying()) {
    if (entity.tts) {
      if (entity.text) {
       artyom.say(entity.text)
      }
    }

    if (entity.type === 'audio') {
      // stop all entity sounds
      document.querySelector('[sound]').components.sound.stopSound();
      ui.toggleSoundPlaying(document.getElementById(id),id,entity.volume)
    }

    if (entity.type === 'video') {
      const d = document.querySelector('[sound]')
      if (d) d.components.sound.stopSound();
      ui.setBackgroundAudioVolume(0.1)
      ui.stereoVideo.start(entity)
    }
  }
 }

 preload (assets) {
   const ui = vrsceneuistore

   let itemsToPreload = []
   if (assets) {
     if (assets.backgroundimage && assets.backgroundimage.path != "") itemsToPreload.push({src:assets.backgroundimage.path,type:'image'})
     if (assets.objects && assets.objects.length > 0) {
       assets.objects.map(o => {
         if (o.type === 'image') itemsToPreload.push({src:o.src,type:o.type})
       })
     }
   }
   itemsToPreload.push({src:"client/images/audio.png",type:'image'})
   itemsToPreload.push({src:"client/images/video.png",type:'image'})

   ui.setItemsToPreload(itemsToPreload.length)

   itemsToPreload.map( (item,index) => {
    if (item.type === 'image') {
      let img = new Image()
      img.onload = () => {
        const ui = vrsceneuistore
        ui.addPreloadedItem(index)
      }
      img.src = item.src
    }
    else if (item.type === 'audio') {
      let ad = new Audio()
      ad.onLoadedData = () => {
        const ui = vrsceneuistore
        ui.addPreloadedItem(index)
      }
      ad.src = item.src
    }
   })
 }

 getScene () {
   const store = stores.app
   const ui = vrsceneuistore

   this.preload(store)

   return <div style={styles.sceneContainer}>
     {!ui.preloadingDone &&
      <PreloadMask />
     }

    <StereoYoutubeVideoPlayer />

    <Scene overload-enter-vr-button page-fully-loaded>
     {this.getCursor()}
     {this.getBackground(store)}
     {this.getObjects(store)}
     {this.getBackgroundAudio(store)}
     {this.getObjectAudioPlayer()}
     {this.getChangeSceneMenu(store)}
     {this.getChangeSceneMenuDesktop(store)}
    </Scene>

    <div style={styles.titleBar}>
     <div style={styles.title} className="ellipsis"> {store.title} </div>
     <div style={styles.subtitle} className="ellipsis"> {store.subtitle} </div>
    </div>

    <VRSceneMore />
    <Messenger />

   </div>
 }

 getChangeSceneMenuDesktop (store) {
  const ui = vrsceneuistore
  const sceneCount = ui.currentSceneIndex + 1 + "/" + ui.scenes.length

  return <div style={styles.changeMenuDesktop}>

         {ui.hasPrev &&
           <FloatingActionButton onTouchTap={ui.changeScene.bind(this,'prev')} style={{marginRight:10}}>
            <FontIcon className="material-icons">keyboard_arrow_left</FontIcon>
           </FloatingActionButton>
         }

         {ui.scenes.length > 1 && <span style={styles.sceneCount}> {sceneCount} </span>}

         {ui.hasNext &&
          <FloatingActionButton onTouchTap={ui.changeScene.bind(this,'next')} style={{marginLeft:10}}>
           <FontIcon className="material-icons">keyboard_arrow_right</FontIcon>
          </FloatingActionButton>
         }

        </div>
 }

 getChangeSceneMenu (store) {
  const ui = vrsceneuistore
  const color = '#29B6F6'

  return <Entity id="changescenemenu">
   {ui.hasPrev &&
     <Entity
      material={{shader:'flat',side:'double',visible:true,color:color}}
      geometry={{primitive:'circle',radius:0.3}}
      position="-1 0 0"
      rotation="90 0 0"
      scale={[1,-1,-1]}
      key={"asset-prev-scene"}
      text={{value:ui.prevSceneNumber,align:"center",anchor:"center",baseline:"center",color:'white',width:10}}
      onClick={ui.changeScene.bind(this,'prev')}
    />
   }
   {ui.hasNext &&
     <Entity
      material={{shader:'flat',side:'double',visible:true,color:color}}
      geometry={{primitive:'circle',radius:0.3}}
      position="1 0 0"
      rotation="90 0 0"
      scale={[1,-1,-1]}
      key={"asset-next-scene"}
      text={{value:ui.nextSceneNumber,align:"center",anchor:"center",baseline:"center",color:'white',width:10}}
      onClick={ui.changeScene.bind(this,'next')}
    />
   }
  </Entity>

 }

 getObjectAudioPlayer () {
  const audio = vrsceneuistore.audio
  return <ReactPlayer
          url={audio.src}
          playing={audio.playing}
          volume={audio.volume}
          hidden={true}
          key="lib-audio-player"
        />
 }

 getBackgroundAudio (store) {
  const audio = store.backgroundaudio
  const ui = vrsceneuistore

  return <audio
          src={audio.path+'?v='+Math.random()}
          loop={true}
          key="asset-bga"
          id="bga"
          data-volume={audio.volume}
         />

  // return <ReactPlayer
  //         url={audio.path}
  //         playing={ui.backgroundAudioPlaying}
  //         volume={audio.volume}
  //         hidden={true}
  //         key="asset-bga"
  //        />
 }

 getBackground (store) {
  const image = store.backgroundimage
  const src = image.path+'?v='+Math.random()
  const height = 15, radius = 15
  const side = 'double', shader = 'flat'

  if (image.type === "2d") {
   return [
    <Entity
     primitive="a-curvedimage"
     material={{src:src,side:side,shader:shader}}
     position={[0,3,0]}
     rotation={[180,0,0]}
     scale={[1,-1,1]}
     geometry={{height:height,radius:radius,thetaLength:90}}
     key="bg0"/>,
    <Entity
     primitive="a-curvedimage"
     material={{src:src,side:side,shader:shader}}
     position={[0,3,0]}
     geometry={{height:height,radius:radius,thetaLength:90,thetaStart:0}}
     key="bg1"/>,
     <Entity
      primitive="a-curvedimage"
      material={{src:src,side:side,shader:shader}}
      position={[0,3,0]}
      rotation={[180,0,0]}
      scale={[1,-1,1]}
      geometry={{height:height,radius:radius,thetaLength:90,thetaStart:180}}
      key="bg2"/>,
     <Entity
      primitive="a-curvedimage"
      material={{src:src,side:side,shader:shader}}
      position={[0,3,0]}
      geometry={{height:height,radius:radius,thetaLength:90,thetaStart:180}}
      key="bg3"/>
   ]
  }
  else if (image.type === "360") {
   return <Entity
           primitive="a-sky"
           material={{src:src,shader:shader}}
           position={[0,2,0]}
           geometry={{radius:radius}}
          />
  }
 }

 getObjects (store) {
  const objects = store.objects
  const textAppearance = {width:2,lineHeight:50,letterSpacing:5,color:"#ffffff",align:"center"}

  if (objects.length > 0) {
   return objects.map(function (entity,index) {
    let vrEntity = null
    if (entity.type === 'text') {
     vrEntity = <Entity
             text={Object.assign({},textAppearance,{value:entity.src})}
             position={this.getPosition(entity)}
             key={"asset-"+entity.id}
             look-at="[camera]"
             scale={this.getScale(entity)}
             onClick={this.onEntityGaze.bind(this,entity)}
            />
    }
    if (entity.type === 'image') {
     vrEntity = <Entity
             primitive="a-image"
             material={{src:entity.src,side:'double'}}
             position={this.getPosition(entity)}
             key={"asset-"+entity.id}
             look-at="[camera]"
             scale={this.getScale(entity)}
             onClick={this.onEntityGaze.bind(this,entity)}
            />
    }
    if (entity.type === 'audio') {
     const id = "asset-"+entity.id
     vrEntity = <Entity
             primitive="a-image"
             material={{src:"client/images/audio.png"}}
             position={this.getPosition(entity)}
             key={id}
             id={id}
             look-at="[camera]"
             scale={this.getScale(entity)}
             sound={{src:"url("+entity.src+")"}}
             onClick={this.onEntityGaze.bind(this,entity,id)}
            />
    }
    if (entity.type === 'video') {
     vrEntity = <Entity
             primitive="a-image"
             material={{src:"client/images/video.png"}}
             position={this.getPosition(entity)}
             key={"asset-"+entity.id}
             look-at="[camera]"
             scale={this.getScale(entity)}
             onClick={this.onEntityGaze.bind(this,entity)}
            />
    }

    // if has additional text, that sould not be spoken, show underneath
    if (entity.text && !entity.tts) {
      let textPosition = this.getPosition(entity)
      textPosition[0] = textPosition[0] < 0 ? textPosition[0] + 1 : textPosition[0] - 1
      textPosition[1] = textPosition[1] < 0 ? textPosition[1] + 1 : textPosition[1] - 1
      textPosition[2] = textPosition[2] < 0 ? textPosition[2] + 1 : textPosition[2] - 1

      return <Entity key={"asset-container-"+entity.id}>
              {vrEntity}
              <Entity
                geometry={{primitive:"plane",height:"auto"}}
                material={{color:"#000000",side:'double',opacity:0.5}}
                text={Object.assign({},textAppearance,{value:entity.text})}
                position={textPosition}
                key={"asset-subtitle-"+entity.id}
                look-at="[camera]"
                scale={this.getScale(entity)}
               />
             </Entity>
    } else return vrEntity
   }.bind(this))
  }
 }

 getYoutubePath (id) {
   return 'https://youtube.com/watch?v='+id
 }

 getPosition (entity) {
  var x = 10 * Math.cos(entity.rotate * (Math.PI/180))
  var y = entity.raise && (entity.raise >= -9 && entity.raise <= 9) ? entity.raise : 1
  var z = 10 * Math.sin(entity.rotate * (Math.PI/180))

  x = x > -9 ? x : -9 // temporary fix for out of boundson x-axis DELTE IN PRODUCTION
  // correct the z-axis by the placement, each placement means a 2m difference (3 = 10m distance,2 = 8m distance)
  if (entity.placement === 3) {
   z = z >= 0 ? z - 2 : z + 2
  }
  else if (entity.placement === 2) {
   z = z >= 0 ? z - 4 : z + 4
  }
  else if (entity.placement === 1) {
   z = z >= 0 ? z - 6 : z + 6
  }
  return [x,y,z]
 }

 getScale (entity) {
  var scale = entity.scale && (entity.scale >= 1 && entity.scale <= 9) ? entity.scale : 1
  // correct the scale with placement (3 is far away, 1 is near by you)
  if (entity.placement === 1) {
   if (scale < 9) scale += 2
  }
  if (entity.placement === 2) {
   if (scale < 9) scale += 1
  }
  if (scale > 9) scale = 9

  return [scale,scale,scale]
 }

 getCursor () {
  return <Entity primitive="a-camera" key="cursor" look-controls>
          <Entity
           primitive="a-entity"
           cursor={"fuse: true; fuseTimeout: 500"}
           position={[0,0,-1]}
           geometry={{primitive:"ring",radiusOuter:0.03,radiusInner:0.02}}
           material={"color: cyan; shader: flat"}
          />
         </Entity>

 }

}










export default VRFrameScene
