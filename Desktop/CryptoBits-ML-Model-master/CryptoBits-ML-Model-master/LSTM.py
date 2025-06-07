from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import numpy as np

def prepareDataset(data, time_step=60):
    X_data, y_data = [], []
    for i in range(len(data) - time_step - 1):
        X_data.append(data[i:(i + time_step), 0])
        y_data.append(data[i + time_step, 0])
    return np.array(X_data), np.array(y_data)


def LSTMModel(data, epochs):
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data['Close'].values.reshape(-1,1))

    X_data, y_data = prepareDataset(scaled_data, time_step=60)

    xTrain, y_train = X_data[:int(len(X_data)*0.95)], y_data[:int(len(X_data)*0.95)]
    xTest, yTest = X_data[int(len(X_data)*0.95):], y_data[int(len(X_data)*0.95):]

    xTrain = xTrain.reshape(xTrain.shape[0], xTrain.shape[1], 1)
    xTest = xTest.reshape(xTest.shape[0], xTest.shape[1], 1)

    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(60,1)))
    model.add(LSTM(units=50, return_sequences=False))
    model.add(Dense(units=25))
    model.add(Dense(units=1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(xTrain, y_train, batch_size=1, epochs=epochs)

    predictions = model.predict(xTest)
    predictions = scaler.inverse_transform(predictions)

    yTest = scaler.inverse_transform(yTest.reshape(-1, 1))

    finalPredictions = predictions[::-1]
    finalActual = yTest[::-1]
    
    return finalPredictions, finalActual