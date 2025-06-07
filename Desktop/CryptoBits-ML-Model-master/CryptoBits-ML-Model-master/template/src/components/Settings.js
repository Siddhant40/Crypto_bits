import React, { useEffect, useState } from 'react';
import {default as Toggle} from 'react-switch';
import Select from 'react-select';
import axios from 'axios';
import { FaSave } from "react-icons/fa";

const select1 = [
  { value: '1y', label: '1 Year' },
  { value: '2y', label: '2 Years' },
  { value: '3y', label: '3 Years' },
  { value: '5y', label: '5 Years' },
  { value: '8y', label: '8 Years' },
]

const select2 = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 20, label: '20' },
  { value: 25, label: '25' },
]

const select3 = [
  { value: 15, label: '15 Days' },
  { value: 30, label: '30 Days' },
  { value: 60, label: '60 Days' },
  { value: 90, label: '90 Days' },
]

const select4 = [
  { value: "LSTM", label: 'LSTM' },
  { value: "RF", label: 'RandomForest' }
]

export default function Settings() {
  const [checked, setChecked] = useState(false);
  const [period, setPeriod] = useState();
  const [epochs, setEpochs] = useState();
  const [results, setResults] = useState();
  const [algorithm, setAlgorithm] = useState();

  const handleChange = isChecked => {
    setChecked(isChecked);
  };

  const saveSettings = async () => {
    axios.post(`${process.env.REACT_APP_MODEL_URL}/config/setConfig`, { period, epochs, results, algorithm, state: checked?"active":"inactive" })
      .then((res)=>{
        res.data.message==="success"?alert("Saved successfully!"):alert("An error occurred!");
      }).
      catch(e=>{
        console.log(e);
        alert("An error occurred!");
      })
  }

  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_MODEL_URL}/config/getConfig`)
    .then((res)=>{
      setPeriod(res.data[0]);
      setEpochs(res.data[1]);
      setResults(res.data[2]);
      setAlgorithm(res.data[3]);
      setChecked(res.data[4]==="active"?true:false);
    })
    .catch(e=>{
      console.log(e);
      alert("An error occurred loading the dataaaaaa!");
    })
  }, [])

  return (
    <div data-aos="fade-up" data-aos-duration={1000}>
      <div className='flex flex-row items-center justify-between px-8 py-8'>
        <label className='text-white'>Model state</label>
        <div className='flex-r-center text-[15px] gap-2'>
          <label className='text-red-500'>Inactive</label>
          <Toggle
            onChange={handleChange}
            checked={checked}
            className="react-switch"
          />
          <label className='text-green-500'>Active</label>
        </div>
      </div>

      <div className='flex flex-row items-center justify-between px-8 py-8'>
        <div className='flex flex-col justify-start'>
          <label className='text-white'>Historical data period</label>
          <label className='text-white text-[12px]'>(Lower the period, lesser the overfitting)</label>
          <label className='text-green-500 text-[12px]'>Recommended: 2 Years</label>
        </div>
        <Select
          className='basic-single'
          classNamePrefix="select"
          value={select1.filter(i=>i.value===period)}
          isSearchable={false}
          name="color"
          options={select1}
          onChange={(i)=>setPeriod(i.value)}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isFocused ? 'grey' : 'rgb(75 85 99)',
              backgroundColor: "rgb(55 65 81)",
            }),
            container: (baseStyles, state) => ({
              ...baseStyles,
              width: "200px"
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: state.isFocused?"dodgerblue":"rgb(75 85 99)",
              cursor: "pointer"
            }),
            singleValue: (baseStyles, state) => ({
              ...baseStyles,
              color: "white",
              fontSize: 13
            }),
            menu: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: "rgb(75 85 99)",
              color: "white",
              fontSize: 13
            }),
          }}
        />
      </div>

      <div className='flex flex-row items-center justify-between px-8 py-8'>
        <div className='flex flex-col justify-start'>
          <label className='text-white'>Epochs</label>
          <label className='text-white text-[12px]'>(Higher the epochs, higher is the prediction accuracy, but higher is the processing time)</label>
          <label className='text-green-500 text-[12px]'>Recommended: 2</label>
        </div>
        <Select
          className='basic-single'
          classNamePrefix="select"
          value={select2.filter(i=>i.value===epochs)}
          isSearchable={false}
          name="color"
          options={select2}
          onChange={(i)=>setEpochs(i.value)}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isFocused ? 'grey' : 'rgb(75 85 99)',
              backgroundColor: "rgb(55 65 81)",
            }),
            container: (baseStyles, state) => ({
              ...baseStyles,
              width: "200px"
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: state.isFocused?"dodgerblue":"rgb(75 85 99)",
              cursor: "pointer"
            }),
            singleValue: (baseStyles, state) => ({
              ...baseStyles,
              color: "white",
              fontSize: 13
            }),
            menu: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: "rgb(75 85 99)",
              color: "white",
              fontSize: 13
            }),
          }}
        />
      </div>

      <div className='flex flex-row items-center justify-between px-8 py-8'>
        <div className='flex flex-col justify-start'>
          <label className='text-white'>Prediction results count</label>
          <label className='text-green-500 text-[12px]'>Recommended: 30 Days</label>
          {/* <label className='text-white text-[12px]'>(Higher the epochs, higher is the prediction accuracy, but higher is the processing time)</label> */}
        </div>
        <Select
          className='basic-single'
          classNamePrefix="select"
          value={select3.filter(i=>i.value===results)}
          isSearchable={false}
          name="color"
          options={select3}
          onChange={(i)=>setResults(i.value)}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isFocused ? 'grey' : 'rgb(75 85 99)',
              backgroundColor: "rgb(55 65 81)",
            }),
            container: (baseStyles, state) => ({
              ...baseStyles,
              width: "200px"
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: state.isFocused?"dodgerblue":"rgb(75 85 99)",
              cursor: "pointer"
            }),
            singleValue: (baseStyles, state) => ({
              ...baseStyles,
              color: "white",
              fontSize: 13
            }),
            menu: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: "rgb(75 85 99)",
              color: "white",
              fontSize: 13
            }),
          }}
        />
      </div>

      <div className='flex flex-row items-center justify-between px-8 py-8'>
        <div className='flex flex-col justify-start'>
          <label className='text-white'>Algorithm to use: </label>
          <label className='text-green-500 text-[12px]'>Recommended: LSTM</label>
          {/* <label className='text-white text-[12px]'>(Higher the epochs, higher is the prediction accuracy, but higher is the processing time)</label> */}
        </div>
        <Select
          className='basic-single'
          classNamePrefix="select"
          value={select4.filter(i=>i.value===algorithm)}
          isSearchable={false}
          name="color"
          options={select4}
          onChange={(i)=>setAlgorithm(i.value)}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isFocused ? 'grey' : 'rgb(75 85 99)',
              backgroundColor: "rgb(55 65 81)",
            }),
            container: (baseStyles, state) => ({
              ...baseStyles,
              width: "200px"
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: state.isFocused?"dodgerblue":"rgb(75 85 99)",
              cursor: "pointer"
            }),
            singleValue: (baseStyles, state) => ({
              ...baseStyles,
              color: "white",
              fontSize: 13
            }),
            menu: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: "rgb(75 85 99)",
              color: "white",
              fontSize: 13
            }),
          }}
        />
      </div>

      <div className='w-full flex-r-center mt-16'>
        <button className='bg-green-500 rounded-lg w-[50%] h-[45px] self-center flex-r-center gap-2' onClick={saveSettings}>
          <FaSave color='white' size={15} />
          <p className='text-white text-[15px]'>Save</p>
        </button>
      </div>

    </div>
  )
}
