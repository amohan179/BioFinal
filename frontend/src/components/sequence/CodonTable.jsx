import { useMemo, useState } from 'react';
import { Atom, Search } from 'lucide-react';
import { CODON_TABLE, RNA_BASES } from '../../data/codonTable';
import { useSimulationStore } from '../../store/simulationStore';

const CLASS_COLORS = {
  nonpolar: 'border-slate-400/40 bg-slate-400/8',
  polar: 'border-cyanBio/45 bg-cyanBio/8',
  positive: 'border-greenBio/45 bg-greenBio/8',
  negative: 'border-amberBio/50 bg-amberBio/8',
  start: 'border-greenBio bg-greenBio/16',
  stop: 'border-roseBio/70 bg-roseBio/12'
};

const POLARITY_LEGEND = [
  ['Nonpolar', 'border-slate-400/60 bg-slate-400/15'],
  ['Polar uncharged', 'border-cyanBio/60 bg-cyanBio/15'],
  ['Positively charged', 'border-greenBio/60 bg-greenBio/15'],
  ['Negatively charged', 'border-amberBio/60 bg-amberBio/15'],
  ['Not applicable', 'border-roseBio/60 bg-roseBio/15']
];

export default function CodonTable() {
  const { sequenceResult } = useSimulationStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('AUG');
  const used = new Set(sequenceResult.codons || []);
  const selectedEntry = CODON_TABLE[selected];
  const rows = useMemo(() => {
    const codons = [];
    RNA_BASES.forEach((first) => RNA_BASES.forEach((second) => RNA_BASES.forEach((third) => codons.push(`${first}${second}${third}`))));
    return codons;
  }, []);

  return (
    <section className="glass rounded-lg p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-white">
            <Atom size={20} className="text-cyanBio" aria-hidden="true" />
            <h3 className="text-lg font-semibold">RNA Codon Chemistry</h3>
          </div>
          <p className="mt-1 text-sm text-slate-300">Each codon shows its encoded amino acid and side-chain polarity class.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-200">
          {POLARITY_LEGEND.map(([label, styles]) => (
            <span key={label} className={`rounded border px-2 py-1 ${styles}`}>{label}</span>
          ))}
        </div>
      </div>
      <label className="mt-4 block text-sm font-semibold text-white" htmlFor="codon-search">Search or highlight codon</label>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} aria-hidden="true" />
        <input
          id="codon-search"
          className="control w-full pl-10 pr-3"
          value={query}
          onChange={(event) => setQuery(event.target.value.toUpperCase().replace(/T/g, 'U').slice(0, 24))}
          placeholder="AUG, stop, Methionine, nonpolar..."
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {rows.map((codon) => {
          const entry = CODON_TABLE[codon];
          const matches = !query || codon.includes(query) || entry.name.toUpperCase().includes(query) || entry.short.toUpperCase().includes(query) || entry.polarity.toUpperCase().includes(query);
          const active = selected === codon;
          const usedHere = used.has(codon);
          return (
            <button
              type="button"
              key={codon}
              onClick={() => setSelected(codon)}
              className={`min-h-[92px] rounded-md border p-2 text-left text-xs transition hover:-translate-y-0.5 hover:border-white/50 ${CLASS_COLORS[entry.className]} ${active ? 'ring-2 ring-cyanBio' : ''} ${usedHere ? 'shadow-glow' : ''} ${matches ? 'opacity-100' : 'opacity-25'}`}
            >
              <span className="block font-mono text-base font-bold text-white">{codon}</span>
              <span className="mt-0.5 block text-slate-200">{entry.short}{entry.start ? ' · Start' : ''}{entry.stop ? ' · Stop' : ''}</span>
              <span className="mt-2 block border-t border-white/10 pt-1 text-[10px] leading-4 text-slate-300">{entry.polarity}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 grid gap-3 rounded-md border border-line bg-panel2 p-3 text-sm text-slate-300 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          {selectedEntry.stop ? (
            <p><span className="font-mono text-base font-bold text-white">{selected}</span> is a <span className="font-semibold text-white">stop codon</span>; it does not encode an amino acid.</p>
          ) : (
            <p><span className="font-mono text-base font-bold text-white">{selected}</span> encodes <span className="font-semibold text-white">{selectedEntry.name}</span>.</p>
          )}
          <p className="mt-1">AUG commonly serves as the start codon and encodes methionine. UAA, UAG, and UGA are stop codons.</p>
        </div>
        <div className="rounded-md border border-cyanBio/30 bg-cyanBio/8 px-3 py-2">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Side-chain polarity</p>
          <p className="mt-1 font-semibold text-cyan-50">{selectedEntry.polarity}</p>
        </div>
      </div>
    </section>
  );
}
