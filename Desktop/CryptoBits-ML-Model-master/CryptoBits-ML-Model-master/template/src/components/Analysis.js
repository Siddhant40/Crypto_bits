import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { TechnicalAnalysis } from "react-ts-tradingview-widgets";

export default function Analysis() {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");

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

  useEffect(() => {
    fetchCurrencies();
  }, []);

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

      <div>
        <TechnicalAnalysis
          colorTheme="dark"
          width="100%"
          isTransparent={true}
          symbol={selectedCurrency + "USD"}
        />
      </div>
    </div>
  );
}
