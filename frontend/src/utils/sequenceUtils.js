import { CODON_TABLE, STOP_CODONS } from '../data/codonTable';

const DNA_COMPLEMENT = { A: 'T', T: 'A', C: 'G', G: 'C' };
const RNA_FROM_TEMPLATE = { A: 'U', T: 'A', C: 'G', G: 'C' };
const RNA_COMPLEMENT = { A: 'U', U: 'A', C: 'G', G: 'C' };

export function cleanSequence(value = '') {
  return value.toUpperCase().replace(/\s+/g, '');
}

export function groupCodons(sequence = '') {
  const groups = [];
  for (let i = 0; i < sequence.length; i += 3) groups.push(sequence.slice(i, i + 3));
  return groups.filter(Boolean);
}

export function validateDNA(value = '') {
  const cleaned = cleanSequence(value);
  const invalid = [...new Set(cleaned.replace(/[ATCG]/g, '').split('').filter(Boolean))];
  const warnings = [];
  if (!cleaned) warnings.push('Enter a DNA sequence to begin.');
  if (cleaned.length % 3 !== 0) warnings.push('The sequence has an incomplete codon at the end.');
  return { cleaned, valid: invalid.length === 0 && cleaned.length > 0, invalid, warnings };
}

export function transcribeDNA(dna, strandType = 'coding') {
  const cleaned = cleanSequence(dna);
  if (strandType === 'template') {
    return cleaned.split('').map((base) => RNA_FROM_TEMPLATE[base] || '').join('');
  }
  return cleaned.replaceAll('T', 'U');
}

export function codingFromTemplate(template) {
  return cleanSequence(template).split('').map((base) => DNA_COMPLEMENT[base] || '').join('');
}

export function anticodonFor(codon) {
  return codon.split('').map((base) => RNA_COMPLEMENT[base] || '?').join('');
}

export function translateMRNA(mrna) {
  const cleaned = cleanSequence(mrna).replaceAll('T', 'U');
  const codons = groupCodons(cleaned);
  const startIndex = codons.findIndex((codon) => codon === 'AUG');
  const warnings = [];
  if (cleaned.length % 3 !== 0) warnings.push('The mRNA has extra bases that do not make a complete codon.');
  if (startIndex === -1) warnings.push('No AUG start codon was found in this reading frame.');

  const translated = [];
  let started = false;
  for (let index = 0; index < codons.length; index += 1) {
    const codon = codons[index];
    const entry = CODON_TABLE[codon];
    if (!entry) {
      translated.push({ codon, aminoAcid: 'Unknown', short: '?', anticodon: anticodonFor(codon), index });
      continue;
    }
    if (codon === 'AUG') started = true;
    if (started) {
      translated.push({
        codon,
        aminoAcid: entry.name,
        short: entry.short,
        stop: Boolean(entry.stop),
        start: Boolean(entry.start),
        anticodon: entry.stop ? 'No tRNA' : anticodonFor(codon),
        index
      });
      if (entry.stop) break;
    }
  }

  if (startIndex !== -1 && !translated.some((item) => item.stop)) warnings.push('No stop codon was reached after the first AUG.');
  return { mrna: cleaned, codons, protein: translated, warnings, startIndex };
}

export function fullProcess(dna, strandType = 'coding') {
  const validation = validateDNA(dna);
  const mrna = transcribeDNA(validation.cleaned, strandType);
  const translation = translateMRNA(mrna);
  const warnings = [...validation.warnings, ...translation.warnings];
  if (validation.invalid.length) warnings.unshift(`Invalid DNA character(s): ${validation.invalid.join(', ')}`);
  return {
    dna: validation.cleaned,
    mrna,
    codons: translation.codons,
    protein: translation.protein,
    valid: validation.valid,
    warnings,
    strandType
  };
}

export function generateRandomGene(codons = 9) {
  const middle = ['GAA', 'UUU', 'GCU', 'ACC', 'CGU', 'AAG', 'GGC', 'UAU', 'CAG', 'GUU'];
  const stop = STOP_CODONS[Math.floor(Math.random() * STOP_CODONS.length)];
  const rna = ['AUG'];
  for (let i = 0; i < codons - 2; i += 1) rna.push(middle[Math.floor(Math.random() * middle.length)]);
  rna.push(stop);
  return rna.join('').replaceAll('U', 'T');
}
