import '../App.css';
import { useEffect, useRef, useState, useMemo } from 'react';
import { database} from "../firebase.js";
import { update, ref, onValue } from "firebase/database";


const GameScreen = ({room, playerId  }) => {

  const moneyPyramid = useMemo(
    () =>
      [
        { id: 1, amount: "$ 100" },
        { id: 2, amount: "$ 200" },
        { id: 3, amount: "$ 300" },
        { id: 4, amount: "$ 500" },
        { id: 5, amount: "$ 1.000" },
        { id: 6, amount: "$ 2.000" },
        { id: 7, amount: "$ 4.000" },
        { id: 8, amount: "$ 8.000" },
        { id: 9, amount: "$ 16.000" },
        { id: 10, amount: "$ 32.000" },
        { id: 11, amount: "$ 64.000" },
        { id: 12, amount: "$ 125.000" },
        { id: 13, amount: "$ 250.000" },
        { id: 14, amount: "$ 500.000" },
        { id: 15, amount: "$ 1.000.000" },
      ].reverse(),
    []
  );
  const [questionNumber, setQuestionNumber] = useState(1);
  const [game, setGame] = useState(null);
  const [className, setClassName] = useState('answer');



  useEffect(()=> {
    onValue(ref(database, `rooms/${room}`), snapshot => {
      if(snapshot.val()) {
        console.log(snapshot.val());  
        setGame(snapshot.val())
      }
    })
  }, [room])

  useEffect(()=> {
  })



  function handleClick(a) {
    console.log(game.package[questionNumber - 1].answers.indexOf(a));
    const answerIndex = game.package[questionNumber - 1].answers.indexOf(a)


    update(ref(database, `rooms/${room}/players/${playerId}/`), {
      answer: game.package[questionNumber - 1].answers.indexOf(a),
    })
    
  }
  return (

    <div className="gameScreen">

      <div className="display">

          <h3>{game && `${game.package[questionNumber - 1].question}`}</h3>

          <div className="timer">
            26
          </div>
      </div>

      <div className="answers">
      {game && game.package[questionNumber - 1].answers.map((a)=> 
            <div className={className} key={a.text} onClick={()=>handleClick(a)}>
              {a.text}
              <div>
                {/* {Object.keys(game.players).map((key)=> {
                    if(game.players[key].answer === game.package[questionNumber - 1].)
                })} */}
              </div>
            </div>
      )}



      </div>

      <div className="progression">
          {moneyPyramid.map((m)=> (
            <li key={m.id} className={questionNumber === m.id ? "moneyListItem active" : "moneyListItem"}><span>{m.id}</span><span>{m.amount}</span></li>
          ))}
      </div>

    </div>
  )
}

export default GameScreen