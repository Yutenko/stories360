import {observable, action, computed,toJS} from 'mobx'
import {extractVideoID,getUrlParameter} from '../client/js/helper'
import stores from './vrestores'
import screenfull from 'screenfull'

class VRSceneUIStore {
  @observable currentSceneIndex = 0
  @observable scenes = []
  @observable stereoVideo = new YouTubeStereoVideo()
  @observable audio = new Audio()
  @observable itemsPreloaded = []
  @observable itemsToPreload = 0
  @observable finishedPreloading = false
  @observable finishedApplyingPreloadToScene = false
  @observable pageFullyLoaded = false
  @observable usergestureInit = false
  timeToApplyImagesToScene = 1000
  @observable backgroundAudioPlayer
  @observable currentSoundId
  @observable currentSoundPlaying = false

  @computed get preloadingDone () {
    return this.finishedPreloading && this.finishedApplyingPreloadToScene && this.pageFullyLoaded
  }

  @computed get preloadPercentage () {
    return this.itemsPreloaded.length * 100 / this.itemsToPreload
  }

  @action.bound toggleSoundPlaying (el,id,volume) {
    const sound = el.components.sound
    this.currentSoundPlaying = !this.currentSoundPlaying
    sound.volume = volume ? volume : 0.8
    if (this.currentSoundId === id) {
     if (this.currentSoundPlaying) {
       this.setBackgroundAudioVolume(0.1)
       sound.playSound()
     } else {
       sound.stopSound()
       this.setBackgroundAudioVolume(this.backgroundAudioPlayer.getAttribute('data-volume'))
     }
   } else {
     this.setBackgroundAudioVolume(0.1)
     sound.playSound()
   }
   this.currentSoundId = id
  }

  @action.bound setBackgroundAudioPlayer (domElem,volume) {
    this.backgroundAudioPlayer = domElem
    this.backgroundAudioPlayer.addEventListener('loadeddata', () => {
      this.setBackgroundAudioVolume(this.backgroundAudioPlayer.getAttribute('data-volume'))
    })
  }

  @action.bound setBackgroundAudioVolume (volume) {
    this.backgroundAudioPlayer.volume = volume
  }

  @action.bound playBackgroundAudio () {
    this.backgroundAudioPlayer.play()
  }

  @action.bound startVr () {
    this.usergestureInit = true
  }

  @action.bound setPageFullyLoaded () {
    this.pageFullyLoaded = true
  }

  @action reset () {
    this.itemsPreloaded = []
    this.itemsToPreload = 0
    this.finishedPreloading = false
    this.finishedApplyingPreloadToScene = false
  }

  @action setItemsToPreload (count) {
    this.itemsToPreload = count
  }

  @action addPreloadedItem (key) {
	  let exists = false
    this.itemsPreloaded.map( o => {
	   if (o === key) {
	    exists = true
	   }
    })

	  if (!exists) {
	   this.itemsPreloaded.push(key)

     if (this.itemsPreloaded.length === this.itemsToPreload) {
       this.finishedPreloading = true
       setTimeout(() => {
         this.finishedApplyingPreloadToScene = true
       },this.timeToApplyImagesToScene)
     }
	  }
  }

  @computed get hasNext () {
   return this.currentSceneIndex + 1 < this.scenes.length
  }

  @computed get hasPrev () {
    return this.currentSceneIndex > 0
  }

  @computed get currentSceneId () {
    return this.scenes[this.currentSceneIndex].share_uid_private
  }

  @computed get nextSceneId () {
   return this.scenes[this.currentSceneIndex+1].share_uid_private
  }

  @computed get prevSceneId () {
    return this.scenes[this.currentSceneIndex-1].share_uid_private
  }

  @computed get nextSceneNumber () {
    return this.currentSceneIndex + 2
  }

  @computed get prevSceneNumber () {
    return this.currentSceneIndex
  }

  @action.bound setScenes (scenes) {
    // set scenes only once, so we can keep track of the original story
    if (!this.scenes || this.scenes.length === 0) {
      // we have to deep copy it, otherwise mobx would keep track of observer
      this.scenes = scenes.map(s=>{return s})
    }
  }

  @action incrementCurrentSceneIndex () {
    this.currentSceneIndex++
  }

  @action decrementCurrentSceneIndex () {
    this.currentSceneIndex--
  }

  @action.bound changeScene (action) {
    let share_uid_private = null
    if (action === 'next') {
      share_uid_private = this.nextSceneId
      this.incrementCurrentSceneIndex()
    }
    else if (action === 'prev') {
     share_uid_private = this.prevSceneId
     this.decrementCurrentSceneIndex()
    }
    this.reset()
    stores.app.init({public:false,uid:share_uid_private}, () => {
      const interval = setInterval(() => {
        if (this.preloadingDone) {
          this.playBackgroundAudio()
          clearInterval(interval)
        }
      },200)
    })
  }


}

class Audio {
  @observable playing = false
  @observable src
  @observable volume

  @action togglePlaying () {
    this.playing = !this.playing
  }

  @action setSrc (src) {
    if (this.src !== src) {
      this.src = src
      this.playing = true
    }
  }

  @action playFile (src) {
    this.setSrc(src)
  }

  @action setVolume (volume) {
    this.volume = volume
  }
}

class YouTubeStereoVideo {
  @observable id
  @observable visible = false
  @observable playing = false
  @observable player1
  @observable player2
  @observable scene
  @observable elem
  @observable syncInterval
  @observable starttime
  checkSyncInterval = 1000
  outOfSyncSeconds = 0.1
  playbackQuality = 'default'

  @action start (entity) {
    this.scene.exitVR()
    this.id = entity.src
    this.starttime = entity.youtubestarttime
    this.visible = true
  }

  @action reset () {
    this.scene.enterVR()
    clearInterval(this.syncInterval)
    this.visible = false
    this.playing = false
    this.player1.pauseVideo()
    this.player2.pauseVideo()
    this.syncInterval = null
  }


  @action setElem (el) {
    this.elem = el
  }

  @action isPlaying () {
    return this.playing
  }

  @action.bound startSyncInterval () {
    if (!this.syncInterval) {
      this.syncInterval = setInterval( () => {
        const player1Time = this.player1.getCurrentTime()
        const player2Time = this.player2.getCurrentTime()
        let oneSecondBack = this.starttime + (Math.abs(player1Time - player2Time) - 1)
        oneSecondBack = oneSecondBack <= 0 ? 0 : oneSecondBack

        if (player1Time - player2Time > this.outOfSyncSeconds) {
          this.player1.seekTo(oneSecondBack)
          this.player2.seekTo(oneSecondBack)
          console.log('sync video');
        }
        else if (player2Time - player1Time > this.outOfSyncSeconds) {
          this.player1.seekTo(oneSecondBack)
          this.player2.seekTo(oneSecondBack)
          console.log('sync video');
        }
      },this.checkSyncInterval)
    }
  }

  @action setPlayer1 (player) {
    this.player1 = player
    this.player1.setPlaybackQuality(this.playbackQuality)
  }

  @action setPlayer2 (player) {
    this.player2 = player
    this.player2.setPlaybackQuality(this.playbackQuality)
  }

  @action.bound setScene (scene) {
    this.scene = scene
  }

  @action.bound togglePlaying () {
    if (this.player1 && this.player2) {
      if (!this.playing) {
        // document.documentElement.webkitRequestFullscreen()
        if (screenfull.enabled) screenfull.request()
        this.player1.playVideo()
        this.player2.playVideo()
        this.startSyncInterval()
      } else {
        return this.reset()
      }
      this.playing = !this.playing
    }
  }
}

class YouTubeStereoAudio {
  @observable id
  @observable visible = false
  @observable playing = false
  @observable player1

  @observable scene
  @observable isLongTap = false
  @observable isLongTapTimeout
  isLongTapTime = 1000
  playbackQuality = 'default'

  @action start (entity) {
    this.scene.exitVR()
    this.id = entity.src
    this.visible = true
  }

  @action.bound reset () {
    this.scene.enterVR()

    clearTimeout(this.isLongTapTimeout)

    this.isLongTap = false
    this.visible = false
    this.playing = false
    this.player1.pauseVideo()
    this.isLongTapTimeout = null
  }

  @action.bound checkLongTap () {
    if (this.isLongTapTimeout) {
      clearTimeout(this.isLongTapTimeout)
      this.isLongTapTimeout = null
    }
  }

  @action setPlayer (player) {
    this.player1 = player
    this.player1.setPlaybackQuality(this.playbackQuality)
    this.player1.addEventListener('onStateChange', yt => {
      if (yt.data === 0) {
        // Video ended --> close it
        this.reset()
      }
    })
  }

  @action setScene (scene) {
    this.scene = scene
  }

  @action.bound togglePlaying () {
    this.isLongTapTimeout = setTimeout( () => {
      if (this.isLongTapTimeout) {
       this.reset()
      }
    },this.isLongTapTime)

    if (this.player1) {
      if (!this.playing) {
        this.player1.playVideo()
      } else {
        this.player1.pauseVideo()
      }
      this.playing = !this.playing
    }
  }

  @computed get youtubeImage () {
   return 'http://img.youtube.com/vi/'+this.id+'/hqdefault.jpg'
  }
}

let vrsceneuistore = new VRSceneUIStore()
export default vrsceneuistore
