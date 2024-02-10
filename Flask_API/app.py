from flask import Flask, request, jsonify
import joblib
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error
import numpy as np

# Load the Housing Market dataset
data = fetch_california_housing()
X, y = data.data, data.target

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Function to train and evaluate a model
def train_and_evaluate_model(model, X_train, y_train, X_test, y_test):
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    return mse, model

# Train and save models
mse_model1, model1 = train_and_evaluate_model(LinearRegression(), X_train, y_train, X_test, y_test)

# Save models
joblib.dump(model1, 'model1.pkl')

app = Flask(__name__)

# GET predict route
@app.route('/predict', methods=['GET'])
def predict():
    # Retrieve model arguments from the request
    features = []
    for f in data.feature_names:
        f = f.replace(' ', '_').replace('(', '').replace(')', '')
        value = request.args.get(f)
        if value is None:
            return jsonify({'error': f'Query parameter {f} is missing'}), 400
        features.append(float(value))
    # Load models (you can also load them at the start of the script)
    model1 = joblib.load("model1.pkl")

    # Make predictions using each model
    prediction1 = model1.predict([features])[0]

    # Standardized API response format
    response = {
        'prediction1': prediction1,
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)

#http://localhost:5000/predict?MedInc=8.3252&HouseAge=41&AveRooms=6.98412698&AveBedrms=1.02380952&Population=322&AveOccup=2.55555556&Latitude=37.88&Longitude=-122.23