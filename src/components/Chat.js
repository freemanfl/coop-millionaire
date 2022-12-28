import {useEffect, useState, useRef} from 'react'
import { database} from "../firebase.js"
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
        name: name,
      }

      set(ref(database, 'chats/' + room + '/' + newMessageKey), messageData);

      inputRef.current.value = '';

    }


  }
  // 2. Handle form submit on Enter
  const handleSubmit =  e => {
      e.preventDefault();
      sendMessage();
   }

   const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // 5. Call scrolling function when messages change 

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='chat container overflow-hidden space-y-2
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
    
  )
}

export default Chat