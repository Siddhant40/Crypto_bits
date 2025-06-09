import React, { useEffect, useState, useMemo } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import axios from "axios";
import Select from "react-select";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  Filler
);

export default function Predictions() {
  const [data, setData] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [comparing, setComparing] = useState(false);

  const fetchCurrencies = async () => {
    try {
      const res = await fetch(
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
      const responseData = await res.json();
      const currencyData = responseData.map((item) => ({
        value: item.code,
        label: item.name,
      }));
      setCurrencies(currencyData);
    } catch (err) {
      console.error("Failed fetching currencies", err);
    }
  };

  const getDaysArray = (days) => {
    const date = new Date();
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(date);
      d.setDate(d.getDate() + i + 1);
      return d.toISOString().substring(0, 10).split("-").reverse().join("-");
    });
  };

  const getPredictions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/crypto/predictions?currency=${selectedCurrency}-USD`
      );
      const predictions = res.data.data.map((item) =>
        parseFloat(item).toFixed(2)
      );
      setData(predictions);
      setLoading(false);
    } catch (e) {
      console.error("Prediction fetch failed", e);
      alert("An error occurred loading the data!");
      setLoading(false);
    }
  };

  const compareModels = async () => {
    setComparing(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/crypto/model-comparison?currency=${selectedCurrency}-USD`
      );
      if (res.data.message === "success") {
        setComparisonData(res.data.data);
      } else {
        alert("Failed to compare models. Please try again.");
      }
    } catch (e) {
      console.error("Model comparison failed", e);
      alert("An error occurred comparing the models!");
    }
    setComparing(false);
  };

  const getBetterModel = (metric) => {
    if (!comparisonData) return null;
    const lstmValue = comparisonData.LSTM[metric];
    const rfValue = comparisonData.RandomForest[metric];
    
    if (metric === 'r2') {
      return lstmValue > rfValue ? 'LSTM' : 'Random Forest';
    } else {
      return lstmValue < rfValue ? 'LSTM' : 'Random Forest';
    }
  };

  const labels = useMemo(() => {
    return getDaysArray(data.length);
  }, [data]);

  const chartData = useMemo(() => {
    return {
      labels: labels,
      datasets: [
        {
          fill: true,
          backgroundColor: "rgba(104, 154, 247, 0.101)",
          borderColor: "#3782fa",
          borderWidth: 3,
          pointRadius: 3,
          tension: 0.3,
          data: data,
        },
      ],
    };
  }, [data, labels]);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <div className="w-full h-[600px]">
      <div className="flex flex-row items-center justify-between px-8 py-8">
        <div className="flex flex-row justify-between items-center">
          <label className="text-white mr-4">Choose Currency: </label>
          <Select
            className="basic-single"
            classNamePrefix="select"
            value={currencies.find((i) => i.value === selectedCurrency)}
            isSearchable={false}
            name="currency"
            options={currencies}
            onChange={(i) => setSelectedCurrency(i.value)}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? "grey" : "rgb(75 85 99)",
                backgroundColor: "rgb(55 65 81)",
              }),
              container: (baseStyles) => ({
                ...baseStyles,
                width: "200px",
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: state.isFocused
                  ? "dodgerblue"
                  : "rgb(75 85 99)",
                cursor: "pointer",
              }),
              singleValue: (baseStyles) => ({
                ...baseStyles,
                color: "white",
                fontSize: 13,
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "rgb(75 85 99)",
                color: "white",
                fontSize: 13,
              }),
            }}
          />
        </div>
        <div className="flex gap-4">
          <button
            className="h-[40px] w-[150px] rounded bg-green-500 text-white"
            onClick={getPredictions}
          >
            Predict
          </button>
          <button
            className="h-[40px] w-[150px] rounded bg-blue-500 text-white"
            onClick={compareModels}
            disabled={comparing}
          >
            {comparing ? "Comparing..." : "Compare Models"}
          </button>
        </div>
      </div>

      {comparisonData && (
        <div className="w-full px-8 py-4 bg-gray-800 rounded-lg mb-8">
          <h3 className="text-white text-lg mb-4">Model Comparison Results</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">MSE (Lower is better)</h4>
              <div className="text-gray-300">
                <p>LSTM: {comparisonData.LSTM.mse.toFixed(4)}</p>
                <p>Random Forest: {comparisonData.RandomForest.mse.toFixed(4)}</p>
                <p className="text-green-400 mt-2">
                  Better: {getBetterModel('mse')}
                </p>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">RMSE (Lower is better)</h4>
              <div className="text-gray-300">
                <p>LSTM: {comparisonData.LSTM.rmse.toFixed(4)}</p>
                <p>Random Forest: {comparisonData.RandomForest.rmse.toFixed(4)}</p>
                <p className="text-green-400 mt-2">
                  Better: {getBetterModel('rmse')}
                </p>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">R² (Higher is better)</h4>
              <div className="text-gray-300">
                <p>LSTM: {comparisonData.LSTM.r2.toFixed(4)}</p>
                <p>Random Forest: {comparisonData.RandomForest.r2.toFixed(4)}</p>
                <p className="text-green-400 mt-2">
                  Better: {getBetterModel('r2')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="w-full h-full flex flex-row justify-center items-center">
          <BounceLoader
            color={"dodgerblue"}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : data.length > 0 ? (
        <div className="w-full h-[500px] flex flex-col items-center mt-16">
          <Line
            className="w-full"
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
              },
              layout: { padding: { bottom: 100 } },
              scales: {
                y: {
                  ticks: { color: "dodgerblue" },
                  grid: { color: "rgb(55 65 81 )" },
                },
                x: {
                  ticks: { color: "dodgerblue" },
                  grid: { display: false },
                },
              },
            }}
            data={chartData}
          />
        </div>
      ) : (
        <div className="text-white text-lg text-center mt-32">
          No predictions yet — click <span className="text-green-400">Predict</span> to fetch data.
        </div>
      )}
    </div>
  );
}
