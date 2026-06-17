# Question Bank Maintenance

## Files
- `questions.json` — the question bank
- `hashes.json` — MD5 hashes of processed source images
- `process_images.py` — Step 1: dedup images by MD5, delete exact duplicates
- `add_question.py` — Step 3–5: append question, update hashes, move image

## Adding questions from images

### Step 1 — Run the dedup script
```bash
python3 questions/process_images.py
```
Computes MD5 hashes for all images in `exam-images/`, deletes any whose hash already exists in `hashes.json` (exact file duplicates), and prints the remaining new images to process.

### Step 2 — Read each new image
Read the image files listed by Step 1 and extract the question data.

### Step 3–5 — Append via add_question.py
```bash
python3 questions/add_question.py \
    --image exam-images/photo-xxxx.jpg \
    --topic "Azure AI topic area" \
    --scenario "Full question text, no options" \
    --type single \
    --options "Option A" "Option B" "Option C" \
    --correct 1 \
    --explanation "Explanation text from image"
```

The script handles everything automatically:
- **Deduplication**: if the scenario text already exists in `questions.json`, the image is deleted and the entry is skipped
- **Append**: adds the new entry to `questions.json` with the next available id
- **Hash update**: records the image MD5 in `hashes.json`
- **Move**: moves the image to `exam-images/done/`

`--correct` takes 0-based index/indices. For multi-select, pass multiple values: `--correct 0 2`.

`--type` is `single` or `multi-select`.
