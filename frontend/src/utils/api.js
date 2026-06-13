import { CODON_TABLE } from '../data/codonTable';
import { fullProcess, transcribeDNA, translateMRNA, validateDNA } from './sequenceUtils';

const API_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) throw new Error(`Backend request failed: ${response.status}`);
  return response.json();
}

export async function getHealth() {
  return request('/api/health');
}

export async function getCodonTable() {
  try {
    return await request('/api/codon-table');
  } catch {
    return { source: 'local', codon_table: CODON_TABLE };
  }
}

export async function runFullProcess(dna, strandType) {
  try {
    return await request('/api/full-process', {
      method: 'POST',
      body: JSON.stringify({ sequence: dna, strand_type: strandType })
    });
  } catch {
    return { source: 'local', ...fullProcess(dna, strandType) };
  }
}

export async function runTranscribe(sequence, strandType) {
  try {
    return await request('/api/transcribe', {
      method: 'POST',
      body: JSON.stringify({ sequence, strand_type: strandType })
    });
  } catch {
    return { source: 'local', mrna: transcribeDNA(sequence, strandType), warnings: validateDNA(sequence).warnings };
  }
}

export async function runTranslate(sequence) {
  try {
    return await request('/api/translate', {
      method: 'POST',
      body: JSON.stringify({ sequence })
    });
  } catch {
    return { source: 'local', ...translateMRNA(sequence) };
  }
}

export async function getStructureCoordinates(pdbId, format = 'pdb') {
  try {
    const response = await fetch(`${API_URL}/api/structures/${pdbId}/coordinates`);
    if (!response.ok) throw new Error(`Backend request failed: ${response.status}`);
    return { source: 'backend', coordinates: await response.text(), format };
  } catch {
    const response = await fetch(`https://files.rcsb.org/download/${pdbId}.${format}`);
    if (!response.ok) throw new Error(`Unable to download ${pdbId} from RCSB PDB.`);
    return { source: 'rcsb-direct', coordinates: await response.text(), format };
  }
}

export async function getStructureAnalysis(pdbId, structureText, format = 'pdb') {
  try {
    return await request(`/api/structures/${pdbId}/analysis`);
  } catch {
    return format === 'pdb' ? analyzePdbLocally(pdbId, structureText) : {
      source: 'browser fallback',
      pdb_id: pdbId,
      format,
      atom_count: 'API required',
      chain_count: 'API required',
      residue_count: 'API required',
      heteroatom_count: 'API required',
      elements: {}
    };
  }
}

function analyzePdbLocally(pdbId, pdbText) {
  const atoms = pdbText.split('\n').filter((line) => line.startsWith('ATOM  ') || line.startsWith('HETATM'));
  const atomLines = atoms.filter((line) => line.startsWith('ATOM  '));
  const heteroatoms = atoms.length - atomLines.length;
  const chains = new Set();
  const residues = new Set();
  const elements = {};

  atomLines.forEach((line) => {
    const chain = line.slice(21, 22).trim() || 'blank';
    const residue = `${chain}:${line.slice(22, 27).trim()}:${line.slice(17, 20).trim()}`;
    const element = line.slice(76, 78).trim() || line.slice(12, 14).trim().replace(/[^A-Za-z]/g, '').slice(0, 1);
    chains.add(chain);
    residues.add(residue);
    elements[element] = (elements[element] || 0) + 1;
  });

  return {
    source: 'browser fallback',
    pdb_id: pdbId,
    model_count: 1,
    chain_count: chains.size,
    residue_count: residues.size,
    atom_count: atoms.length,
    heteroatom_count: heteroatoms,
    elements
  };
}
