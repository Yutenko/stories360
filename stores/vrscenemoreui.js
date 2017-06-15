import {observable, action, computed, toJS} from 'mobx'
import stores from './vrestores'
import socket from '../client/js/socket'


class VRSceneMoreStore  {
 @observable sharingDialogOpen = false
 @observable speedDialOpen = false
 @observable message = ""
 @observable flagDialogOpen = false

 @action.bound handleShareingDialogOpen () {
  this.sharingDialogOpen = true
 }

 @action.bound handleShareingDialogClosed () {
  this.sharingDialogOpen = false
 }

 @action.bound toggleSpeedDialOpen () {
   this.speedDialOpen = !this.speedDialOpen
 }

 @action.bound handleOpenSpeedDial () {
   this.speedDialOpen = true
 }

 @action.bound handleCloseSpeedDial () {
   this.speedDialOpen = false
 }

 @action.bound addLike () {
   socket.sendMessage(socket.MESSAGES.LIKE_SCENE,{share_uid_public:stores.app.share_uid_public})
 }

 @action.bound setMessage (msg) {
   this.message = msg
 }

 @action flagScene (cb) {
   if (this.message !== "") {
    socket.sendMessage(socket.MESSAGES.SEND_MAIL_FLAG_SCENE,{share_uid_public:stores.app.share_uid_public,message:this.message},cb)
   }
 }

 @action.bound handleOpenFlagDialog () {
   this.flagDialogOpen = true
 }

 @action.bound handleCloseFlagDialog () {
   this.flagDialogOpen = false
 }

}


const vrscenemorestore = new VRSceneMoreStore()
export default vrscenemorestore
