import { useState } from 'react';
import { COMPARISON, LESSON_TEXT } from '../../data/lessonText';
import { AP_CURRICULUM_TERMS } from '../../data/apCurriculumTerms';

const ALL_WORDS = 'All Vocab';
const CATEGORY_FILTERS = [ALL_WORDS, 'protein', 'protein folding', 'structure', 'function'];
const DEFAULT_DEFINITION = 'Vocabulary term used in the lesson sequence.';
const TERM_CATEGORIES = {
  DNA: ['structure'],
  Gene: ['structure', 'function'],
  chromosome: ['structure'],
  nucleoid: ['structure'],
  'gene expression': ['function'],
  Promoter: ['structure', 'function'],
  promoter: ['structure', 'function'],
  Enhancer: ['structure', 'function'],
  enhancer: ['structure', 'function'],
  'Transcription factors': ['function'],
  'RNA polymerase': ['function'],
  'RNA nucleotides': ['structure'],
  'Template strand': ['structure'],
  'template strand': ['structure'],
  'Coding strand': ['structure'],
  'coding strand': ['structure'],
  ribonucleotide: ['structure'],
  'transcription bubble': ['structure'],
  mRNA: ['structure', 'function'],
  uracil: ['structure'],
  'complementary base pairing': ['structure', 'function'],
  'Pre-mRNA': ['structure'],
  'pre-mRNA': ['structure'],
  Spliceosome: ['function'],
  spliceosome: ['function'],
  Introns: ['structure'],
  introns: ['structure'],
  Exons: ['structure', 'function'],
  exons: ['structure', 'function'],
  "5' cap": ['structure', 'function'],
  '5’ cap': ['structure', 'function'],
  '5’ capping enzymes': ['function'],
  'Mature mRNA': ['structure', 'function'],
  'mature mRNA': ['structure', 'function'],
  'nuclear envelope': ['structure'],
  cytoplasm: ['structure'],
  Ribosome: ['protein', 'structure', 'function'],
  ribosome: ['protein', 'structure', 'function'],
  rRNA: ['protein', 'structure'],
  'mRNA codons': ['protein', 'structure', 'function'],
  'Start codon': ['protein', 'function'],
  'start codon': ['protein', 'function'],
  'Stop codons': ['protein', 'function'],
  'stop codons': ['protein', 'function'],
  tRNA: ['protein', 'structure', 'function'],
  Anticodons: ['protein', 'structure', 'function'],
  anticodons: ['protein', 'structure', 'function'],
  'Amino acids': ['protein', 'protein folding', 'structure'],
  'amino acids': ['protein', 'protein folding', 'structure'],
  ATP: ['function'],
  GTP: ['function'],
  'Initiation factors': ['protein', 'function'],
  'initiation factors': ['protein', 'function'],
  AUG: ['protein', 'function'],
  'reading frame': ['function'],
  'Elongation factors': ['protein', 'function'],
  'elongation factors': ['protein', 'function'],
  'Release factors': ['protein', 'function'],
  'release factors': ['protein', 'function'],
  termination: ['function'],
  'Peptide bonds': ['protein', 'protein folding', 'structure'],
  'peptide bonds': ['protein', 'protein folding', 'structure'],
  'Polypeptide chain': ['protein', 'protein folding', 'structure'],
  'polypeptide chain': ['protein', 'protein folding', 'structure'],
  Protein: ['protein', 'protein folding', 'structure', 'function'],
  protein: ['protein', 'protein folding', 'structure', 'function'],
  'protein folding': ['protein', 'protein folding', 'function'],
  structure: ['structure'],
  function: ['function'],
  Activators: ['function'],
  activators: ['function'],
  Repressors: ['function'],
  repressors: ['function'],
  'Regulatory DNA sequences': ['structure', 'function'],
  'regulatory DNA sequences': ['structure', 'function'],
  'Operon components': ['structure', 'function'],
  Operator: ['structure', 'function'],
  'RNA processing enzymes': ['function'],
  "5' capping enzymes": ['function'],
  'large subunit': ['protein', 'structure'],
  'small subunit': ['protein', 'structure'],
  'Ribosomal subunits': ['protein', 'structure'],
  Primer: ['function']
};

const ALL_TERMS = buildAllTerms();

export default function VocabularyPanel() {
  const [activeCategory, setActiveCategory] = useState(ALL_WORDS);
  const filteredTerms = activeCategory && activeCategory !== ALL_WORDS
    ? ALL_TERMS.filter(([term]) => TERM_CATEGORIES[term]?.includes(activeCategory))
    : ALL_TERMS;
  const terms = filteredTerms;
  return (
    <section className="glass rounded-lg p-4">
      <h2 className="text-lg font-semibold text-white">Vocabulary and Comparison</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        {CATEGORY_FILTERS.map((category) => {
          const active = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-md border px-4 py-2 text-base font-semibold transition ${
                active
                  ? 'border-cyanBio bg-cyanBio/15 text-white shadow-glow'
                  : 'border-line bg-panel/70 text-slate-200 hover:border-cyanBio/60 hover:text-white'
              }`}
              aria-pressed={active}
            >
              {category}
            </button>
          );
        })}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              {COMPARISON[0].map((head) => (
                <th key={head} className="border-b border-line bg-panel2 px-3 py-2 text-slate-200">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON.slice(1).map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) => (
                  <td key={cell} className={`border-b border-line/70 px-3 py-2 text-slate-300 ${index === 0 ? 'font-semibold text-white' : ''}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">AP Curriculum Coverage</h3>
        <div className="mt-3 grid max-h-[420px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {terms.map(([term, definition], index) => (
            <div key={term} className="rounded-md border border-line bg-panel2/70 p-2 text-sm">
              <p className="font-semibold text-white">{index + 1}. {term}</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">{definition}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function buildAllTerms() {
  const definitions = new Map(AP_CURRICULUM_TERMS);
  Object.values(LESSON_TEXT).forEach((entry) => {
    (entry.vocab || []).forEach((term) => {
      if (!definitions.has(term)) definitions.set(term, DEFAULT_DEFINITION);
    });
  });
  return Array.from(definitions.entries()).sort(([a], [b]) => a.localeCompare(b));
}
