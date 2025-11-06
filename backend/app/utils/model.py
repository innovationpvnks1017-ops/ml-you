import os
import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from typing import Tuple, Dict
from tempfile import NamedTemporaryFile

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../models")

os.makedirs(MODEL_DIR, exist_ok=True)

def train_model(parameters: dict, data: pd.DataFrame) -> Tuple[LogisticRegression, Dict[str, float]]:
    # Example: Train logistic regression with parameters
    target = parameters.get("target_column")
    if not target or target not in data.columns:
        raise ValueError("Target column not found in data")
    
    X = data.drop(columns=[target])
    y = data[target]

    model = LogisticRegression(**parameters.get("model_params", {}))
    model.fit(X, y)

    y_pred = model.predict(X)
    metrics = {
        "accuracy": accuracy_score(y, y_pred),
        "precision": precision_score(y, y_pred, zero_division=0),
        "recall": recall_score(y, y_pred, zero_division=0),
        "f1_score": f1_score(y, y_pred, zero_division=0),
    }
    return model, metrics

def save_model(model, version: int) -> str:
    filename = f"model_v{version}.joblib"
    filepath = os.path.join(MODEL_DIR, filename)
    joblib.dump(model, filepath)
    return filepath

def load_model(version: int):
    filename = f"model_v{version}.joblib"
    filepath = os.path.join(MODEL_DIR, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Model version {version} not found")
    return joblib.load(filepath)
