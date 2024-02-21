
import React from 'react'
import {useState, useRef} from 'react'
import { database } from '../firebase';
import { set, ref, update, onDisconnect, onValue,  } from "firebase/database";



const Login = ({setLogin, playerId, name, setName}) => {

  const nameRef = useRef(null);


  const handleClick = ()=> {

      if(nameRef.current.value !== '') {
     

        setLogin(true);

        update(ref(database, `players/${playerId}/`), {
          name: nameRef.current.value,
        });

      }
     
  }

  return (
    <div className='login w-full h-full border-none container space-y-4'>
        <h1 className='text-3xl'>Hello, {name}</h1>
        
        <input type="text" maxLength='12' className='w-2/3 text-center bg-transparent px-2 text-2xl p-4
          border border-brdr
          focus:outline-none' 
          
          ref={nameRef} onChange={()=>setName(nameRef.current.value)}/>

        <button onClick={handleClick} className='w-2/3 p-4 text-2xl text-black bg-white'>Login</button>  

    </div>
  )
}

export default Login
