# app.py

from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained pipeline (which includes the imputer and the classifier)
pipeline = joblib.load('iris_pipeline.pkl')
class_name = {0: "Setosa" , 1: "Versicolor" , 2: "Virginia" }
@app.route('/predict', methods=['GET'])
def predict():
    try:
        # Retrieve query parameters corresponding to the Iris dataset features
        sepal_length = request.args.get('sepal_length', type=float)
        sepal_width = request.args.get('sepal_width', type=float)
        petal_length = request.args.get('petal_length', type=float)
        petal_width = request.args.get('petal_width', type=float)
        
        # Form a prediction using the pipeline
        prediction = pipeline.predict(np.array([[sepal_length, sepal_width, petal_length, petal_width]]))
        return jsonify({'prediction': class_name[int(prediction[0])]}, {'prediction number':int(prediction[0])}) 
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
