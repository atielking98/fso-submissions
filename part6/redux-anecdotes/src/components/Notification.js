import { useSelector } from 'react-redux'

const Notification = () => {
  const notifications = useSelector(({anecdotes, notifications, filter}) => notifications)
      
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      { notifications.notification }
    </div>
  )
}

export default Notification