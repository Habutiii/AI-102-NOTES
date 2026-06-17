#!/usr/bin/env python3
"""
Step 3+4+5 of question bank maintenance.
Appends a question to questions.json, updates hashes.json, and moves the
source image to exam-images/done/.

Deduplication: if a question with the same scenario text already exists in
questions.json, the entry is skipped and the source image is deleted instead
of moved.

Usage:
    python3 questions/add_question.py \
        --image exam-images/photo-xxxx.jpg \
        --topic "Azure AI Vision" \
        --scenario "You need to..." \
        --type single \
        --options "Option A" "Option B" "Option C" \
        --correct 1 \
        --explanation "Because..."
"""

import argparse
import hashlib
import json
import os
import shutil

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUESTIONS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "questions.json")
HASHES_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hashes.json")
DONE_DIR = os.path.join(REPO_ROOT, "exam-images", "done")


def md5(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def load_json(path, default):
    if not os.path.exists(path):
        return default
    with open(path) as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def normalize(text):
    return " ".join(text.lower().split())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True, help="Path to source image")
    parser.add_argument("--topic", required=True)
    parser.add_argument("--scenario", required=True)
    parser.add_argument("--type", required=True, choices=["single", "multi-select"])
    parser.add_argument("--options", required=True, nargs="+")
    parser.add_argument("--correct", required=True, nargs="+", type=int)
    parser.add_argument("--explanation", required=True)
    args = parser.parse_args()

    image_path = os.path.abspath(args.image)
    if not os.path.exists(image_path):
        print(f"ERROR: image not found: {image_path}")
        return 1

    questions = load_json(QUESTIONS_FILE, [])
    hashes = load_json(HASHES_FILE, {})

    # Dedup by scenario text
    norm_scenario = normalize(args.scenario)
    for q in questions:
        if normalize(q.get("scenario", "")) == norm_scenario:
            print(f"[DUPLICATE] Scenario already exists as question_id={q['id']} — deleting image.")
            os.remove(image_path)
            return 0

    # Assign next id
    next_id = max((q["id"] for q in questions), default=0) + 1

    entry = {
        "id": next_id,
        "topic": args.topic,
        "scenario": args.scenario,
        "type": args.type,
        "options": args.options,
        "correct": args.correct,
        "explanation": args.explanation,
    }

    questions.append(entry)
    save_json(QUESTIONS_FILE, questions)
    print(f"[ADDED] question_id={next_id} — {args.topic}")

    # Update hashes
    digest = md5(image_path)
    hashes[digest] = {"file": os.path.basename(image_path), "question_id": next_id}
    save_json(HASHES_FILE, hashes)

    # Move image to done/
    os.makedirs(DONE_DIR, exist_ok=True)
    dest = os.path.join(DONE_DIR, os.path.basename(image_path))
    shutil.move(image_path, dest)
    print(f"[MOVED] {os.path.basename(image_path)} → exam-images/done/")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
