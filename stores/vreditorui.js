import {observable, action, computed, toJS} from 'mobx'
import {translate} from '../client/lang/translation'
import {youtubeTimeConverter} from '../client/js/helper'
import stores from './vrestores'
import socket from '../client/js/socket'

export class ShowWhen {
  @observable releaseCockpitAcknowledged = false

  @action reset () {
    this.releaseCockpitAcknowledged = false
  }

  @action.bound setReleaseCockpitAcknowledged () {
    this.releaseCockpitAcknowledged = true
  }

  @computed get showReleaseCockpit () {
    return stores.app.backgroundimage &&
           stores.app.backgroundimage.hasImage &&
           !this.releaseCockpitAcknowledged
  }

  @computed get showCockpit () {
    return stores.app.backgroundimage &&
           stores.app.backgroundimage.hasImage &&
           this.releaseCockpitAcknowledged

  }

  @computed get showPublish () {
    return (stores.app.backgroundimage &&
           stores.app.backgroundimage.hasImage &&
           stores.app.hasTitle &&
           stores.app.hasSubtitle) || stores.app.public
  }

}

export class ImageUploadUIStore {
 @observable open = false

 @action reset () {
   this.open = false
 }

 @action.bound handleOpen() {
  this.open = true
 }

 @action.bound handleClose() {
  this.open = false
 }

}

export class AudioUploadUIStore {
 @observable open = false

 @action reset () {
   this.open = false
 }

 @action.bound handleOpen() {
  this.open = true
 }

 @action.bound handleClose() {
  this.open = false
 }

}

export class DescriptionUIStore {
 @observable open = false

 @action reset () {
   this.open = false
 }

 @action.bound handleOpen() {
  this.open = true
 }

 @action.bound handleClose() {
  this.open = false
 }

}

export class SharingEditorUIStore {
  @observable openEmbed = false
  @observable openQRCode = false
  @observable openPublish = false
  @observable speedDialOpen = false
  @observable openAccessData = false
  @observable mail = ""

  @action reset () {
   this.openEmbed = false
   this.openQRCode = false
   this.openPublish = false
   this.speedDialOpen = false
   this.openAccessData = false
   this.mail = ""
  }

  @action sendMail (cb) {
    if (this.mail !== '') {
      socket.sendMessage(
        socket.MESSAGES.SEND_MAIL_ACCESSDATA,
        {toWhom:this.mail},
        (result) => {
          if (cb) cb()
        }
      )
    }
  }

  @action.bound setMail (mail) {
    this.mail = mail
  }

  @action.bound toggleSpeedDialOpen () {
    this.speedDialOpen = !this.speedDialOpen
  }

  @action.bound handleSpeedDialOpen () {
    this.speedDialOpen = true
  }

  @action.bound handleSpeedDialClose () {
    this.speedDialOpen = false
  }

  @action.bound handleOpenEmbed () {
   this.openEmbed = true
  }

  @action.bound handleCloseEmbed () {
   this.openEmbed = false
  }

  @action.bound handleAccessDataOpen () {
    this.openAccessData = true
  }

  @action.bound handleAccessDataClose () {
    this.openAccessData = false
  }

  @action.bound handleOpenQRCode() {
   this.openQRCode = true
  }

  @action.bound handleCloseQRCode() {
   this.openQRCode = false
  }

  @action.bound handleOpenPublish() {
   this.openPublish = true
  }

  @action.bound handleClosePublish() {
   this.openPublish = false
  }

}

export class ObjectUploadUIStore {
  @observable open = false
  @observable currentType
  @observable currentSrc
  @observable currentVideoDuration

  @action reset () {
    this.open = false
    this.currenType = null
    this.currentSrc = null
    this.currentVideoDuration = null
  }

  @action setCurrentType (type) {
    this.currentType = type
  }

  @action.bound setCurrentSrc (e) {
    if (e.target) {
     this.currentSrc = e.target.value
   } else {
     this.currentSrc = e
   }
  }

  @action.bound setCurrentVideoDuration (videoId) {
    const request = gapi.client.youtube.videos.list({
      part: 'contentDetails',
      id: videoId
    })
    request.execute((response) => {
     const duration = youtubeTimeConverter(response.result.items[0].contentDetails.duration)
     this.currentVideoDuration = duration
    })
  }

  @action.bound handleOpen(type) {
   this.setCurrentType(type)
   this.open = true
  }

  @action.bound handleClose() {
   this.open = false
  }

  @action.bound addObject () {
   stores.app.addObject({type:this.currentType,src:this.currentSrc,youtubemaxduration:this.currentVideoDuration})
   this.handleClose()
  }

  @computed get modalTitle () {
    if (this.currentType === 'text')
     return translate("objectUpload").text + ' ' + translate("objectUpload").write
    if (this.currentType === 'image')
     return translate("objectUpload").image + ' ' + translate("objectUpload").upload
    if (this.currentType === 'audio')
     return translate("objectUpload").audio + ' ' + translate("objectUpload").upload
    if (this.currentType === 'video')
     return translate("objectUpload").video + ' ' + translate("objectUpload").search

    return ''
  }
}

export class SceneUIStore {
  @observable open = false
  @observable keyword = ""
  @observable results = []
  @observable currentSelectedIndex = -1
  offset = 0
  increaseBy = 10

  @action reset () {
    this.open = false
    this.keyword = ""
    this.results = []
    this.currentSelectedIndex = -1
  }

  @action.bound getCurrentDragenterId () {
    return this.currentDragenterId
  }

  @action.bound handleOpen () {
    this.open = true
  }

  @action.bound handleClose () {
    this.open = false
  }

  @action setCurrentKeyword (keyword) {
    this.keyword = keyword
  }

  @action setCurrentSelectedIndex (index) {
    this.currentSelectedIndex = index
  }

  @action increaseOffset () {
    this.offset += this.increaseBy
  }

  @action reset () {
    this.results = []
    this.keyword = ""
    this.currentSelectedIndex = -1
    this.resetOffset()
  }

  @action resetOffset () {
    this.offset = 0
  }

  @action resetCurrentSelectedIndex () {
    this.currentSelectedIndex = -1
  }

  @action resetResults () {
    this.results = []
  }

  @action addThumbnail (scene) {
    const image = scene.image.substring(0, scene.image.lastIndexOf("/"))
    const filename = scene.image.substring(scene.image.lastIndexOf('/')+1)
    const thumbnail =  image + '/thumb_' + filename

    scene.thumbnail = thumbnail
    return scene
  }

  @action.bound search (reset) {
    if (reset) this.resetOffset()

    socket.sendMessage(
      socket.MESSAGES.GET_PUBLIC_SCENES,
      {keyword:this.keyword,offset:this.offset},
      (results) => {

        if (reset) {
          this.resetResults()
          this.resetCurrentSelectedIndex()
        }

        if (results && results.length > 0) {
         results.map(r => {
          this.results.push(this.addThumbnail(r))
         })
         this.increaseOffset()
       }

      }
    )
  }

  filterIDfromURL (url) {
   const pattern = /\?vr=[0-9a-zA-Z-_\+]+/g
   const mat = url.match(pattern)

   return mat[0].split('=')[1]
  }

  @action.bound searchByURL (url) {
    const data = this.filterIDfromURL(url)
    socket.sendMessage(
      socket.MESSAGES.SEARCH_BY_URL,
      {id:data,share_uid_public:stores.app.share_uid_public},
      (result) => {
        stores.app.addScene(result)
        this.handleClose()
      }
    )
  }

  @computed get fireNextSearchAtItem () {
    return this.results.length - 5
  }

}

export class CircleObjectUIStore {
  @observable open = false
  @observable anchorElement
  @observable currentItem
  @observable textFocused = false
  @observable currentDragItem
  @observable currentDragTrigger

  @action reset () {
    this.open = false
    this.anchorElement = null
    this.currentItem = null
    this.textFocused = false
    this.currentDragItem = null
    this.currentDragTrigger = null
  }

  @action.bound setCurrentDragTrigger (trigger) {
    this.currentDragTrigger = trigger
  }

  @action.bound setCurrentDragItem (item) {
    this.currentDragItem = item
  }

  @action.bound handleOpen(anchorElement,item) {
   this.anchorElement = anchorElement
   this.currentItem = item
   this.open = true
  }

  @action.bound handleClose() {
   this.open = false
  }

  @action.bound toggleTextFocus () {
    this.textFocused = !this.textFocused
  }

  @computed get typeSmbol () {
    let img = 'client/images/'+this.currentItem.type+'.png'
    if (this.currentItem.type === 'image') img = this.currentItem.src

    return img
  }

}

export class YouTubeVideoPreviewStore {
  @observable open = false

  @action reset () {
    this.open = false
  }

  @action.bound handleOpen () {
    this.open = true
  }
  @action.bound handleClose () {
    this.open = false
  }
}

export class AudioPlayerUIStore {
  @observable playing = false
  @observable currentUrl
  @observable currentSelectedIndex = -1

  @action reset () {
    this.playing = false
    this.currentUrl = null
    this.currentSelectedIndex = -1
  }

  @action resetPlayer () {
    this.playing = false
    this.currentUrl = null
    this.currentSelectedIndex = -1
  }

  @action.bound togglePlaying () {
    this.playing = !this.playing
  }

  @action.bound stopPlaying () {
    this.playing = false
  }

  @action.bound startPlaying () {
    this.playing = true
  }

  @action getCurrentUrl () {
    return this.currentUrl+'?v='+Math.random()
  }

  @action setCurrentUrl (url) {
    this.currentUrl = url
  }

  @action setCurrentSelectedIndex (index) {
    this.currentSelectedIndex = index
  }


}

export class BackgroundAudioUIStore {
  @observable playing = false
  @observable currentUrl
  @observable currentSelectedIndex = -1

  @action reset () {
    this.playing = false
    this.currentUrl = null
    this.currentSelectedIndex = -1
  }

  @action resetPlayer () {
    this.playing = false
    this.currentUrl = null
    this.currentSelectedIndex = -1
  }

  @action.bound togglePlaying () {
    this.playing = !this.playing
  }

  @action.bound stopPlaying () {
    this.playing = false
  }

  @action.bound startPlaying () {
    this.playing = true
  }

  @action getCurrentUrl () {
    return this.currentUrl
  }

  @action setCurrentUrl (serverPath) {
    this.currentUrl = serverPath
  }

  @action setCurrentSelectedIndex (index) {
    this.currentSelectedIndex = index
  }
}

export class YoutubeResultsUIStore {
  @observable results = []
  @observable currentKeyword
  @observable pageToken = null
  maxResults = 20
  type = 'video'

  @action reset () {
    this.results = []
    this.currentKeyword = ""
    this.pageToken = null
  }

  @computed get fireNextSearchAtItem () {
    return this.results.length - 5
  }

  @action resetSearch (keyword) {
    this.setCurrentKeyword(keyword)
    this.results = []
    this.pageToken = null
  }

  @action setCurrentKeyword (keyword) {
    this.currentKeyword = keyword
  }

  @action.bound search () {
    const request = gapi.client.youtube.search.list({
     part: 'snippet',
     q:this.currentKeyword,
     pageToken: this.pageToken,
     maxResults:this.maxResults,
     type: this.type
    })
    request.execute((response) => {
     this.pageToken = response.nextPageToken
     response.items.map(r => { this.results.push(r); })
    })
  }



}

export class CircleUIStore {
  @observable center = { x:0, y:0 }
  @observable currentRotation
  @observable radius = 0
  @observable circleRef
  @observable relativePosition
  @observable playing = false
  @observable soundFile = 'client/audio/blubb.wav'
  @observable showIntro = true

  @action reset () {
    this.center = { x:0, y:0 }
    this.currentRotation = null
    this.radius = 0
    this.circleRef = null
    this.relativePosition = null
    this.playing = false
    this.showIntro = true
  }

  @action.bound hideIntro () {
    this.showIntro = false
  }

  @action.bound setCurrentRotation (rotation) {
    this.currentRotation = rotation
  }

  @action.bound setCircle (circleRef) {
    this.circleRef = circleRef
    this.setCenter()
  }

  @action.bound setCenter () {
    const rect = this.circleRef.getBoundingClientRect()

    this.center.x = rect.width / 2
    this.center.y = rect.height / 2
    this.setRelativePosition()
  }

  @action.bound setRelativePosition () {
    const rect = this.circleRef.getBoundingClientRect()
    const bodyRect = document.body.getBoundingClientRect()

    this.relativePosition = {
      left : rect.left - bodyRect.left,
      top  : rect.top - bodyRect.top
    }
  }

  @action.bound playNewObjectSound () {
    this.playing = true
    setTimeout( () => {
      this.playing = false
    },1000)
  }

}
