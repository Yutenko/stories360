import {observable, action, computed, toJS} from 'mobx'

class HeaderUiStore {
  @observable menuOpen = false

  @action.bound handleToggle () {
    this.menuOpen = !this.menuOpen
  }

  @action.bound handleClose () {
    this.menuOpen = false
  }

  @action.bound handleOpen () {
    this.menuOpen = true
  }

  @action.bound setOpenState (openState) {
    this.menuOpen = openState
  }

}


const headerui = new HeaderUiStore()
export default headerui
