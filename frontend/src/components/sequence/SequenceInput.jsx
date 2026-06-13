import { useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Check, ChevronsUpDown, Dices, Eraser, FlaskConical, Wand2 } from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';
import { runFullProcess } from '../../utils/api';
import { fullProcess } from '../../utils/sequenceUtils';

const PRESETS = [
  { label: 'Short gene', value: 'ATG GAA TTT TAA' },
  { label: 'Longer ORF', value: 'ATG ACC GCT AAG GGT TGA' },
  { label: 'Template example', value: 'TAC CTT AAA ATT' }
];

export default function SequenceInput() {
  const { dnaSequence, strandType, setSequenceResult, setDnaSequence, setStrandType, randomizeSequence, clearSequence, setStep } = useSimulationStore();
  const [loading, setLoading] = useState(false);
  const [apiSource, setApiSource] = useState('local');
  const selectedStrand = STRAND_OPTIONS.find((option) => option.value === strandType) || STRAND_OPTIONS[0];

  async function processSequence() {
    setLoading(true);
    const result = await runFullProcess(dnaSequence, strandType);
    setApiSource(result.source || 'backend');
    setSequenceResult(result.dna || dnaSequence.toUpperCase().replace(/\s+/g, ''), strandType, normalizeBackendResult(result));
    setLoading(false);
  }

  function usePreset(value) {
    setDnaSequence(value);
  }

  return (
    <motion.section id="sequence" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-4">
      <label htmlFor="dna-input" className="text-sm font-semibold text-white">DNA sequence</label>
      <textarea
        id="dna-input"
        value={dnaSequence}
        onChange={(event) => setDnaSequence(event.target.value)}
        rows={4}
        className="mt-2 w-full resize-y rounded-md border border-line bg-ink/70 p-3 text-base text-slate-100 placeholder:text-slate-500"
        placeholder="Example: ATG GAA TTT TAA"
      />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="text-sm text-slate-300">
          Input is treated as
          <Listbox value={selectedStrand} onChange={(option) => setStrandType(option.value)}>
            <div className="relative mt-1">
              <ListboxButton className="control flex w-full items-center justify-between gap-3 px-3 text-left" aria-label="Choose whether the DNA input is the coding strand or template strand">
                <span>{selectedStrand.label}</span>
                <ChevronsUpDown size={16} aria-hidden="true" />
              </ListboxButton>
              <ListboxOptions anchor="bottom" className="z-40 mt-1 w-[var(--button-width)] rounded-md border border-line bg-panel p-1 text-sm text-slate-100 shadow-2xl focus:outline-none">
                {STRAND_OPTIONS.map((option) => (
                  <ListboxOption key={option.value} value={option} className="cursor-pointer rounded px-3 py-2 data-[focus]:bg-panel2">
                    {({ selected }) => (
                      <span className="flex items-center justify-between gap-3">
                        <span>{option.label}</span>
                        {selected && <Check size={15} aria-hidden="true" />}
                      </span>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        </div>
        <div className="text-sm text-slate-300">
          Presets
          <Listbox value={null} onChange={(preset) => usePreset(preset.value)}>
            <div className="relative mt-1">
              <ListboxButton className="control flex w-full items-center justify-between gap-3 px-3 text-left" aria-label="Choose a preset DNA sequence">
                <span>Choose a classroom sequence</span>
                <ChevronsUpDown size={16} aria-hidden="true" />
              </ListboxButton>
              <ListboxOptions anchor="bottom" className="z-40 mt-1 w-[var(--button-width)] rounded-md border border-line bg-panel p-1 text-sm text-slate-100 shadow-2xl focus:outline-none">
                {PRESETS.map((preset) => (
                  <ListboxOption key={preset.label} value={preset} className="cursor-pointer rounded px-3 py-2 data-[focus]:bg-panel2">
                    {preset.label}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        </div>
      </div>
      <p className="mt-3 rounded-md border border-line bg-panel2 p-3 text-sm text-slate-300">
        Coding strand input is treated as the non-template strand, so mRNA matches it except U replaces T. Template strand input is read complementarily by RNA polymerase.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <button type="button" className="touch-target inline-flex items-center justify-center gap-2 rounded-md bg-cyanBio px-3 font-semibold text-ink transition hover:bg-cyan-200 active:scale-[0.98]" onClick={processSequence} disabled={loading}>
          <FlaskConical size={17} aria-hidden="true" />
          {loading ? 'Processing' : 'Validate'}
        </button>
        <button type="button" className="control inline-flex items-center justify-center gap-2 px-3 transition active:scale-[0.98]" onClick={() => { randomizeSequence(); setApiSource('local'); }}>
          <Dices size={17} aria-hidden="true" />
          Random
        </button>
        <button type="button" className="control inline-flex items-center justify-center gap-2 px-3 transition active:scale-[0.98]" onClick={clearSequence}>
          <Eraser size={17} aria-hidden="true" />
          Clear
        </button>
        <button type="button" className="control inline-flex items-center justify-center gap-2 px-3 transition active:scale-[0.98]" onClick={() => setStep(2)}>
          <Wand2 size={17} aria-hidden="true" />
          Animate
        </button>
      </div>
      <p className="mt-3 text-xs text-slate-400">Sequence logic source: {apiSource === 'backend' ? 'FastAPI backend' : 'local fallback'}</p>
    </motion.section>
  );
}

const STRAND_OPTIONS = [
  { label: 'Coding strand', value: 'coding' },
  { label: 'Template strand', value: 'template' }
];

function normalizeBackendResult(result) {
  if (result.protein) return result;
  return fullProcess(result.dna || result.sequence || '', result.strand_type || 'coding');
}
