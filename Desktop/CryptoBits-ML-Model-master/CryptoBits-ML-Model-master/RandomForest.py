import numpy as np
from sklearn.ensemble import RandomForestRegressor

def prepareDataset(data, results):
    features = ['Open', 'High', 'Low', 'Volume']
    df_train = data[:len(data) - results ]
    df_test  = data[ len(data) - results:]

    xTrain = df_train[features]
    yTrain = df_train["Close"].values.reshape(-1,1)

    xTest = df_test[features]
    yTest = df_test["Close"].values.reshape(-1,1)
    return xTrain, yTrain, xTest, yTest


def RandomForestModel(data, results):
    xTrain, yTrain, xTest, yTest = prepareDataset(data, results)
    rf = RandomForestRegressor(n_estimators = 1000, random_state = 5)
    rf.fit(xTrain, np.ravel(yTrain))
    predictions = rf.predict(xTest)
    finalPredictions = predictions[::-1]
    finalActual = yTest[::-1]
    print("Predictions shape:", finalPredictions.shape)
    print("Actual values shape:", finalActual.shape)
    return finalPredictions, finalActual