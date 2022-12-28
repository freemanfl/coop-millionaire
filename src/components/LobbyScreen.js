
import {useEffect, useState, useRef} from 'react'
import { database} from "../firebase.js"
import { ref, onValue, set, update, limitToFirst } from "firebase/database";

import {useList} from 'react-firebase-hooks/database';
import Chat from './Chat.js';



const LobbyScreen = ({playerId, room, name}) => {

  let lobbyPlayersRef = ref(database, `rooms/${room}/players/`);  
  const [players, loading, error] = useList(lobbyPlayersRef);
  const [game, setGame] = useState(null);
  const [questions, setQuestions] = useState(null);
  const readyButton = useRef();

  const areOthersReady = (player)=> {
    return player.ready === true;
 }


  const toggleReady = ()=> {
    if(readyButton.current.checked ) {
        update(ref(database, `rooms/${room}/players/${playerId}`), {
            ready: true,
        });
        
    } else {
        update(ref(database, `rooms/${room}/players/${playerId}`), {
            ready: false,
        });
    }
} 

  // get the whole game data
  useEffect(()=> {
    onValue(ref(database, `rooms/${room}/`), snapshot => {
            if(snapshot.val()) {
                const object = snapshot.val().players;
                const data = [];

                Object.keys(object).map(k=> 
                data.push(object[k]));
                 
                

                //check for all ready
                if(data.every(areOthersReady)) {
                    setTimeout(()=> {
                        update(ref(database, `rooms/${room}/`), {
                            gameOn: true,
                        }); 
                    }, 2000)
                }

                if(snapshot.val().package != undefined) {
                    setQuestions(snapshot.val().package); 
                }

                
            }
    });


  }, [room]);

  
  return (
    <div className='lobbyScreen container justify-between border-none space-y-2'>
        <ul className="container relative lobby-players justify-start h-auto flex-row flex-wrap space-x-0 py-2">
                {players?.map(player=> 
                    <li key={player.key} className='flex flex-col w-24 items-center justify-center'>
                        <div className="h-16 w-16 rounded-full border-4 border-brdr flex items-center justify-center ">{player.val().name.charAt(0).toUpperCase() + player.val().name.charAt(1)}</div>
                        <div className="">{player.val().name}</div>
                        <div className="">Ready : {`${player.val().ready}`}</div>
                    </li>
                )}
                 <div className='ready'>
                    <label className="switch">
                        <input type="checkbox" ref={readyButton} onClick={toggleReady}/>
                        <span className="slider round"></span>
                    </label>
                </div>   
        </ul>
        
       <>
                
            { questions ? 'Questions Loaded' : 'Loading Questions'  }
       </>
        <Chat room={room} name={name} playerId={playerId}/>   
    
       


    </div>
  )
}

export default LobbyScreen