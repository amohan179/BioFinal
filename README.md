# Central Dogma Lab

An interactive learning tool for AP Biology students studying DNA, transcription, eukaryotic mRNA processing, translation, and protein formation. The app combines a React interface, a Three.js simulation, sequence logic, a codon table, quizzes, teacher notes, and an optional FastAPI backend.

## Features

- Interactive 3D eukaryotic and prokaryotic protein synthesis simulation
- DNA double helix with base labels, backbone toggle, gene highlighting, and unzip/transcription states
- Timeline for DNA storage through simplified protein folding
- Eukaryotic mRNA processing view with introns, exons, splicing, 5' cap, and mRNA export
- Translation model with codons, anticodons, tRNA, ribosome, amino acid chain, peptide bonds, start codon, and stop codons
- DNA input tool that accepts coding or template strands
- Full 64-codon rectangular RNA codon table with highlighting
- Multiple quiz types: multiple choice, matching, ordering, missing base, anticodon, codon prediction, and label identification
- Eukaryote/prokaryote comparison
- Accessibility support for labels, keyboard operation, high-contrast styling, and system reduced-motion preferences
- Optional FastAPI backend for sequence validation, transcription, translation, and full-process results

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Three.js, @react-three/fiber, @react-three/drei, Zustand
- Backend: FastAPI, Pydantic, Uvicorn

## Folder Structure

```text
frontend/
  src/
    components/
      controls/
      education/
      layout/
      quiz/
      sequence/
      simulation/
    data/
    store/
    styles/
    utils/
backend/
  main.py
  biology.py
  models.py
  requirements.txt
```

## Install and Run

Install frontend dependencies from the project root:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Install backend dependencies:

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
```

Run the backend:

```bash
uvicorn backend.main:app --reload --port 8001
```

The frontend uses `VITE_API_URL` when set, otherwise it tries `http://127.0.0.1:8001`. If the backend is unavailable, the app falls back to local JavaScript biology logic and displays that status.

## Backend API

- `GET /api/health`: health check
- `GET /api/codon-table`: complete RNA codon table
- `POST /api/validate-sequence`: clean and validate DNA or RNA
- `POST /api/transcribe`: transcribe DNA coding or template strand to mRNA
- `POST /api/translate`: translate mRNA codon by codon
- `POST /api/full-process`: validate DNA, transcribe, translate, and return warnings

## Using the Simulation

Use the timeline to move from stored DNA through transcription, mRNA processing, export, translation, and simplified protein folding. Switch between eukaryotic and prokaryotic views to compare compartmentalized protein synthesis with coupled transcription/translation. The 3D scene supports rotate, zoom, pan, hover labels, clickable structures, camera reset, label toggles, and playback speed.

## DNA Input

Enter DNA using A, T, C, and G. Spaces and lowercase letters are accepted. Choose whether the input is a coding strand or template strand. Coding strand input is transcribed by replacing T with U. Template strand input is transcribed by complementing bases into RNA.

The tool warns about invalid characters, incomplete codons, missing start codons, missing stop codons, and possible open reading frame issues.

## Quiz Mode

Quiz mode provides immediate feedback, explanations, scoring, retry, and AP Biology vocabulary across DNA/RNA differences, transcription, processing, translation, codons, anticodons, tRNA, ribosomes, and eukaryote/prokaryote comparisons.

## Biology Accuracy Notes

The app is designed for AP Biology. Molecular structures are simplified educational models, not atomistic molecular dynamics. Protein folding is shown as an illustrative collapse of a polypeptide chain into a functional form; it does not predict real protein structure from arbitrary DNA sequences.

## Sources

- OpenStax Biology 2e, Gene Expression: https://openstax.org/books/biology-2e/pages/15-introduction
- Khan Academy, DNA and RNA structure: https://www.khanacademy.org/science/biology/dna-as-the-genetic-material
- Khan Academy, Translation: https://www.khanacademy.org/science/biology/gene-expression-central-dogma/translation-polypeptides
- Nature Education / Scitable, Central Dogma: https://www.nature.com/scitable/topicpage/translation-dna-to-mrna-to-protein-393/
- NCBI Bookshelf, Molecular Biology of the Cell: https://www.ncbi.nlm.nih.gov/books/
- College Board AP Biology Course and Exam Description: https://apcentral.collegeboard.org/courses/ap-biology
