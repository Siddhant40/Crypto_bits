from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import pandas as pd

def add_simple_indicators(data):
    """Add only essential technical indicators"""
    df = data.copy()
    
    # Calculate simple moving averages
    df['MA7'] = df['Close'].rolling(window=7).mean()
    df['MA14'] = df['Close'].rolling(window=14).mean()
    
    # Calculate RSI (simplified)
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))
    
    # Calculate MACD
    exp1 = df['Close'].ewm(span=12, adjust=False).mean()
    exp2 = df['Close'].ewm(span=26, adjust=False).mean()
    df['MACD'] = exp1 - exp2
    
    # Fill NaN values
    df = df.fillna(method='bfill')
    
    return df

def prepareDataset(data, time_step=20):
    # Add only essential indicators
    data = add_simple_indicators(data)
    
    # Use fewer, more essential features
    features = ['Open', 'High', 'Low', 'Close', 'Volume', 'MA7', 'MA14', 'RSI', 'MACD']
    
    # Scale each feature
    scaled_data = {}
    scalers = {}
    
    for feature in features:
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data[feature] = scaler.fit_transform(data[feature].values.reshape(-1, 1))
        scalers[feature] = scaler
    
    # Create sequences
    X_data, y_data = [], []
    for i in range(len(data) - time_step - 1):
        x_sequence = []
        for feature in features:
            x_sequence.append(scaled_data[feature][i:(i + time_step), 0])
        X_data.append(np.column_stack(x_sequence))
        y_data.append(scaled_data['Close'][i + time_step, 0])
    
    return np.array(X_data), np.array(y_data), scalers['Close']

def LSTMModel(data, epochs):
    print(f"Dataset shape: {data.shape}")
    
    # Prepare dataset with essential features only
    X_data, y_data, close_scaler = prepareDataset(data, time_step=20)
    
    print(f"X_data shape: {X_data.shape}")
    print(f"y_data shape: {y_data.shape}")
    
    # Use 75-25 split for better validation
    train_size = int(len(X_data) * 0.75)
    xTrain, y_train = X_data[:train_size], y_data[:train_size]
    xTest, yTest = X_data[train_size:], y_data[train_size:]
    
    n_features = xTrain.shape[2]
    print(f"Number of features: {n_features}")
    
    # Simple, effective architecture
    model = Sequential([
        # Single LSTM layer with moderate units
        LSTM(units=64, return_sequences=True, input_shape=(20, n_features)),
        BatchNormalization(),
        Dropout(0.2),
        
        # Second LSTM layer
        LSTM(units=32, return_sequences=False),
        BatchNormalization(),
        Dropout(0.2),
        
        # Single dense layer
        Dense(units=16, activation='relu'),
        BatchNormalization(),
        Dropout(0.2),
        
        Dense(units=1)
    ])
    
    # Compile with conservative learning rate
    optimizer = Adam(learning_rate=0.001)
    model.compile(optimizer=optimizer, loss='mean_squared_error')
    
    # Conservative callbacks
    callbacks = [
        EarlyStopping(
            monitor='val_loss',
            patience=8,
            restore_best_weights=True
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.7,
            patience=4,
            min_lr=0.0001
        )
    ]
    
    # Train with validation split
    history = model.fit(
        xTrain, y_train,
        batch_size=16,  # Smaller batch size for smaller datasets
        epochs=epochs,
        validation_split=0.2,
        callbacks=callbacks,
        verbose=1
    )
    
    # Make predictions
    predictions = model.predict(xTest)
    predictions = close_scaler.inverse_transform(predictions)
    yTest = close_scaler.inverse_transform(yTest.reshape(-1, 1))
    
    finalPredictions = predictions[::-1]
    finalActual = yTest[::-1]
    
    return finalPredictions, finalActual