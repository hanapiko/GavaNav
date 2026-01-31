import json
import re

def _normalize(s: str) -> str:
    if not s: return ""
    return re.sub(r'[^a-zA-Z0-9]', '', s.lower())

def test_match(kb_key, kb_val, input_name):
    key_norm = _normalize(kb_key)
    val_norm = _normalize(kb_val)
    name_norm = _normalize(input_name)
    
    print(f"Input: {input_name} -> {name_norm}")
    print(f"Key: {kb_key} -> {key_norm}")
    print(f"Val: {kb_val} -> {val_norm}")
    
    matches = name_norm in key_norm or key_norm in name_norm or name_norm in val_norm or val_norm in name_norm
    print(f"Match: {matches}")

test_match("national_id", "National Identity Card (Huduma Namba)", "National ID (Huduma Namba)")
