#!/usr/bin/env python3
# scripts/generate_all_banks.py
# Generates the fully enriched js/data/reading.js and js/data/listening.js
# with 15 items per level (75 total each) and 100% 8-language translations (en, te, hi, ta, ko, es, kn, ml).

import json
import os

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
READING_PATH = os.path.join(REPO_ROOT, 'js', 'data', 'reading.js')
LISTENING_PATH = os.path.join(REPO_ROOT, 'js', 'data', 'listening.js')

LANGS = ['en', 'te', 'hi', 'ta', 'ko', 'es', 'kn', 'ml']

def load_js_bank(file_path, var_name):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    idx = content.find(f"window.{var_name} =")
    json_str = content[idx + len(f"window.{var_name} ="):].strip().rstrip(";")
    return json.loads(json_str)

def save_js_bank(file_path, var_name, data, header_comment):
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(header_comment + "\n")
        f.write(f"window.{var_name} = ")
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print(f"✓ Successfully wrote {file_path}")

# Load base data
reading_bank = load_js_bank(READING_PATH, "READING_BANK")
listening_bank = load_js_bank(LISTENING_PATH, "LISTENING_BANK")

print("Original reading count per level:", {k: len(v) for k, v in reading_bank.items()})
print("Original listening count per level:", {k: len(v) for k, v in listening_bank.items()})
