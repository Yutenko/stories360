import React from 'react'
import messenger from '../stores/messenger.js'
import Snackbar from 'material-ui/Snackbar'
import {observer} from 'mobx-react'



@observer
class Messenger extends React.Component {
  render () {
    const store = messenger

    return (
      <Snackbar
        action={store.withAction?store.action:""}
        onActionTouchTap={store.onActionCallback}
        open={store.open}
        message={store.message}
        autoHideDuration={store.autoHideDuration}
        onRequestClose={store.handleRequestClose}
      />
    )
  }

}



export default Messenger
