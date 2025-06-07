import yfinance as yf
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import pandas as pd
from sklearn.metrics import mean_squared_error, r2_score
from math import sqrt
from datetime import datetime
env = load_dotenv()

from RandomForest import RandomForestModel
from LSTM import LSTMModel

CONNECTION_STRING = "mongodb+srv://siddhant:12345@settings.u2upq3j.mongodb.net/"

client = MongoClient(CONNECTION_STRING)

db = client["CryptoCapitalMLModel"]
collection = db["settings"]
print("Connected successfully!")
def getSettings():
    print("This is the settings")
    settings = collection.find_one({"id": "Settings"})
    print(settings)
    return [settings["defaultPeriod"], settings["defaultEpochs"], settings["defaultResults"], settings["defaultAlgorithm"], settings["modelState"]]
    # default_settings = ["15d",100,5,"RF","active"]
    # return default_settings

def saveSettings(period, epochs, results, state, algorithm):
    try:
        collection.update_one({"id": "Settings"}, { "$set": {
                "defaultPeriod": period,
                "defaultEpochs": epochs,
                "defaultResults": results,
                "modelState": state,
                "defaultAlgorithm": algorithm 
            }
        },upsert=True)
        return {"message": "success"}
    except:
        return {"message": "error"}


def fetchData(currency, period):
    ticker = yf.Ticker(currency if currency!=None else "BTC-USD")
    data = ticker.history(period=period)
    print("This is the datttaaa")
    print(data)
    return data


def getPredictions(currency):
    period, epochs, results, algorithm, modelState = getSettings()
    print(period, epochs, results, algorithm, modelState);  
    if modelState=="active":
        if algorithm=="LSTM":
            print("LSTM")
            return getPredictionsUsingLSTM(currency)
        elif algorithm=="RF":   
            print("RF")
            return getPredictionsUsingRF(currency)
    else:
        return {"message": "error", "data": "Model is inactiveeeeee"}


def getPredictionsUsingLSTM(currency):
    period, epochs, results, *other = getSettings()
    formattedDateTime = datetime.now()  
    try:
        data = fetchData(currency, period)
        
        # Get predictions and actual values
        predictions, y_test = LSTMModel(data, epochs)
        
        # Calculate metrics
        mse = mean_squared_error(y_test, predictions)
        rmse = sqrt(mse)
        r2 = r2_score(y_test, predictions)
        
        metrics = {
            "mse": float(mse),
            "rmse": float(rmse),
            "r2": float(r2)
        }

        currentDateTime = datetime.now()
        dateFormat = "%d-%m-%Y %I:%M %p"
        formattedDateTime = currentDateTime.strftime(dateFormat)
        collection.update_one({"id": "Settings"}, { "$push": {
            "logs": {
                "time": str(formattedDateTime),
                "message": f"Processed for {currency} with {period} years of data with {epochs} epochs. Predicted {results} results using LSTM. Metrics - MSE: {mse:.4f}, RMSE: {rmse:.4f}, R2: {r2:.4f}",
                "type": "log",
                "metrics": metrics
            }}
        })
        return {"message": "success", "data": predictions[0:results].tolist(), "metrics": metrics}
    except Exception as e:
        print(f"Error in LSTM: {e}")
        collection.update_one({"id": "Settings"}, { "$push": {
            "logs": {
                "time": str(formattedDateTime),
                "message": f"Error occurred for processing {currency} with {period} years of data with {epochs} epochs using LSTM.",
                "type": "error"
            }}
        })
        return {"message": "error"}


# def getPredictionsUsingRF(currency):
#     period, epochs, results, *other = getSettings()

#     try:
#         data = fetchData(currency, period)
#         print('we got the data')
#         predictions = RandomForestModel(data, results)

#         # mse = mean_squared_error(yTest, predictions)
#         # rmse = sqrt(mse)
#         # r2 = r2_score(yTest, predictions)

#         currentDateTime = datetime.now()
#         dateFormat = "%d-%m-%Y %I:%M %p"
#         formattedDateTime = currentDateTime.strftime(dateFormat)
#         collection.update_one({"id": "Settings"}, { "$push": {
#             "logs": {
#                 "time": str(formattedDateTime),
#                 "message": "Processed for {} with {} years of data. Predicted {} results using RF.".format(currency, period, results),
#                 "type": "log"
#             }}
#         })
#         return {"message": "success", "data": predictions[0:results].tolist()}
#     except:
#         collection.update_one({"id": "Settings"}, { "$push": {
#             "logs": {
#                 "time": str(formattedDateTime),
#                 "message": "Error occurred for processing {} with {} years of data using RF.".format(currency, period),
#                 "type": "error"
#             }}
#         })
#         return {"message": "error"}

def getPredictionsUsingRF(currency):
    period, epochs, results, *other = getSettings()
    currentDateTime = datetime.now()
    dateFormat = "%d-%m-%Y %I:%M %p"
    formattedDateTime = currentDateTime.strftime(dateFormat)

    try:
        data = fetchData(currency, period)
        print('we got the data')
        
        # Get predictions and actual values
        predictions, y_test = RandomForestModel(data, results)
        
        # Calculate metrics
        mse = mean_squared_error(y_test, predictions)
        rmse = sqrt(mse)
        r2 = r2_score(y_test, predictions)
        
        metrics = {
            "mse": float(mse),
            "rmse": float(rmse),
            "r2": float(r2)
        }

        collection.update_one({"id": "Settings"}, { "$push": {
            "logs": {
                "time": str(formattedDateTime),
                "message": f"Processed for {currency} with {period} years of data. Predicted {results} results using RF. Metrics - MSE: {mse:.4f}, RMSE: {rmse:.4f}, R2: {r2:.4f}",
                "type": "log",
                "metrics": metrics
            }}
        })
        return {"message": "success", "data": predictions[0:results].tolist(), "metrics": metrics}
    except Exception as e:
        print(f"Error in RF: {e}")
        collection.update_one({"id": "Settings"}, { "$push": {
            "logs": {
                "time": str(formattedDateTime),
                "message": f"Error occurred for processing {currency} with {period} years of data using RF.",
                "type": "error"
            }}
        })
        return {"message": "error"}

def getPastData(currency):
    print("Fetching past data for currency:", currency)
    period = getSettings()[0]
    print("This is the period")
    print(period)
    data = []
    ticker = yf.Ticker(currency if currency!=None else "BTC-USD")
    data = ticker.history(period=period)
    data["Date"] = data.index
    final_data = data.values.tolist()
    count = 0
    for i in final_data:
        del i[5]
        del i[5]
        final_data[count][5] = str(i[5])[0:10]
        count += 1
    # final_data.reverse()
    return final_data


def getLogs():
    settings = collection.find_one({"id": "Settings"})
    return settings["logs"]

def getModelComparison(currency):
    """Get performance comparison between LSTM and RF models"""
    try:
        # Get predictions and metrics from both models
        lstm_result = getPredictionsUsingLSTM(currency)
        rf_result = getPredictionsUsingRF(currency)
        
        if lstm_result["message"] == "success" and rf_result["message"] == "success":
            comparison = {
                "LSTM": lstm_result["metrics"],
                "RandomForest": rf_result["metrics"],
                "currency": currency,
                "timestamp": datetime.now().strftime("%d-%m-%Y %I:%M %p")
            }
            
            # Store comparison in database
            collection.update_one({"id": "Settings"}, { "$push": {
                "model_comparisons": comparison
            }})
            
            return {"message": "success", "data": comparison}
        else:
            return {"message": "error", "data": "Failed to get predictions from one or both models"}
    except Exception as e:
        print(f"Error in model comparison: {e}")
        return {"message": "error", "data": str(e)}