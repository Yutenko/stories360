import {observable, action, computed, toJS} from 'mobx'
import {translate} from '../client/lang/translation'


class MessengerStore {
 @observable open = false
 @observable message = ''
 autoHideDuration = 4000
 @observable withAction = false
 @observable action = translate("messages").show
 @observable onActionCallback

 constructor () {
   this.MESSAGES = {
    pdfIsCreated:translate("messages").pdfIsCreated,
    directLinkCopied:translate("messages").directLinkCopied,
    embedCopied:translate("messages").embedCopied,
    mailSent:translate("messages").mailSent,
    sphere:translate("messages").sphere,
    cylinder:translate("messages").cylinder
   }
 }

 @action.bound show (msg,action) {
   if (action) {
     this.withAction = true
     this.onActionCallback = action
     this.autoHideDuration = 6000
   }

   this.message = msg
   this.open = true
 }

 @action.bound handleRequestClose () {
   if (this.withAction) {
    this.withAction = false
    this.onActionCallback = null
    this.autoHideDuration = 4000  
   }

   this.open = false
 }

}


const messenger = new MessengerStore()
export default messenger
