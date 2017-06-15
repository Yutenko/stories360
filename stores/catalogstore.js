import {observable, action, computed, toJS} from 'mobx'
import socket from '../client/js/socket'


class CatalogStore {
  @observable currentSearchWord
  @observable results = []
  @observable isSearching = false
  @observable thereIsMoreToLoad = true
  offset = 0
  incrementBy = 15

  @action reset () {
    this.offset = 0
    this.results.length = 0
  }

  @action setCurrentSearchWord (searchWord) {
    this.currentSearchWord = searchWord
    this.reset()
  }

  @action.bound search () {
    this.isSearching = true
    socket.sendMessage(
      socket.MESSAGES.GET_PUBLIC_SCENES,
      {keyword:this.currentSearchWord,offset:this.offset},
      (results) => {
        this.increaseOffset()
        results.map(r => {
         this.results.push(new Scene(r))
        })
        this.isSearching = false
        // if results smaller than expected results --> there is nothing more, hide ui elements
        this.thereIsMoreToLoad = !(results.length < this.incrementBy)
      }
    )
  }

  @action increaseOffset () {
    this.offset += this.incrementBy
  }


}

class Scene {
  title
  subtitle
  share_uid_public
  image

  constructor (json) {
   const {title,subtitle,share_uid_public,image} = json ? json : {}
   this.title = title
   this.subtitle = subtitle
   this.share_uid_public = share_uid_public
   this.image = image
  }


  @computed get thumbnail () {
    const path = this.image.substring(0, this.image.lastIndexOf("/"))
    const filename = this.image.substring(this.image.lastIndexOf('/')+1)

    return path + '/thumb_' + filename
  }

  @computed get link () {
    return window.location.protocol+'//'+window.location.host+'/watch?vr='+this.share_uid_public
  }
}


const catalog = new CatalogStore()
export default catalog
