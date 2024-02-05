# model_training.py

from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
import joblib

# Load and split the dataset
iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(iris.data, iris.target, test_size=0.3, random_state=42)

# Create a pipeline with an imputer and the classifier
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='mean')),  # or 'median', 'most_frequent'
    ('classifier', RandomForestClassifier())
])

# Train the model using the pipeline
pipeline.fit(X_train, y_train)

# Evaluate the model
predictions = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Model Accuracy: {accuracy}")

# Save the entire pipeline (including the imputer and the classifier)
joblib.dump(pipeline, 'iris_pipeline.pkl')
