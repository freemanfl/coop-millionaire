import './App.css';
import { useEffect, useState } from 'react';
import {auth, database} from "./firebase.js";
import { signInAnonymously, onAuthStateChanged,   } from "firebase/auth";
import { set, ref, onDisconnect, onValue,  } from "firebase/database";
import Rooms from './components/Rooms';
import CreateRoom from './components/CreateRoom';
import Lobby from './components/Lobby';
import GameScreen from './components/GameScreen';
import Chat from './components/Chat';

let playerId;

let playerRef;
let playersRoomRef;


function App() {
  console.log('app rendered');
  const [playerIdState, setPlayerIdState] = useState(null);
  const [room, setRoom] = useState(null);
  const [gameOn, setGameOn] = useState(false);

  
useEffect(()=> {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      
      // logged in

      // 1 set some id's
      playerId = user.uid;
      setPlayerIdState(user.uid);

      // 2 set needed refs
      playerRef = ref(database, `players/${playerId}`);
      playersRoomRef = ref(database, `rooms/${playerId}`);
      
      //set inital player state
      set(playerRef, {
        id: playerId,
        name: "Anonymous",
        pin: 0,
      });

      //listen for player room change
      onValue(ref(database, `players/${playerId}/room`), roomSnapshot => {
        if(roomSnapshot.val())
        { 
          setRoom(roomSnapshot.val());
          onValue(ref(database, `rooms/${roomSnapshot.val()}/gameOn`), gameOnSnapshot => {
            console.log(gameOnSnapshot.val());
              if(gameOnSnapshot.val() === true) {
                setGameOn(true);
              }
          })
          //remove me from the room i was last in
          onDisconnect(ref(database, `rooms/${roomSnapshot.val()}/players/${playerId}`)).remove();
        }
      })

      //Remove my user from firebase when i leave
      onDisconnect(playerRef).remove();
      onDisconnect(playersRoomRef).remove();
      //Begin the game now that we are signed in
      
    } else {
      // User is signed out
      
    }
  });

  signInAnonymously(auth)
  .then(() => {
     
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
    console.log(errorCode, errorMessage);
  });
}, [])



  return (
    <div className="App">
        {!room && <CreateRoom  playerId={playerIdState} />}
        {room ? <Chat room={room} /> : <Rooms playerId={playerIdState}/>}
        {gameOn ? <GameScreen room={room} playerId={playerIdState}/> : <Lobby playerId={playerIdState} />}
    </div>

  );
}

export default App;

//  const isRoomEmpty = ()=> {
//   console.log(playerJoinedRoomRef);
// }