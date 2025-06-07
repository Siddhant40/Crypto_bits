import yfinance as yf
import pandas as pd

ticker = yf.Ticker("BTC-USD")
data = ticker.history(period="90d")
print(data)





