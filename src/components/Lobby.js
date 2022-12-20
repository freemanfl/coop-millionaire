import '../App.css';
import { useEffect, useState, useRef } from 'react';
import { database} from "../firebase.js";
import { update, ref, onValue } from "firebase/database";



const Lobby = ({playerId, setGameOn}) => {

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

    const areOthersReady = (player)=> {
       return player.ready === true;
    }

    const [room, setRoom] = useState(null);
    const [players, setPlayers] = useState(null);
    const readyButton = useRef();
    console.log('lobby rendered');

    useEffect(()=> {
        //listen for player's room and set the state
        onValue(ref(database, `players/${playerId}/room`), roomSnapshot => {
            if(roomSnapshot.val()) {
                console.log(roomSnapshot.val());
                setRoom(roomSnapshot.val());
                
                //listen for the players in player's room, then set the overall game and all players state
                onValue(ref(database, `rooms/${roomSnapshot.val()}/`), playersSnapshot => {
                    if(playersSnapshot.val()) {
                        const object = playersSnapshot.val().players;
                        const data = [];
                        Object.keys(object).map(k=> 
                          data.push(object[k]));
                          setPlayers(data);

                        if(data.every(areOthersReady)) {
                            setTimeout(()=> {
                                update(ref(database, `rooms/${roomSnapshot.val()}/`), {
                                    gameOn: true,
                                }); 
                                setGameOn(true);
                                
                            }, 1000)
                        }
                    }
                })
            }
        })
    },[playerId])



  return (
    <div className='lobby'>
        { players?
            <>
                
                <h3>Lobby</h3>
            
                <div className="lobby-players">
                    {players.map(player => {
                            return (
                                <div className='lobby-player' key={player.name}>
                                    <div className='letter'>{player.name.charAt(0).toUpperCase() + player.name.charAt(1)}</div>
                                    <div>
                                        {player.name}
                                    </div>
                                    <div>
                                        {`${player.ready ? 'ready' : 'waiting'}`}
                                    </div>
                                    
                                </div>
                            )
                        })}
                </div>

                <div className='ready'>
                    <label className="switch">
                        <input type="checkbox" ref={readyButton} onClick={toggleReady}/>
                        <span className="slider round"></span>
                    </label>
                </div>   

                 
                <p>You are in the room {room}</p>
            </>
               

         : <div className='pre-lobby'> <h1>Create or join a room</h1> </div> }

    </div>
  )
}

export default Lobby