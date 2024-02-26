
# Import Dataset from sklearn
from flask import Flask, render_template, jsonify
from flask import request
import json
import requests
import pandas as pd
import numpy as np
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.datasets import load_iris


# Load Iris Data
iris = load_iris()


# Creating pd DataFrames
iris_df = pd.DataFrame(data= iris.data, columns= iris.feature_names)
target_df = pd.DataFrame(data= iris.target, columns= ['species'])
def converter(specie):
    if specie == 0:
        return 'setosa'
    elif specie == 1:
        return 'versicolor'
    else:
        return 'virginica'
    target_df['species'] = target_df['species'].apply(converter)# Concatenate the DataFrames

iris_df = pd.concat([iris_df, target_df], axis= 1)

iris_df.describe()
sns.pairplot(iris_df, hue= 'species')



# Converting Objects to Numerical dtype
iris_df.drop('species', axis= 1, inplace= True)
target_df = pd.DataFrame(columns= ['species'], data= iris.target)
iris_df = pd.concat([iris_df, target_df], axis= 1)# Variables
X= iris_df.drop(labels= 'sepal length (cm)', axis= 1)
y= iris_df['sepal length (cm)']


# Splitting the Dataset 
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size= 0.33, random_state= 101)


# Instantiating LinearRegression() Model
lr = LinearRegression()


# Training/Fitting the Model
lr.fit(X_train, y_train)


# Making Predictions
lr.predict(X_test)
pred = lr.predict(X_test)


# Evaluating Model's Performance
print('Mean Absolute Error:', mean_absolute_error(y_test, pred))
print('Mean Squared Error:', mean_squared_error(y_test, pred))
print('Mean Root Squared Error:', np.sqrt(mean_squared_error(y_test, pred)))


app = Flask(__name__)

@app.route('/predict', methods=['GET'])
def predict():
    try :  
     # Extract model arguments from the request parameters
        sepal_length = float(request.args.get('sepal_length'))
        sepal_width = float(request.args.get('sepal_width'))
        petal_length = float(request.args.get('petal_length'))
        petal_width = float(request.args.get('petal_width'))

        # Make a prediction using the loaded model
        input_data = [[sepal_length, sepal_width, petal_length, petal_width]]
        prediction = lr.predict(input_data)

        # Prepare the response
        response = {'prediction': int(prediction[0])}

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)})
        




if __name__ == '__main__':
    app.run(host = "0.0.0.0", port=8080)
    
#127.0.0.1:8080/predict?sepal_length=1&sepal_width=2&petal_length=1&petal_width=2