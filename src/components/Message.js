

const Message = ({message, playerId}) => {
  return (
      <li className='flex h-auto space-x-2 items-center w-full '>
        <div className="w-10 h-10 flex items-center justify-center border-4 border-brdr rounded-full">{message.val().name.charAt(0).toUpperCase() + message.val().name.charAt(1)}</div>
        <p className="bg-brdr rounded-lg max-w-[70%]  break-words p-2">{message.val().body}</p>
      </li>
  )
}

export default Message