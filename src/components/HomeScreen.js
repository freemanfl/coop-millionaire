
import {useEffect, useState, useRef} from 'react'
import { database} from "../firebase.js"
import { ref, onValue, set, update, limitToFirst } from "firebase/database";

import {useList} from 'react-firebase-hooks/database';

function ObjectLength( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
  };

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  };


  


const HomeScreen = ({playerId, name}) => {

  // Listen for all rooms
  let roomsRef = ref(database, 'rooms/');
  const [rooms, loading, error] = useList(roomsRef);
  const [apiDone, setApiDone] = useState(false);



  const handleClick = (e) => {
    createLobby();
    fetchQuestions();
  }

  const handleClickJoin = (e)=> {
    let clickedRoomId = e.target.parentElement.dataset.id;
   
    let clickedRoomRef = ref(database, `rooms/${clickedRoomId}/players/${playerId}`);
    // console.log(clickedRoomId, name);
    update(ref(database, `players/${playerId}` ), {
      room: clickedRoomId,
    })
    set(clickedRoomRef, {
      ready: false,
      name: name,
    })
  }
  
  const fetchQuestions = ()=> {
        let data = [];
        Promise.all(
          [
            fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple'),
            fetch('https://opentdb.com/api.php?amount=5&category=9&difficulty=hard&type=multiple')
          ]
        ).then(async([med, hard])=> {
          const m = await med.json();
          const h = await hard.json();
          return [m , h]
        }).then((responseText)=> {
          responseText.forEach(item => {
            for(let i = 0; i < item.results.length; i++) {
              item.results[i].id = i + 1;
              data.push(item.results[i]);
            }
          });
    
          data.forEach((question)=> {
            question.answers = [];
            question.question = question.question.replace(/(&ldquo;)/g,'"').replace(/&quot;/g, "'").replace(/&#039;/g, "'").replace(/&rdquo;/g, '"');
            question.incorrect_answers.forEach((answer)=> question.answers.push({text: answer.replace(/(&ldquo;)/g,'"').replace(/&quot;/g, "'").replace(/&#039;/g, "'"), correct: false}));
            question.answers.splice(getRandomInt(0, 4), 0, {text: question.correct_answer.replace(/(&ldquo;)/g,'"').replace(/&quot;/g, "'").replace(/&#039;/g, "'"), correct: true});
            delete question.incorrect_answers;
          });
          
          update(ref(database, `rooms/${playerId}/`), {
            package: data,
          });

          setApiDone(true);

        }).then().catch((err)=>
            console.log(err)
       );
        
  }


  const createLobby = () => {
        set(ref(database, `rooms/${playerId}`), {
            authorId: playerId,
            authorName: name,
            players: {
                [playerId]: {
                  ready: false,
                  name: name,
                },
              },
            maxPlayers: 5,
            currentQuestion: 1,
        });
        update(ref(database, `players/${playerId}/`), {
            room: playerId,
          });
  }





  return (
    <div className='homescreen container border-none space-y-4'>
            <h1 className='text-3xl'>Active Lobbies</h1>
            <ul className='container justify-start border-none space-y-2'>
                    {error && <strong>Error: {error}</strong>}
                    {loading && <span>List: Loading...</span>}
                    {(!loading && rooms) && (
                        rooms.map(room=> <li className='bg-brdr w-full h-10 pl-2 flex items-center justify-between' data-id={room.val().authorId} key={room.val().authorId}>{room.val().authorName}'s room {room.val().maxPlayers > ObjectLength(room.val().players) ? <button onClick={handleClickJoin} className='w-32 h-full  text-black bg-white'>Join Lobby</button> : null}</li>)
                    )}
            </ul>
            <button onClick={handleClick} className='w-2/3 p-4 text-2xl  text-black bg-white'>Create Lobby</button> 
            
    </div>

  )
}

export default HomeScreen
