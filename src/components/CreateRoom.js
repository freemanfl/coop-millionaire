import {useEffect, useRef, useState} from 'react'
import { set, update, ref } from "firebase/database";
import {database} from "../firebase.js";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

let data = [];

const CreateRoom = ({playerId}) => {


  // console.log('create rendered');
  const inputNameRef = useRef(null);
  const pinRef = useRef(null);

  const [playerName, setPlayerName] = useState('player');
  const [pin, setPin] = useState('pin');

  
  let playerRoomRef = ref(database, "rooms/"+ playerId);
  let playerRef = ref(database, "players/" + playerId);


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
      console.log(data);


    }).catch((err)=>
        console.log(err)
   );
    
  }, []);

  const createRoom = ()=> {
    set(playerRoomRef, {
      authorId: playerId,
      authorName: playerName,
      players: {
        [playerId]: {
          ready: false,
          name: playerName,
        },
      },
      maxPlayers: 2,
      package: data,
      gameOn: false,
      qurrentQuestion: 1,
      pin: pin,
    });
    update(playerRef, {
      room: playerId,
    })
  }

  //listens and sets name
  const changeName = ()=> {
    setPlayerName(inputNameRef.current.value);
    update(playerRef, {
      name: inputNameRef.current.value,
    });
  }

  // set pin state to pin input value
  const changePin = () => {
    setPin(pinRef.current.value)
  }

  return (

        <div className="createRoom">
            <h1>Hello,  
              <span>{playerName}</span>
            </h1>
            <input ref={inputNameRef} type="text" className=" search"  placeholder='Name' defaultValue={playerName} />
            <button type='button' className="button" onClick={changeName}>Change name</button>

            <input  onChange={changePin} ref={pinRef} type="text" className="search" pattern="[0-9]{4}" maxLength="4" placeholder='4 digit number password' />

            <button type='button' className="button" onClick={createRoom}>Create a room</button>
        </div>
  )
}

export default CreateRoom