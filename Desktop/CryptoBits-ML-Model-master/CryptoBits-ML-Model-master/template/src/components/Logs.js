import React, {useState, useRef, useEffect} from 'react';
import {StopOutlined} from "@ant-design/icons";
import axios from 'axios';

export default function Logs() {
  const logboxRef = useRef(null);
  const [logs, setLogs] = useState([]);

  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_MODEL_URL}/config/logs`)
    .then((res)=>{
      setLogs(res.data);
    })
    .catch(e=>{
      console.log(e);
      alert("An error occurred loading logs!");
    })
  },[])

  useEffect(()=>{
    logboxRef.current.scrollTop = logboxRef.current.scrollHeight;
  },[logs])

  return (
    <div>
      <div ref={logboxRef} className='h-fit w-full flex flex-row justify-end mb-2'>
        <button className='h-[40px] w-[40px] rounded-lg bg-gray-700 border-[1px] border-gray-600 flex-r-center'>
          <StopOutlined color={'white'} size={20} className='text-white'/>
        </button>
      </div>
      <div ref={logboxRef} className='h-[500px] w-full bg-gray-900 rounded-lg px-4 pt-6 overflow-y-scroll pb-[250px]'>
        {logs.map(i=>{
          return (
            <p className={`${i.type==="error"?"text-red-500":"text-white"} py-4 text-[14px]`}>{i.time + " : " + i.message}</p>
          )
        })}
      </div>
    </div>
  )
}
