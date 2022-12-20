import {useEffect, useRef, useState} from 'react'
import { set, update, ref } from "firebase/database";
import {database} from "../firebase.js";




const ChangeName = ({playerId}) => {


  // console.log('create rendered');
  const inputNameRef = useRef(null);
  const [playerName, setPlayerName] = useState('Anonymous');


  
  let playerRoomRef = ref(database, "rooms/"+ playerId);
  let playerRef = ref(database, "players/" + playerId);
  let playerRoomChatRef = ref(database, `chats/${playerId}`);

  





  //listens and sets name
  const changeName = ()=> {
    setPlayerName(inputNameRef.current.value);
    update(playerRef, {
      name: inputNameRef.current.value,
    });
  }

  // set pin state to pin input value


  return (

        <div className="createRoom">
            <h1>Hello,  
              <span>{playerName}</span>
            </h1>
            <input ref={inputNameRef} type="text" className="search"  placeholder={playerName} defaultValue={playerName} />
            <button type='button' className="button" onClick={changeName}>Change name</button>
        </div>
  )
}

export default ChangeName