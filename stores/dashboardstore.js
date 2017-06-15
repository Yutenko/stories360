import {observable, action, computed, toJS} from 'mobx'
import socket from '../client/js/socket'


class Dashboard {
 @observable isLoggedIn = false
 @observable user = ""
 @observable pw = ""
 @observable url = ""
 @observable hasScene = false
 @observable scene = {
   public:0,
   deleted:0
 }

 @action.bound setUser (user) {
   this.user = user
 }

 @action.bound setPW (pw) {
   this.pw = pw
 }

 @action.bound setURL (share_uid_public,share_uid_private,isPublic) {
   this.url = isPublic ?
      '//stories360.org/watch?vr='+share_uid_public :
      '//stories360.org/watch?vr='+share_uid_private+'&pr=1'
 }

 login () {
   if (this.user !== "" && this.pw !== "") {
     socket.sendMessage(socket.MESSAGES.DASHBOARD_LOGIN,{user:this.user,pw:this.pw}, (response) => {
       if (response === 'LOGIN_SUCCESS') {
         this.isLoggedIn = true
         this.user = ""
         this.pw = ""
       }
     })
   }
 }

 filterIDfromURL (url) {
  const pattern = /\?vr=[0-9a-zA-Z-_\+]+/g
  const mat = url.match(pattern)

  return mat && mat[0] ? mat[0].split('=')[1] : null
 }

 @action loadScene (url) {
   const stories360ID = this.filterIDfromURL(url)
   if (stories360ID && stories360ID !== "") {
    this.scene = null
    this.hasScene = false
    socket.sendMessage(socket.MESSAGES.DASHBOARD_SCENE_GET, {id:stories360ID}, (response) => {
      if (response === 'SCENE_FAILED') {
        this.scene = null
        this.hasScene = false
      } else {
        this.scene = response
        this.setURL(this.scene.share_uid_public,this.scene.share_uid_private,this.scene.public)
        this.hasScene = true
      }
    })
   }
 }

 @action updatePublic (value) {
   this.scene.public = value
   socket.sendMessage(socket.MESSAGES.SET_PUBLIC,{public:value,id:this.scene.uid})
 }

 @action updateDelete (value) {
   this.scene.deleted = value
   socket.sendMessage(socket.MESSAGES.DASHBOARD_SCENE_DELETE,{uid:this.scene.uid})
 }

}


const DashboardStore = new Dashboard()
export default DashboardStore
