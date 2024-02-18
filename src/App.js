import "./App.css";
import { useEffect, useState } from "react";
import { auth, database } from "./firebase.js";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { set, ref, onDisconnect, onValue } from "firebase/database";

import Login from "./components/Login";
import HomeScreen from "./components/HomeScreen";
import LobbyScreen from "./components/LobbyScreen";
import GameScreen from "./components/GameScreen";

let playerId;

function App() {
  const [playerId, setPlayerId] = useState();
  const [playersAmount, setPlayersAmount] = useState();
  const [room, setRoom] = useState(false);
  const [name, setName] = useState("player");
  const [gameOn, setGameOn] = useState(null);
  const [login, setLogin] = useState(null);

  // 1. We detect login (auth state change)
  // 2. Set id, ref to the player, his room and chat
  // 3. Add player to firebase 'players/
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  useEffect(() => {
    signInAnonymously(auth)
      .then(() => {})
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // logged in

        // set some id'
        setPlayerId(user.uid);

        // set needed refs
        let playerRef = ref(database, `players/${playerId}`);
        let playersRoomRef = ref(database, `rooms/${playerId}`);
        let playersChatRef = ref(database, `chats/${playerId}`);

        // set inital player state in database
        set(playerRef, {
          id: playerId,
          name: "Anonymous",
        });

        //listen for players room change
        onValue(ref(database, `players/${playerId}/room`), (roomSnapshot) => {
          if (roomSnapshot.val()) {
            setRoom(roomSnapshot.val());

            // if in room also listen for game start event
            onValue(
              ref(database, `rooms/${roomSnapshot.val()}/gameOn`),
              (gameOnSnapshot) => {
                if (gameOnSnapshot.val() === true) {
                  setGameOn(true);
                }
              }
            );

            // remove me from the room i was last in
            onDisconnect(
              ref(database, `rooms/${roomSnapshot.val()}/players/${playerId}`)
            ).remove();
          }
        });

        //Remove my user from firebase when i leave
        onDisconnect(playerRef).remove();
        onDisconnect(playersRoomRef).remove();
        onDisconnect(playersChatRef).remove();
        //Begin the game now that we are signed in
      } else {
        // User is signed out
      }
    });
  }, [playerId]);

  return (
    <main className="App container p-2 bg-zinc-900  min-w-[350px] min-h-[539px] max-w-[1920px] max-h-[1080px] ">
      {!login && (
        <Login
          setLogin={setLogin}
          playerId={playerId}
          name={name}
          setName={setName}
        />
      )}
      {login && !room && !gameOn && (
        <HomeScreen playerId={playerId} name={name} />
      )}
      {login && room && !gameOn && (
        <LobbyScreen playerId={playerId} room={room} name={name} />
      )}
      {login && room && gameOn && (
        <GameScreen playerId={playerId} room={room} name={name} />
      )}
    </main>
  );
}

export default App;
