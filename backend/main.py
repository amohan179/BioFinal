from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from .biology import CODON_TABLE, full_process, transcribe, translate, validate_sequence
from .molecular import analyze_structure_text, fetch_structure_text
from .models import DNARequest, SequenceRequest, ValidateRequest

app = FastAPI(
    title="Central Dogma Lab API",
    description="Sequence validation, transcription, and translation endpoints for AP Biology.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "central-dogma-lab-api"}


@app.get("/api/codon-table")
def codon_table():
    return {"source": "backend", "codon_table": CODON_TABLE}


@app.post("/api/validate-sequence")
def validate(request: ValidateRequest):
    return {"source": "backend", **validate_sequence(request.sequence, request.molecule)}


@app.post("/api/transcribe")
def transcribe_endpoint(request: DNARequest):
    return {"source": "backend", **transcribe(request.sequence, request.strand_type)}


@app.post("/api/translate")
def translate_endpoint(request: SequenceRequest):
    return {"source": "backend", **translate(request.sequence)}


@app.post("/api/full-process")
def full_process_endpoint(request: DNARequest):
    return full_process(request.sequence, request.strand_type)


@app.get("/api/structures/{pdb_id}/coordinates", response_class=PlainTextResponse)
def structure_coordinates(pdb_id: str):
    try:
        structure_text, _ = fetch_structure_text(pdb_id)
        return structure_text
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error


@app.get("/api/structures/{pdb_id}/analysis")
def structure_analysis(pdb_id: str):
    try:
        structure_text, file_format = fetch_structure_text(pdb_id)
        return analyze_structure_text(pdb_id, structure_text, file_format)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
