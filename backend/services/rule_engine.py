import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
RULES_DIR = os.path.join(BASE_DIR, "rules")


def load_rule(file_name: str):
    with open(os.path.join(RULES_DIR, file_name)) as f:
        return json.load(f)


def classify_range(value: float, rule_dict: dict):
    for key, rule in rule_dict.items():
        min_val = rule.get("min", float("-inf"))
        max_val = rule.get("max", float("inf"))
        if min_val <= value <= max_val:
            return rule["label"]
    return "Unknown"
