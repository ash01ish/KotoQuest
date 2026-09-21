#!/usr/bin/env python3
# scripts/build_all.py
# Comprehensive builder that merges all N5-N1 enrichments into reading.js and listening.js,
# validates 100% 8-language completeness and exact item counts (15 per level, 75 total each),
# and synchronizes both repositories.

import json
import os
import shutil
import sys

from enrich_n5 import (
    N5_READING_PASSAGES, N5_READING_QUESTIONS,
    N5_LISTENING_TRANSCRIPTS, N5_LISTENING_QUESTIONS
)
from enrich_n4 import (
    N4_READING_EXISTING_PASSAGES, N4_READING_EXISTING_QUESTIONS, N4_NEW_READING_ITEMS,
    N4_LISTENING_EXISTING_TRANSCRIPTS, N4_LISTENING_EXISTING_QUESTIONS, N4_NEW_LISTENING_ITEMS
)
from enrich_n3 import (
    N3_READING_EXISTING_PASSAGES, N3_READING_EXISTING_QUESTIONS, N3_NEW_READING_ITEMS,
    N3_LISTENING_EXISTING_TRANSCRIPTS, N3_LISTENING_EXISTING_QUESTIONS, N3_NEW_LISTENING_ITEMS
)
from enrich_n2 import (
    N2_READING_EXISTING_PASSAGES, N2_READING_EXISTING_QUESTIONS, N2_NEW_READING_ITEMS,
    N2_LISTENING_EXISTING_TRANSCRIPTS, N2_LISTENING_EXISTING_QUESTIONS, N2_NEW_LISTENING_ITEMS
)
from enrich_n1 import (
    N1_READING_EXISTING_PASSAGES, N1_READING_EXISTING_QUESTIONS, N1_NEW_READING_ITEMS,
    N1_LISTENING_EXISTING_TRANSCRIPTS, N1_LISTENING_EXISTING_QUESTIONS, N1_NEW_LISTENING_ITEMS
)

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORKSPACE_ROOT = "/Users/ashishthirunagari/Documents/antigravity/amazing-lovelace"

LANGS = ['en', 'te', 'hi', 'ta', 'ko', 'es', 'kn', 'ml']
LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']

def load_js_bank(file_path, var_name):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    idx = content.find(f"window.{var_name} =")
    if idx == -1:
        raise ValueError(f"Could not find window.{var_name} in {file_path}")
    json_str = content[idx + len(f"window.{var_name} ="):].strip().rstrip(";")
    return json.loads(json_str)

def save_js_bank(file_path, var_name, data, header_comment):
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(header_comment.strip() + "\n")
        f.write(f"window.{var_name} = ")
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print(f"✓ Saved {file_path}")

def apply_passage_translations(items, passage_map, question_map, prefix="passage"):
    for item in items:
        iid = item["id"]
        # Apply passage translations
        if iid in passage_map:
            for lang, text in passage_map[iid].items():
                item[f"{prefix}_{lang}"] = text
        # Apply question translations
        if iid in question_map:
            q_trans_list = question_map[iid]
            for idx, q in enumerate(item.get("questions", [])):
                if idx < len(q_trans_list):
                    for lang, q_text in q_trans_list[idx].items():
                        q[f"q_{lang}"] = q_text

def build_reading():
    file_path = os.path.join(REPO_ROOT, "js", "data", "reading.js")
    bank = load_js_bank(file_path, "READING_BANK")

    # N5 items 1-10
    apply_passage_translations(bank["N5"][:10], N5_READING_PASSAGES, N5_READING_QUESTIONS, "passage")

    # N4
    apply_passage_translations(bank["N4"][:9], N4_READING_EXISTING_PASSAGES, N4_READING_EXISTING_QUESTIONS, "passage")
    bank["N4"] = bank["N4"][:9] + N4_NEW_READING_ITEMS

    # N3
    apply_passage_translations(bank["N3"][:9], N3_READING_EXISTING_PASSAGES, N3_READING_EXISTING_QUESTIONS, "passage")
    bank["N3"] = bank["N3"][:9] + N3_NEW_READING_ITEMS

    # N2
    apply_passage_translations(bank["N2"][:9], N2_READING_EXISTING_PASSAGES, N2_READING_EXISTING_QUESTIONS, "passage")
    bank["N2"] = bank["N2"][:9] + N2_NEW_READING_ITEMS

    # N1
    apply_passage_translations(bank["N1"][:9], N1_READING_EXISTING_PASSAGES, N1_READING_EXISTING_QUESTIONS, "passage")
    bank["N1"] = bank["N1"][:9] + N1_NEW_READING_ITEMS

    # Verification
    for lv in LEVELS:
        items = bank[lv]
        if len(items) != 15:
            print(f"ERROR: Reading {lv} has {len(items)} items, expected 15!", file=sys.stderr)
            sys.exit(1)
        for it in items:
            for l in LANGS:
                pk = f"passage_{l}"
                if pk not in it or not it[pk].strip():
                    print(f"ERROR: Reading item {it['id']} missing {pk}!", file=sys.stderr)
                    sys.exit(1)
            for qi, q in enumerate(it.get("questions", [])):
                for l in LANGS:
                    qk = f"q_{l}"
                    if qk not in q or not q[qk].strip():
                        print(f"ERROR: Reading item {it['id']} Q{qi+1} missing {qk}!", file=sys.stderr)
                        sys.exit(1)

    header = """// READING_BANK — original JLPT-style practice content with multilingual translations.
// Practice material, not official exam content."""
    save_js_bank(file_path, "READING_BANK", bank, header)

    # Sync to workspace if exists
    ws_dest = os.path.join(WORKSPACE_ROOT, "js", "data", "reading.js")
    if os.path.exists(os.path.dirname(ws_dest)):
        shutil.copyfile(file_path, ws_dest)
        print(f"✓ Synchronized to {ws_dest}")

def build_listening():
    file_path = os.path.join(REPO_ROOT, "js", "data", "listening.js")
    bank = load_js_bank(file_path, "LISTENING_BANK")

    # N5 items 1-10
    apply_passage_translations(bank["N5"][:10], N5_LISTENING_TRANSCRIPTS, N5_LISTENING_QUESTIONS, "transcript")

    # N4
    apply_passage_translations(bank["N4"][:9], N4_LISTENING_EXISTING_TRANSCRIPTS, N4_LISTENING_EXISTING_QUESTIONS, "transcript")
    bank["N4"] = bank["N4"][:9] + N4_NEW_LISTENING_ITEMS

    # N3
    apply_passage_translations(bank["N3"][:9], N3_LISTENING_EXISTING_TRANSCRIPTS, N3_LISTENING_EXISTING_QUESTIONS, "transcript")
    bank["N3"] = bank["N3"][:9] + N3_NEW_LISTENING_ITEMS

    # N2
    apply_passage_translations(bank["N2"][:9], N2_LISTENING_EXISTING_TRANSCRIPTS, N2_LISTENING_EXISTING_QUESTIONS, "transcript")
    bank["N2"] = bank["N2"][:9] + N2_NEW_LISTENING_ITEMS

    # N1
    apply_passage_translations(bank["N1"][:9], N1_LISTENING_EXISTING_TRANSCRIPTS, N1_LISTENING_EXISTING_QUESTIONS, "transcript")
    bank["N1"] = bank["N1"][:9] + N1_NEW_LISTENING_ITEMS

    # Verification
    for lv in LEVELS:
        items = bank[lv]
        if len(items) != 15:
            print(f"ERROR: Listening {lv} has {len(items)} items, expected 15!", file=sys.stderr)
            sys.exit(1)
        for it in items:
            for l in LANGS:
                tk = f"transcript_{l}"
                if tk not in it or not it[tk].strip():
                    print(f"ERROR: Listening item {it['id']} missing {tk}!", file=sys.stderr)
                    sys.exit(1)
            for qi, q in enumerate(it.get("questions", [])):
                for l in LANGS:
                    qk = f"q_{l}"
                    if qk not in q or not q[qk].strip():
                        print(f"ERROR: Listening item {it['id']} Q{qi+1} missing {qk}!", file=sys.stderr)
                        sys.exit(1)

    header = """// LISTENING_BANK — original JLPT-style listening scripts with multilingual transcripts.
// Practice material, not official exam content."""
    save_js_bank(file_path, "LISTENING_BANK", bank, header)

    # Sync to workspace if exists
    ws_dest = os.path.join(WORKSPACE_ROOT, "js", "data", "listening.js")
    if os.path.exists(os.path.dirname(ws_dest)):
        shutil.copyfile(file_path, ws_dest)
        print(f"✓ Synchronized to {ws_dest}")

if __name__ == "__main__":
    print("Building Reading Bank...")
    build_reading()
    print("\nBuilding Listening Bank...")
    build_listening()
    print("\n🎉 Full enrichment complete: 75 Reading items and 75 Listening items across 8 languages!")
