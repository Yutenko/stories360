import {observable, action, computed, toJS} from 'mobx'
import socket from '../client/js/socket'

class MailSharingStore {
  @observable open = false
  @observable toWhom = ""
  @observable fromWho = ""

  @action reset () {
    this.open = false
    this.toWhom = ""
    this.fromWho = ""
  }

  @action handleOpen () {
    this.open = true
  }

  @action handleClose () {
    this.open = false
  }

  @action setToWhom (toWhom) {
    this.toWhom = toWhom
  }

  @action setFromWho (fromWho) {
    this.fromWho = fromWho
  }

  @action sendMail (cb) {
    if (this.toWhom !== '' && this.fromWho !== '') {
      socket.sendMessage(socket.MESSAGES.SEND_MAIL_SHARING,{
        toWhom:this.toWhom,
        fromWho:this.fromWho,
      }, (status) => {
        this.reset()
        cb()
      })
    }
  }

}


const mailsharingstore = new MailSharingStore()
export default mailsharingstore
