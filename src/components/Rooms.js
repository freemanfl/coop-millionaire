import {useEffect, useState, useRef} from 'react'
import { database} from "../firebase.js"
import { ref, onValue, set, update } from "firebase/database";
import ChangeName from './ChangeName.js';


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

//get random int
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
let data = [];

const Rooms = ({playerId, setPackageLoaded}) => {

  const [roomsList, setRoomsList] = useState(null); 
  const [name, setName] = useState('Anonymous');
  const inputNameRef = useRef(null);
  

  let clickedRoomId;


  let playerRef = ref(database, `players/${playerId}`);
  let allRoomsRef = ref(database, `rooms/`);
  let playerRoomRef = ref(database, "rooms/" + playerId);




  //creates a new room
  const createRoom = ()=> {
    set(playerRoomRef, {
      authorId: playerId,
      authorName: name,
      players: {
        [playerId]: {
          ready: false,
          name: name,
        },
      },
      maxPlayers: 3,
      package: data,
      gameOn: false,
      currentQuestion: 1,
    });

    update(playerRef, {
      room: playerId,
    })
  }
  

  //join a room
  const handleClick = (e)=> {
    clickedRoomId = e.target.parentElement.attributes.authorid.value;
    let clickedRoomRef = ref(database, `rooms/${clickedRoomId}/players/${playerId}`);
    console.log(clickedRoomId, name);
    update(playerRef, {
      room: clickedRoomId,
    })
    set(clickedRoomRef, {
      ready: false,
      name: name,
    })
  }

//fetch questions package
  useEffect(()=> {
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
        question.incorrect_answers.forEach((answer)=> question.answers.push({text: answer, correct: false}));
        question.answers.splice(getRandomInt(0, 4), 0, {text: question.correct_answer, correct: true});
        delete question.incorrect_answers;

      });

    }).then(setPackageLoaded(true)).catch((err)=>
        console.log(err)
   );
    
  }, []);

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

  //set name changes to database/playerId/name
  const changeName = ()=> {
    setName(inputNameRef.current.value);
    update(playerRef, {
      name: inputNameRef.current.value,
    });
  }
  

  return(
      <div className='rooms'>
 
          <div className="changeName">
            <h1>Hello,  
              <span> {name}</span>
            </h1>
            <div className="changeNameInput">
              <input ref={inputNameRef} type="text" className="search name-input"  placeholder={name} maxLength="9" />
              <button type='button' className="button-mini" onClick={changeName} style={{color: `white`}}>&#x270E;</button>
            </div>
          </div>

          <ul>
            { (roomsList && playerId) ? 
                roomsList.map((m)=>

              <li authorid={m.authorId} key={m.authorId}>

                <span>{m.authorName}'s room</span> <span>{ObjectLength(m.players)}/<span>{m.maxPlayers}</span></span> 
                
                {
                   (m.authorId === playerId || ObjectLength(m.players) >= m.maxPlayers || m.gameOn) ?
                 null : <button onClick={handleClick} className='button-mini'>Join</button>
                 }

              </li>)   

              : "Waiting for rooms" }

          </ul>

          <button type='button' className="button" onClick={createRoom} style={{color: `white`}}>Create a room</button>
          

          
      </div>
    )
}
export default Rooms