import yfinance as yf
import pandas as pd


data = yf.Ticker("ETH-USD").history(period="50d")
data.to_csv("btc_data.csv")  # save to file
print(data)
# Next time just read from file
data = pd.read_csv("btc_data.csv")





