import '../App.css';
import { useEffect, useRef, useState, useMemo } from 'react';
import { database} from "../firebase.js";
import { update, ref, onValue, remove } from "firebase/database";
import Timer from './Timer';
import Chat from './Chat';


const GameScreen = ({room, playerId, name}) => {

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
  const [game, setGame] = useState(null);
  
  const [consensus, setConsensus] = useState(false);
  const [earned, setEarned] = useState("$ 0");
  const [stop, setStop] = useState(null);
  const answersRef = useRef();
  const [enabled, setEnabled] = useState(true);

  const delay = (duration, callback) => {
      setTimeout(()=> {
        callback();
      }, duration)
  }


  useEffect(()=> {
    game && game.currentQuestion > 1 && setEarned(moneyPyramid.find(m=> m.id === game.currentQuestion - 1).amount)
  }, [game, moneyPyramid])


  useEffect(()=> {
    //listen for the room info
    onValue(ref(database, `rooms/${room}`), snapshot => {
      if(snapshot.val()) { 
        setGame(snapshot.val());

        //data will be an array of players
        const playersArray = [];
        Object.keys(snapshot.val().players).map((key)=> {
          playersArray.push(snapshot.val().players[key]);
        })

        //we have a consensus if all players answered like first player
        if ( typeof playersArray[0].answer !== "undefined"  && playersArray.every(player => player.answer === playersArray[0].answer)) {
          setConsensus(true);
          setEnabled(false);

          if (snapshot.val().package[snapshot.val().currentQuestion - 1].answers[playersArray[0].answer].correct === true) {
                    
            delay(1000, ()=> {
              answersRef.current.children[playersArray[0].answer].classList.add('correct');  
            });

            delay(4000, ()=> {
              update(ref(database, `rooms/${room}/`), {
                currentQuestion: snapshot.val().currentQuestion + 1,
             })
            })
            
            delay(3500, ()=> {
                          
            Object.keys(snapshot.val().players).map((key)=> {
              remove(ref(database, `rooms/${room}/players/${key}/answer`))
            });

            setEnabled(true);
            })


  
          }
          else {
            delay(1000, ()=> {
              answersRef.current.children[playersArray[0].answer].classList.add('wrong');
            })
            delay(7000, ()=> {
              setStop(true);
            })
            
          }
        }
      }
    })
  }, [room])




  // handle clicking on answers by updating player's state in firebase room
  function handleClick(a) {
    if(enabled) {
      const answerIndex = game.package[game.currentQuestion - 1].answers.indexOf(a);
      update(ref(database, `rooms/${room}/players/${playerId}/`), {
        answer: answerIndex,
      })
    }

  }

  const refreshPage = ()=>{
    window.location.reload();
 }

  return (

    <div className="gameScreen container space-y-2 text-center border-none">
      {stop ? <div className='h-full flex flex-col justify-between items-center'><div></div><h1 className='text-2xl'>You earned: {earned}, correct answer is {game.package[game.currentQuestion - 1].correct_answer}. </h1>  <button onClick={refreshPage} className='w-2/3 p-4 text-2xl border-4 border-brdr text-black bg-white mt-'>Play Again</button> </div> : (
        <>
            <div className="display container relative border-none px-2 ">
                <h3 className='text-2xl'>{(game && game.package != undefined) ? `${game.package[game.currentQuestion - 1].question}` : 'waiting'}</h3>
                <div className="timer absolute bottom-1 w-16 h-16 flex items-center justify-center border-4 border-brdr rounded-full">
                  <Timer setStop={setStop} currentQuestion={game && game.currentQuestion}/>
                </div>
            </div>
            
            <Chat room={room} name={name} playerId={playerId}/>  

            <div className="answers container justify-between border-none space-y-2
                            md:flex-row md:flex-wrap md:space-y-0 md:h-3/6 " 
                  ref={answersRef}>
                {game && game.package[game.currentQuestion - 1].answers.map((a)=> 
                  <div className='answer text-lg container relative md:w-[48%] md:h-2/6 md:text-2xl' key={a.text} onClick={()=>handleClick(a)}>
                      {a.text}
                      <div className='player-votes absolute w-full flex items-center h-1/4 bottom-0 space-x-1 pb-1 pl-2 
                                      md:'>
                          {Object.keys(game.players).map(key => {
                            if(game.players[key].answer === game.package[game.currentQuestion - 1].answers.indexOf(a)) {

                              // design of a vote icon
                              return (<div className='voteIcon z-10 font-semibold bg-white text-black border-4 p-1 text-xs border- flex items-center justify-center left-0
                                                       w-6 h-6 rounded-full
                                                                                  ' 
                                        key={key}>{game.players[key].name.charAt(0).toUpperCase() + game.players[key].name.charAt(1)}</div>)
                            }
                          })}                
                      </div>
                  </div>
                )}
            </div>


            <div className="progression hidden">
            {game && moneyPyramid.map((m)=> (
              <li key={m.id} className={game.currentQuestion === m.id ? "moneyListItem active" : "moneyListItem"}><span>{m.id}</span><span>{m.amount}</span></li>
            ))}
            </div>
        </> 
      )}
     

    </div>
  )
}

export default GameScreen