import {observable, action, computed, toJS} from 'mobx'
import {getUrlParameter,extractVideoID,imageExists} from '../client/js/helper'
import shortid from 'shortid'
import socket from '../client/js/socket'
import {translate} from '../client/lang/translation'

class VREStore {
 @observable uid
 @observable title = ""
 @observable subtitle = ""
 @observable backgroundimage = {}
 @observable backgroundaudio = {}
 @observable objects = []
 @observable scenes = []
 @observable share_uid_private
 @observable share_uid_public
 @observable public
 @observable invalid_access = false
 @observable deleted_access = false

 constructor () {
   this.setUID()
 }

 @action resetStore () {
   this.uid = shortid.generate()
   this.title = ""
   this.subtitle = ""
   this.backgroundimage = {}
   this.backgroundaudio = {}
   this.objects = []
   this.scenes = []
   this.share_uid_public = null
   this.share_uid_private = null
   this.public = false
   this.invalid_access = false
 }

 @action setUID () {
   const param = getUrlParameter('vr')
   if (param !== '' && param != 'undefined') {
     this.uid = param
   } else this.uid = shortid.generate()
 }


 addRealtimeUpdates () {
  if (!this.public) {
    socket.addPrivateRealtimeUpdates({
      onUpdateTitle:this.onUpdateTitle,
      onUpdateSubtitle:this.onUpdateSubtitle,
      onUpdateDescription:this.onUpdateDescription,
      onAddObject: this.onAddObject,
      onUpdateObject:this.onUpdateObject,
      onDeleteObject:this.onDeleteObject,
      onUpdateBackgroundimagePath:this.onUpdateBackgroundimagePath,
      onUpdateBackgroundimageType:this.onUpdateBackgroundimageType,
      onDeleteBackgroundimage:this.onDeleteBackgroundimage,
      onUpdateBackgroundaudioPath:this.onUpdateBackgroundaudioPath,
      onUpdateBackgroundaudioVolume:this.onUpdateBackgroundaudioVolume,
      onDeleteBackgroundaudio:this.onDeleteBackgroundaudio,
      onAddSceneToStory:this.onAddSceneToStory,
      onDeleteSceneFromStory:this.onDeleteSceneFromStory,
      onUpdateSceneOrder:this.onUpdateSceneOrder
    })
  } else {
    socket.addPublicRealtimeUpdates({
      onSetPublic:this.onSetPublic
    })
  }

 }

 @action init (payload,cb) {
  let msg = socket.MESSAGES.INIT_APP
  msg = payload ? socket.MESSAGES.INIT_SCENE : msg

  socket.sendMessage(msg,payload,(app) => {
   // if an app is accessed by an id that is not in sync with client, kill it --> server sends invalid accessed
   // for example - someone requests a vrscene by public id and this app is no longer public
   if (app.invalid_access) {
     this.invalid_access = true
   }
   else if (app.deleted_access) {
     this.deleted_access = true
   } else {
    this.uid = app.uid && app.uid !== "" ? app.uid : null
    this.share_uid_private = app.share_uid_private && app.share_uid_private !== "" ? app.share_uid_private : null
    this.share_uid_public = app.share_uid_public && app.share_uid_public !== "" ? app.share_uid_public : null
    this.title = app.title ? app.title : ""
    this.public = app.public || app.public === 0 ? app.public : 0
    this.subtitle = app.subtitle ? app.subtitle : ""
    this.backgroundimage = new Backgroundimage(app.backgroundimage)
    this.backgroundaudio = new Backgroundaudio(app.backgroundaudio)
    this.objects = app.objects.map((obj) => {
      return new CircleObject(obj)
    })

    // always add yourself on first place
    if (!this.hasScene(this.share_uid_public)) {
     this.addScene(
      new Scene({
       share_uid_public:this.share_uid_public,
       share_uid_private:this.share_uid_private,
       title:this.title,
       subtitle:this.subtitle,
       image:this.backgroundimage.path
      })
     )
    }

    app.scenes.map(scene => {
      this.addScene(new Scene(scene))
    })

    if (cb) cb(this)
   }
  })
 }

 @action.bound updateScene (share_uid_public) {
   this.scenes.map(scene => {
     if (scene.share_uid_public === share_uid_public) {
       scene.title = this.title
       scene.subtitle = this.subtitle
       scene.image = this.backgroundimage.path
     }
   })
 }

 @action swapCircleObject (co) {
   return this.objects.map((obj, index) => {
     if (obj.id === co.id) {
       const temp = obj
       this.objects[index] = this.objects[this.objects.length-1]
       this.objects[this.objects.length-1] = temp
       return this.objects[this.objects.length-1]
     }
   })
 }

 @action swapScene (change, withMe) {
   // dont swap the original vr scene (must be at first)
   if (change === this.share_uid_public || withMe === this.share_uid_public) return

   let changeIndex, withMeIndex

   this.scenes.map((scene,index) => {
     if (scene.share_uid_public === change) {
       changeIndex = index
     }
     if (scene.share_uid_public === withMe) {
       withMeIndex = index
     }
   })

   if ((changeIndex || changeIndex === 0) && (withMeIndex || withMeIndex === 0)) {
    const temp = this.scenes[changeIndex]
    this.scenes[changeIndex] = this.scenes[withMeIndex]
    this.scenes[withMeIndex] = temp

    // reflect changes on the server
    this.updateSceneOrderServer()
   }

 }

 @action hasScene (share_uid_public) {
   let hasScene = false
   this.scenes.map(scene => {
    if (scene.share_uid_public === share_uid_public) {
      hasScene = true
    }
   })

   return hasScene
 }

 updateSceneOrderServer () {
   let order = this.scenes.map(scene => {
     return {apps_linked:scene.share_uid_public}
   })
   socket.sendMessage(socket.MESSAGES.UPDATE_SCENE_ORDER,{order:order,share_uid_public:this.share_uid_public})
 }

 @action.bound deleteSceneServer (scene) {
   this.deleteScene(scene)
   socket.sendMessage(socket.MESSAGES.DELETE_SCENE_FROM_STORY,{app:this.share_uid_public,app_linked:scene.share_uid_public})
 }

 @action.bound addSceneServer (scene) {
   this.addScene(scene)
   socket.sendMessage(socket.MESSAGES.ADD_SCENE_TO_STORY,{app:this.share_uid_public,app_linked:scene.share_uid_public})
 }

 @action.bound addScene (sceneJSON) {
  this.scenes.push(new Scene(sceneJSON))
 }

 @action.bound deleteScene (scene) {
   this.scenes = this.scenes.filter(s => {
     if (s.share_uid_public !== scene.share_uid_public) {
       return s
     }
   })
 }

 @computed get hasTitle () {
   return this.title && this.title !== ''
 }

 @computed get hasSubtitle () {
   return this.subtitle && this.subtitle !== ''
 }

 @action updateTitle (title) {
   this.title = title
   this.updateScene(this.share_uid_public)
 }

 @action updateSubtitle (subtitle) {
   this.subtitle = subtitle
   this.updateScene(this.share_uid_public)
 }

 updateDescriptionServer () {
   socket.sendMessage(socket.MESSAGES.UPDATE_DESCRIPTION,{title:this.title,subtitle:this.subtitle})
 }

 updateTitleServer () {
  socket.sendMessage(socket.MESSAGES.UPDATE_TITLE,{src:this.title})
 }

 updateSubtitleServer () {
  socket.sendMessage(socket.MESSAGES.UPDATE_SUBTITLE,{src:this.subtitle})
 }

 @action addObject (obj) {
   if (obj.src) {
     socket.sendMessage(socket.MESSAGES.ADD_OBJECT,obj,(srvObj) => {
       this.objects.push(new CircleObject(srvObj))
     })
   }
 }

 @action addObjectFromServer (srvObj) {
   this.objects.push(new CircleObject(srvObj))
 }

 getObjects (placement) {
   return this.objects.filter((obj) => {
     if (obj.placement === placement) return obj
   })
 }

 getObjectById (id) {
  let obj = this.objects.filter(o => {
   if (o.id == id) return o
  })

  return obj && obj.length > 0 ? obj[0] : null
 }

 @action.bound swapItemCircle (id,distance) {
   const item = this.getObjectById(id)

   if (item) {
    item.switchPlacement(distance)
    item.updateObjectServer()
   }
 }

 @action.bound deleteObject (circleObject) {
   this.objects.remove(circleObject)
   socket.sendMessage(socket.MESSAGES.DELETE_OBJECT,toJS(circleObject))
 }

 @computed get getEditorPdfLink () {
   return window.location.protocol+'//'+window.location.host+'/pdf?uid='+this.uid
 }

 @computed get getCardboardLink () {
   return this.public ?
          window.location.protocol+'//'+window.location.host+'/watch?vr='+this.share_uid_public :
          window.location.protocol+'//'+window.location.host+'/watch?vr='+this.share_uid_private+'&pr=1'
 }

 @computed get getEmbedCode () {
   const src = this.public ?
    '//'+window.location.host+'/watch?vr='+this.share_uid_public :
    '//'+window.location.host+'/watch?vr='+this.share_uid_private+'&pr=1'

   return '<iframe src="'+src+'" frameborder="0" width="100%" height="500px" allowfullscreen mozallowfullscreen></iframe>'
 }

 @computed get getPublishNote () {
   return this.public ? translate("sharing").public : translate("sharing").private
 }

 @computed get publishTitle () {
   return this.public ? translate("sharing").dePublish : translate("sharing").publish
 }

 @action.bound setPublic (value) {
   this.public = value
   socket.sendMessage(socket.MESSAGES.SET_PUBLIC,{public:this.public})
 }

 /*
  Realtime
  Provide local manipulation of the app for sync between editor and scenes
 */

 @action.bound onUpdateTitle (data) {
 }

 @action.bound onUpdateSubtitle (data) {
 }

 @action.bound onUpdateDescription (data) {
   if (data.title && data.title !== "") {
     this.title = data.title
   }
   if (data.subtitle && data.subtitle !== "") {
     this.subtitle = data.subtitle
   }
 }

 @action.bound onAddObject (obj) {
   if (obj.src) {
     this.objects.push(new CircleObject(obj))
   }
 }

 @action.bound onDeleteObject (obj) {
   this.objects = this.objects.filter(o => {
     return o.id !== obj.id
   })
 }

 @action.bound onUpdateObject (obj) {
   this.objects.filter(o => {
     if (o.id === obj.id) o.updateAll(obj)
   })
 }

 @action.bound onUpdateBackgroundimagePath (data) {
   this.backgroundimage.setPath(data.path)
 }

 @action.bound onUpdateBackgroundimageType (data) {
   this.backgroundimage.setType(data.type)
 }

 @action.bound onDeleteBackgroundimage (data) {
 }

 @action.bound onUpdateBackgroundaudioPath (data) {
  this.backgroundaudio.setPath(data.path)
 }

 @action.bound onUpdateBackgroundaudioVolume (data) {
  this.backgroundaudio.setVolume(data.volume)
 }

 @action.bound onDeleteBackgroundaudio (data) {
   this.backgroundaudio.setPath("")
 }

 @action.bound onAddSceneToStory (data) {
 }

 @action.bound onDeleteSceneFromStory (data) {
 }

 @action.bound onUpdateSceneOrder (data) {
 }

 @action.bound onSetPublic (data) {
 }

}

class Backgroundimage {
 @observable path
 @observable type

 constructor (json) {
   const {path,type} = json ? json : {}
   this.path = path ? path : ""
   this.type = type ? type : "2d"
 }

 @computed get hasImage () {
   return this.path && this.path !== ''
 }

 @computed get thumbnail () {
   const path = this.path.substring(0, this.path.lastIndexOf("/"))
   const filename = this.path.substring(this.path.lastIndexOf('/')+1)

   return path + '/thumb_' + filename + '?v='+Math.random()
 }

 @computed get isPanorama () {
   return this.type === "360"
 }

 @action.bound setPath (path) {
   this.path = path
 }

 @action.bound setType (type) {
   this.type = type
 }

 @action.bound setPathServer (path) {
   this.setPath(path)
   socket.sendMessage(socket.MESSAGES.UPDATE_BACKGROUNDIMAGE_PATH,{path:path})
 }

 @action.bound setTypeServer () {
   const type = this.type == "2d" ? "360" : "2d"
   this.setType(type)
   socket.sendMessage(socket.MESSAGES.UPDATE_BACKGROUNDIMAGE_TYPE,{type:type})
 }

 @action.bound deleteImage () {
   this.path = ""
   socket.sendMessage(socket.MESSAGES.DELETE_BACKGROUNDIMAGE)
 }

}

class CircleObject {
 id
 @observable src
 @observable type
 @observable rotate
 @observable scale
 @observable raise
 @observable placement
 @observable text
 @observable tts
 @observable youtubestarttime
 @observable youtubemaxduration
 @observable volume

 constructor (json) {
   this.updateAll(json)
 }

 @action setYoutubeStarttime (seconds) {
   this.youtubestarttime = seconds
 }

 @action setYoutubeMaxDuration (maxSeconds) {
   this.youtubemaxduration = maxSeconds
 }

 @action setVolume (volume) {
   this.volume = volume
 }

 @action updateAll (json) {
   const {id,src,type,rotate,scale,raise,placement,text,tts,youtubestarttime,youtubemaxduration,volume} = json || {}
   this.id = id || Math.random()*Math.random()
   this.src = src || ""
   this.type = type || ""
   this.rotate = rotate || rotate === 0 ? rotate : 270
   this.scale = scale || scale === 0 ? scale : 1
   this.raise = raise || raise === 0 ? raise : 1
   this.placement = placement || 2
   this.text = text ? text : ""
   this.tts = tts || tts === 0 ? tts : 0
   this.youtubemaxduration = youtubemaxduration || youtubemaxduration === 0 ? youtubemaxduration : 0
   this.youtubestarttime = youtubestarttime || youtubestarttime === 0 ? youtubestarttime : 0
   this.volume = volume || volume === 0 ? volume : 0.8
 }

 @computed get getRotation () {
  return this.rotate
 }

 @computed get getImageRotation () {
   return 360 - (this.rotate % 360)
 }

 @computed get getImage () {
  var img = ""
  if (this.type === 'image') {
   img = this.src
  }
  else {
   img = 'client/images/'+this.type+'.png'
  }

  return img
 }

 @action.bound setRotate (rotation) {
   let angle = rotation % 360
   if (angle < 0) angle += 360
   this.rotate = angle
 }

 @action.bound updateObjectServer () {
   socket.sendMessage(socket.MESSAGES.UPDATE_OBJECT,toJS(this))
 }

 // editing purpose
 @action setSrc (src) {
   this.src = src
 }

 @action setScale (scale) {
   this.scale = scale
 }

 @action setRaise (raise) {
   this.raise = raise
 }

 @action setText (text) {
   this.text = text
 }

 @action setStartTime (seconds) {
   this.youtubestarttime = seconds
 }

 @action.bound setTTSServer (tts) {
   this.tts = tts
   this.updateObjectServer()
 }

 @action setPlacement (placement) {
   this.placement = placement
 }

 @action.bound switchPlacement (distance) {
   let placementToSwitchTo = -1
   // distance has to map to placements
   if (distance === 8) placementToSwitchTo = 3
   else if (distance === 6) placementToSwitchTo = 2
   else if (distance === 4) placementToSwitchTo = 1

   if (this.placement !== placementToSwitchTo) {
    this.setPlacement(placementToSwitchTo)
   }
 }

}


class Backgroundaudio {
  @observable path
  @observable volume

  constructor (json) {
    const {path,volume} = json ? json : {}
    this.path = path ? path : ""
    this.volume = volume ? volume : 0.8
  }

  @computed get getBackgroundImage () {
   const youtubeVideoId = extractVideoID(this.path)
   if (youtubeVideoId && youtubeVideoId !== "") {
    return 'http://img.youtube.com/vi/'+youtubeVideoId+'/hqdefault.jpg'
   } else return 'client/images/backgroundmusic.png'
  }

  @action.bound setPath (path) {
    this.path = path
  }

  @action.bound setVolume (volume) {
    this.volume = volume
  }

  @action.bound setPathServer (path) {
    if (path && path !== "") {
     this.setPath(path)
     socket.sendMessage(socket.MESSAGES.UPDATE_BACKGROUNDAUDIO_PATH,{path:path})
    }
  }

  @action.bound setVolumeServer () {
    socket.sendMessage(socket.MESSAGES.UPDATE_BACKGROUNDAUDIO_VOLUME,{volume:this.volume})
  }

  @action.bound deleteAudio () {
    this.path = ""
    socket.sendMessage(socket.MESSAGES.DELETE_BACKGROUNDAUDIO)
  }

}


class Scene {
  share_uid_public
  share_uid_private
  @observable title
  @observable subtitle
  @observable image

  constructor (json) {
    const {share_uid_public,share_uid_private,title,subtitle,image} = json ? json : {}
    this.share_uid_public = share_uid_public
    this.share_uid_private = share_uid_private
    this.title = title
    this.subtitle = subtitle
    this.image = image
  }

  @computed get thumbnail () {
    const image = this.image.substring(0, this.image.lastIndexOf("/"))
    const filename = this.image.substring(this.image.lastIndexOf('/')+1)
    const thumbnail =  image + '/thumb_' + filename

    return thumbnail
  }

}




export default VREStore
