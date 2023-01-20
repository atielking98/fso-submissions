import { connect } from 'react-redux'

const Notification = ({ notification }) => {      
  if (!notification) {
    return null
  }

  const style = {
    color: notification.type === 'alert' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  return (
    <div id="notification" style={style}>
      {notification.message}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
  }
}


const ConnectedNotification = connect(mapStateToProps)(Notification)
export default ConnectedNotification