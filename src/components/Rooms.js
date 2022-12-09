import {useEffect, useState} from 'react'
import { database} from "../firebase.js"
import { ref, onValue, set, update } from "firebase/database";
import {   } from "firebase/auth";

//utility functions

//object length
function ObjectLength( object ) {
  var length = 0;
  for( var key in object ) {
      if( object.hasOwnProperty(key) ) {
          ++length;
      }
  }
  return length;
};

const Rooms = ({playerId}) => {

  const [roomsList, setRoomsList] = useState(); 

  let clickedRoomId;
  let playerName;
  let playerRef = ref(database, `players/${playerId}`);
  let allRoomsRef = ref(database, `rooms/`);
  
  
  


  //join a room
  const handleClick = (e)=> {
    clickedRoomId = e.target.parentElement.attributes.authorid.value;
    let clickedRoomRef = ref(database, `rooms/${clickedRoomId}/players/${playerId}`);

    update(playerRef, {
      room: clickedRoomId,
    })
    set(clickedRoomRef, {
      ready:false,
      name: playerName,
    })

    
  }
  //fetch rooms on value change listener and updating the rooms array
  useEffect(()=> {
    onValue(allRoomsRef, (snapshot) => {
      if(snapshot.val()) {
        const object = snapshot.val();
        const data = [];
        Object.keys(object).map(k=> 
          data.push(object[k]));
          setRoomsList(data);

      }
    });
  },[])

  useEffect(()=> {
    onValue(ref(database, `players/${playerId}/name`), snapshot => {
      if(snapshot.val()) {
        playerName = snapshot.val();
      }
    })
  }, [])


  return(
      <div className='rooms'>
          <h1>Active rooms</h1>
          <ul>
            { (roomsList && playerId) ? 
                roomsList.map((m)=>

              <li authorid={m.authorId} key={m.authorId}>

                <span>{m.authorName}'s room___</span> <span>{ObjectLength(m.players)}/<span>{m.maxPlayers}</span></span> 
                
                {
                   (m.authorId === playerId || ObjectLength(m.players) >= m.maxPlayers) ?
                 null : <button onClick={handleClick} className='button-mini'>Join</button>
                 }

              </li>)   

              : "Waiting for rooms" }

          </ul>
      </div>
    )
}
export default Rooms