

const Message = ({message, playerId}) => {
  console.log(message.val());
  return (
      <li className='chat-message' key={message.val().key}><div className={!message.val().author === playerId ? 'chat-player' : 'chat-player mine'}>{message.val().name.charAt(0).toUpperCase() + message.val().name.charAt(1)}</div><p>{message.val().body}</p></li>
  )
}

export default Message