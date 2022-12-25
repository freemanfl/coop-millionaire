import {useEffect, useState, useRef} from 'react'
import { database} from "../firebase.js"
<<<<<<< HEAD
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
      const messageData = {
        author: playerId,
        body: messageInputRef.current.value,
=======
import { ref,  set, push } from "firebase/database";

import {useList} from 'react-firebase-hooks/database';
import Message from './Message.js';

const Chat = ({room, name, playerId}) => {

  let messagesRef = ref(database, `chats/${room}`)
  const [messages, loading, error] = useList(messagesRef);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  

  let newMessageKey = push(messagesRef).key;


  const sendMessage = () => {
    if(inputRef.current.value !== '') {
      const messageData = {
        author: playerId,
        body: inputRef.current.value,
>>>>>>> master
        name: name,
      }

      set(ref(database, 'chats/' + room + '/' + newMessageKey), messageData);

<<<<<<< HEAD
      messageInputRef.current.value = '';
=======
      inputRef.current.value = '';
>>>>>>> master

    }


  }
  // 2. Handle form submit on Enter
  const handleSubmit =  e => {
      e.preventDefault();
      sendMessage();
   }

<<<<<<< HEAD
  // 3. Listen to the name for the form
  useEffect(()=> {
    onValue(ref(database, `players/${playerId}/name`), snapshot => {
      if(snapshot) {
        setName(snapshot.val());
      } 
    })
  }, [])

  // 4. A function to scroll to the last div in chat
  const scrollToBottom = () => {
=======
   const scrollToBottom = () => {
>>>>>>> master
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // 5. Call scrolling function when messages change 

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

<<<<<<< HEAD

  return (
    <div className='chat'>
        <h3>Chat</h3>
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
=======
  return (
    <div className='chat container h-[100%] overflow-hidden space-y-2
                    border-none'>
                <div className="container messages justify-start items-start space-y-2 p-2">
                    {error && <strong>Error: {error}</strong>}
                    {loading && <span>List: Loading...</span>}
                    {(!loading && messages) && messages.map(msg => <Message key={msg.key} message={msg} playerId={playerId} />)}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="lobby-input container p-0 flex-row h-auto border-none">
                    <input ref={inputRef} type="text" maxLength='120' className='w-full  h-12 bg-transparent px-2 self-end
                        border-4 border-brdr
                        focus:outline-none'/>

                    <button  type='submit' className='w-32 h-12 border-4 border-brdr border-l-0 text-black bg-white'>&#x27A4;</button> 

                </form>

                    
     
    </div>
    
>>>>>>> master
  )
}

export default Chat