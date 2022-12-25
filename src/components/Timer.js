
import { useState, useEffect } from "react"

const Timer = ({setStop, currentQuestion}) => {

  const [timer, setTimer] = useState(30);

  useEffect(()=> {

    if(timer === 0) {
        setStop(true);
        
    }
    const interval = setInterval(()=> {
        setTimer(prev=> prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [setStop, timer])

  useEffect(()=> {
     setTimer(1130);
  }, [currentQuestion])
  return timer;
}

export default Timer