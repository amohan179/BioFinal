import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';

export default function TranslationResults() {
  const { sequenceResult } = useSimulationStore();
  const protein = sequenceResult.protein || [];
  const warnings = sequenceResult.warnings || [];
  return (
    <section className="glass rounded-lg p-4">
      <h2 className="text-lg font-semibold text-white">Transcription and Translation Results</h2>
      <ResultRow label="Clean DNA" value={group(sequenceResult.dna || '')} />
      <ResultRow label="mRNA" value={group(sequenceResult.mrna || '')} />
      <ResultRow label="Codons" value={(sequenceResult.codons || []).join('  ')} />
      <div className="mt-3">
        <p className="text-sm font-semibold text-slate-200">Protein chain</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          Classroom translation starts at the first AUG in this reading frame and stops at the first stop codon.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {protein.length ? protein.map((item, index) => (
            <span key={`${item.codon}-${index}`} className={`rounded-md border px-2 py-1 text-sm ${item.stop ? 'border-roseBio/60 bg-roseBio/10 text-rose-100' : item.start ? 'border-greenBio/60 bg-greenBio/10 text-green-100' : 'border-line bg-panel2 text-slate-200'}`}>
              {item.codon}: {item.aminoAcid}
            </span>
          )) : <span className="text-sm text-slate-400">No translated amino acids yet.</span>}
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {warnings.length ? warnings.map((warning) => (
          <p key={warning} className="flex gap-2 rounded-md border border-amberBio/40 bg-amberBio/10 p-2 text-sm text-amber-100">
            <AlertTriangle size={17} aria-hidden="true" /> {warning}
          </p>
        )) : (
          <p className="flex gap-2 rounded-md border border-greenBio/40 bg-greenBio/10 p-2 text-sm text-green-100">
            <CheckCircle2 size={17} aria-hidden="true" /> The sequence is valid, has complete codons, and contains a translated open reading frame.
          </p>
        )}
      </div>
    </section>
  );
}

function ResultRow({ label, value }) {
  return (
    <div className="mt-3 rounded-md border border-line bg-panel2 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-1 break-words font-mono text-sm text-slate-100">{value || 'None'}</p>
    </div>
  );
}

function group(sequence) {
  return sequence.replace(/(.{3})/g, '$1 ').trim();
}
