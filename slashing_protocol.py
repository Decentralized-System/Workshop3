# slashing_protocol.py
from json_database import model_balances

# Define constants for penalty and reward
PENALTY_AMOUNT = 50
REWARD_AMOUNT = 20

def apply_slashing(model_id, consensus_prediction, model_prediction, is_accurate_prediction):
    if model_id in model_balances:
        if is_accurate_prediction:
            # Reward for accurate predictions
            model_balances[model_id] += REWARD_AMOUNT
        else:
            # Penalty for inaccurate predictions
            model_balances[model_id] -= PENALTY_AMOUNT

            # Additional penalty for divergence from consensus
            consensus_penalty_factor = 1.5  # Adjust as needed
            divergence_penalty = abs(model_prediction - consensus_prediction) * PENALTY_AMOUNT * consensus_penalty_factor
            model_balances[model_id] -= divergence_penalty

        # Ensure balance doesn't go below zero
        model_balances[model_id] = max(0, model_balances[model_id])
