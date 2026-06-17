#!/usr/bin/env python3
"""
Step 1 of question bank maintenance.
- Scans exam-images/ for new images (not in hashes.json).
- Deletes exact duplicates (already in hashes.json).
- Prints new images for Claude to process.

Usage: python3 questions/process_images.py
"""

import hashlib
import json
import os
import shutil

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(REPO_ROOT, "exam-images")
DONE_DIR = os.path.join(IMAGES_DIR, "done")
HASHES_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hashes.json")


def md5(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def load_hashes():
    if not os.path.exists(HASHES_FILE):
        return {}
    with open(HASHES_FILE) as f:
        return json.load(f)


def main():
    known = load_hashes()
    images = sorted(
        f for f in os.listdir(IMAGES_DIR)
        if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
    )

    if not images:
        print("No images found in exam-images/")
        return

    duplicates = []
    new_images = []

    for filename in images:
        path = os.path.join(IMAGES_DIR, filename)
        digest = md5(path)
        if digest in known:
            duplicates.append((filename, digest, known[digest].get("question_id")))
        else:
            new_images.append((filename, digest))

    for filename, digest, qid in duplicates:
        path = os.path.join(IMAGES_DIR, filename)
        os.remove(path)
        print(f"[REMOVED DUPLICATE] {filename} (hash {digest[:8]}, already question_id={qid})")

    if new_images:
        print(f"\n[NEW] {len(new_images)} image(s) to process:")
        for filename, digest in new_images:
            print(f"  {filename}  (md5: {digest})")
    else:
        print("\nNo new images to process.")


if __name__ == "__main__":
    main()
