import './App.css';
import { useEffect, useState } from 'react';
import {auth, database} from "./firebase.js";
import { signInAnonymously, onAuthStateChanged,   } from "firebase/auth";
import { set, ref, onDisconnect, onValue,  } from "firebase/database";
<<<<<<< HEAD
import Rooms from './components/Rooms';
import Lobby from './components/Lobby';
import GameScreen from './components/GameScreen';
import Chat from './components/Chat';

let playerId;

let playerRef;
let playersRoomRef;
let playersChatRef;

function App() {
  const [playerIdState, setPlayerIdState] = useState(null);
  const [room, setRoom] = useState(null);
  const [gameOn, setGameOn] = useState(false);
  const [packageLoaded, setPackageLoaded] = useState(false);
  
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
      playersChatRef = ref(database, `chats/${playerId}`);
      
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
      onDisconnect(playersChatRef).remove();
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
        {room ? <Chat room={room} playerId={playerIdState} /> : <Rooms playerId={playerIdState} setPackageLoaded={setPackageLoaded}/>}
        {(gameOn && packageLoaded) ? <GameScreen room={room} playerId={playerIdState}  /> : <Lobby playerId={playerIdState} setGameOn={setGameOn} />}
    </div>

=======

import Login from './components/Login';
import HomeScreen from './components/HomeScreen';
import LobbyScreen from './components/LobbyScreen';
import GameScreen from './components/GameScreen';


let playerId;

function App() {
  const [playerIdState, setPlayerIdState] = useState();
  const [room, setRoom] = useState(false);
  const [name, setName] = useState('player');
  const [gameOn, setGameOn] = useState(null);
  const [login, setLogin] = useState(null);
 
  useEffect(()=> {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        
        // logged in
  
        // 1 set some id'
        setPlayerIdState(user.uid);
        playerId = user.uid;
        // 2 set needed refs
        let playerRef = ref(database, `players/${playerId}`);
        let playersRoomRef = ref(database, `rooms/${playerId}`);
        let playersChatRef = ref(database, `chats/${playerId}`);
        playerId =
        //set inital player state
        set(playerRef, {
          id: playerId,
          name: "Anonymous",
        });
  
        //listen for player room change
        onValue(ref(database, `players/${playerIdState}/room`), roomSnapshot => {
          if(roomSnapshot.val())
          { 
            setRoom(roomSnapshot.val());
            onValue(ref(database, `rooms/${roomSnapshot.val()}/gameOn`), gameOnSnapshot => {
                if(gameOnSnapshot.val() === true) {
                  setGameOn(true);
                }
            })
            //remove me from the room i was last in
            onDisconnect(ref(database, `rooms/${roomSnapshot.val()}/players/${playerIdState}`)).remove();
          }
        })
  
        //Remove my user from firebase when i leave
        onDisconnect(playerRef).remove();
        onDisconnect(playersRoomRef).remove();
        onDisconnect(playersChatRef).remove();
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
      console.log(errorCode, errorMessage);
    });
  }, [playerIdState])


  return (
    <main className="App container flex justify-center items-center bg-zinc-900  rounded-[10px] min-w-[450px] min-h-[600px] max-w-[1920px] max-h-[1080px] ">
        {(!login) && <Login setLogin={setLogin} playerId={playerIdState} name={name} setName={setName}/>}
        {(login && !room && !gameOn) && <HomeScreen playerId={playerIdState} name={name} />}
        {(login && room && !gameOn) && <LobbyScreen playerId={playerIdState} room={room} name={name}/>}
        {(login && room && gameOn) && <GameScreen playerId={playerIdState} room={room} name={name}/>}

    </main>
>>>>>>> master
  );
}

export default App;
<<<<<<< HEAD

//  const isRoomEmpty = ()=> {
//   console.log(playerJoinedRoomRef);
// }
=======
>>>>>>> master
