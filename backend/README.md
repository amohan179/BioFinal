# Central Dogma Lab Backend

FastAPI backend for validating DNA/RNA sequences, transcription, translation, and full central dogma sequence processing.

## Run

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8001
```

## Endpoints

- `GET /api/health`
- `GET /api/codon-table`
- `POST /api/validate-sequence`
- `POST /api/transcribe`
- `POST /api/translate`
- `POST /api/full-process`
