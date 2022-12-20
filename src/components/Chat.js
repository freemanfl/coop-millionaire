import {useEffect, useState, useRef} from 'react'
import { database} from "../firebase.js"
import { ref, onValue, set, update, push } from "firebase/database";
import {useList} from 'react-firebase-hooks/database';
import Message from './Message.js';


const Chat = ({room, playerId}) => {
  const [name, setName] = useState();
  const [isMine, setIsMine] = useState(false);
  const messageInputRef = useRef();

  let roomChatRef = ref(database, `chats/${room}`);
  let newMessageKey = push(roomChatRef).key;

  const [messages, loading, error] = useList(roomChatRef);
  const messagesEndRef = useRef(null);
  
  // 1. Function that runs when user sends the form
  const sendMessage = () => {
    if(messageInputRef.current.value !== '') {
      console.log(messages);
      const messageData = {
        author: playerId,
        body: messageInputRef.current.value,
        name: name,
      }

      set(ref(database, 'chats/' + room + '/' + newMessageKey), messageData);

      messageInputRef.current.value = '';

    }


  }
  // 2. Handle form submit on Enter
  const handleSubmit =  e => {
      e.preventDefault();
      sendMessage();
   }

  // 3. Listen to the name for the form
  useEffect(()=> {
    onValue(ref(database, `players/${playerId}/name`), snapshot => {
      if(snapshot) {
        setName(snapshot.val());
      console.log(snapshot.val());
      } 
    })
  }, [])

  // 4. A function to scroll to the last div in chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // 5. Call scrolling function when messages change 

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  return (
    <div className='chat'>
        <h1>Chat</h1>
        <ul className='messages'>
          {error && <strong>Error: {error}</strong>}
          {loading && <span>List: Loading...</span>}
          {(!loading && messages) && messages.map(msg => <Message key={msg.key} message={msg} playerId={playerId} />)}
          <div ref={messagesEndRef} />
        </ul>
          <form className='send-container' onSubmit={handleSubmit}>
                <input className='chat-input search' type="text" maxLength='100' ref={messageInputRef}/>
                <button type='submit' className='button-mini' style={{color: 'white'}}>&#x27A4;</button>
          </form>
    </div>
  )
}

export default Chat