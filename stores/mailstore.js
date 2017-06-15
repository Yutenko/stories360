import {observable, action, computed, toJS} from 'mobx'
import socket from '../client/js/socket'


class MailStore {
 @observable name = ""
 @observable mail = ""
 @observable message = ""

 @action sendMail (cb) {
   if (this.name !== "" && this.mail !== "" && this.message !== "") {
    socket.sendMessage(socket.MESSAGES.SEND_MAIL,{
      name:this.name,
      mail:this.mail,
      message:this.message
    }, (status) => {
      this.reset()
      cb()
    })
   }
 }

 @action.bound reset () {
   this.name = ""
   this.mail = ""
   this.message = ""
 }


}

const mailStore = new MailStore()
export default mailStore
