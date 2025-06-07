import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { FaRegChartBar } from "react-icons/fa";
import { FaTable } from "react-icons/fa";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

export default function PastData() {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");
  const [view, setView] = useState("chart");
  const [data, setData] = useState([]);

  const fetchCurrencies = async () => {
    const currencyData = [];
    const response = await fetch(
      new Request("https://api.livecoinwatch.com/coins/list"),
      {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY,
        }),
        body: JSON.stringify({
          currency: "USD",
          sort: "rank",
          order: "ascending",
          offset: 0,
          limit: 100,
          meta: true,
        }),
      }
    );
    const responseData = await response.json();
    responseData.forEach((item) => {
      currencyData.push({ value: item.code, label: item.name });
    });
    setCurrencies(currencyData);
  };

  const getPastData = async () => {
    const response = await axios.get(`${process.env.REACT_APP_MODEL_URL}/crypto/pastData?currency=${selectedCurrency}-USD`)
    console.log(response.data)
    setData(response.data.reverse())
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  useEffect(() => {
    selectedCurrency && getPastData();
  }, [selectedCurrency]);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between px-8 py-8">
        <div className="flex flex-col justify-start">
          <label className="text-white">Choose Currency: </label>
        </div>
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={currencies.filter((i) => i.value === selectedCurrency)}
          isSearchable={false}
          name="color"
          options={currencies}
          onChange={(i) => setSelectedCurrency(i.value)}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isFocused ? "grey" : "rgb(75 85 99)",
              backgroundColor: "rgb(55 65 81)",
            }),
            container: (baseStyles, state) => ({
              ...baseStyles,
              width: "200px",
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: state.isFocused ? "dodgerblue" : "rgb(75 85 99)",
              cursor: "pointer",
            }),
            singleValue: (baseStyles, state) => ({
              ...baseStyles,
              color: "white",
              fontSize: 13,
            }),
            menu: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: "rgb(75 85 99)",
              color: "white",
              fontSize: 13,
            }),
          }}
        />
      </div>

      <div className="flex flex-row justify-end">
        <div className="w-[10%] flex-row justify-between items-center">
          <button
            className={`text-white text-[15px] flex flex-row justify-center items-center h-[40px] w-[40px] ${
              view === "table" ? "bg-blue-500" : null
            } border-[1px] border-gray-600 rounded-lg`}
            onClick={() => {
              setView("table");
            }}
          >
            <FaTable color={"white"} size={18} className="text-white" />
          </button>
          <button
            className={`text-white text-[15px] flex flex-row justify-center items-center h-[40px] w-[40px] ${
              view === "chart" ? "bg-blue-500" : null
            } border-[1px] border-gray-600 rounded-lg`}
            onClick={() => {
              setView("chart");
            }}
          >
            <FaRegChartBar color={"white"} size={18} className="text-white" />
          </button>
        </div>
      </div>

      {view === "table" ? (
        <div className="w-full mt-4">
          <div className="w-full flex flex-row justify-around items-center text-[14px] text-gray-400 font-semibold mb-4">
            <p className="w-[16%] text-left pl-4">Date</p>
            <p className="w-[16%] text-left pl-4">Open</p>
            <p className="w-[16%] text-left pl-4">High</p>
            <p className="w-[16%] text-left pl-4">Low</p>
            <p className="w-[16%] text-left pl-4">Close</p>
            <p className="w-[16%] text-left pl-4">Volume</p>
          </div>
          <div className="w-full h-[500px] overflow-y-scroll">
            {data.length &&
              data.map((item) => {
                return (
                  <div className="w-full h-[30px] flex flex-row justify-around items-center border-b-[1px] border-gray-700 text-[12px] text-white">
                    <p className="w-[16%] text-left">{item[5]}</p>
                    <p className="w-[16%] text-left">
                      {parseFloat(item[0]).toFixed(2)}
                    </p>
                    <p className="w-[16%] text-left">
                      {parseFloat(item[1]).toFixed(2)}
                    </p>
                    <p className="w-[16%] text-left">
                      {parseFloat(item[2]).toFixed(2)}
                    </p>
                    <p className="w-[16%] text-left">
                      {parseFloat(item[3]).toFixed(2)}
                    </p>
                    <p className="w-[16%] text-left">
                      {parseFloat(item[4]).toFixed(2)}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="h-[500px] w-full mt-4">
          <AdvancedRealTimeChart
            theme="dark"
            symbol={selectedCurrency + "USD"}
            autosize
          />
        </div>
      )}
    </div>
  );
}
