import { useState } from 'react';
import { Activity, ArrowLeft, Atom, Dna, FlaskConical, Microscope, Network } from 'lucide-react';
import SimulationScene from './components/simulation/SimulationScene';
import ControlPanel from './components/controls/ControlPanel';
import Timeline from './components/controls/Timeline';
import ExplanationPanel from './components/education/ExplanationPanel';
import MolecularInspector from './components/molecular/MolecularInspector';
import { TIMELINE_STEPS } from './data/lessonText';
import { useSimulationStore } from './store/simulationStore';
import useSimulationPlayback from './hooks/useSimulationPlayback';

const STRUCTURE_GUIDE = [
  ['DNA', 'Double-stranded genetic template; local regions open during transcription.'],
  ['RNA', 'Single-stranded transcript; mature eukaryotic mRNA includes a cap and poly-A tail.'],
  ['Ribosome', 'Large and small rRNA-protein subunits with A, P, and E tRNA-binding sites.'],
  ['tRNA', 'Adaptor molecule carrying an amino acid and a codon-matching anticodon.'],
  ['Polypeptide', 'Amino-acid chain linked by peptide bonds before final folding.']
];

export default function ModelApp() {
  const { currentStep, cellType } = useSimulationStore();
  const step = TIMELINE_STEPS[currentStep];
  const [viewMode, setViewMode] = useState('atomic');
  useSimulationPlayback();

  return (
    <div className="min-h-screen bg-[#0d120f] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-[#d8cfbd]/15 bg-[#101611]/95 backdrop-blur-xl">
        <div className="flex min-h-[64px] flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <a href="/" className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[#d8cfbd]/25 bg-[#d8cfbd]/8 text-[#d8cfbd] transition hover:border-[#d8cfbd]/55" aria-label="Return to Central Dogma Lab">
              <ArrowLeft size={19} aria-hidden="true" />
            </a>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[#9ec9b2]/30 bg-[#9ec9b2]/10 text-[#b7dbc4]">
              <Microscope size={21} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs uppercase tracking-[0.18em] text-[#b7dbc4]">Central Dogma Lab</p>
              <h1 className="truncate text-base font-semibold text-[#f2eadb] sm:text-lg">Biological Model Workspace</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-2 rounded-md border border-[#d8cfbd]/20 bg-[#d8cfbd]/8 px-3 py-2 text-[#d8cfbd]">
              <FlaskConical size={15} aria-hidden="true" />
              {cellType}
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-[#9ec9b2]/25 bg-[#9ec9b2]/10 px-3 py-2 text-[#d8efe0]">
              <Activity size={15} aria-hidden="true" />
              {String(currentStep + 1).padStart(2, '0')} / {TIMELINE_STEPS.length} · {step.title}
            </span>
          </div>
        </div>
      </header>

      <main className="grid items-start gap-4 p-4 sm:p-6">
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#d8cfbd]/18 bg-[#151c17]/92 p-3 shadow-[0_18px_44px_rgba(0,0,0,0.2)]" aria-label="Model view selector">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#b7dbc4]">Visualization mode</p>
            <p className="mt-1 text-sm text-[#c9c4b7]">Compare a real coordinate structure with the process-level classroom model.</p>
          </div>
          <div className="grid grid-cols-2 gap-1 rounded-md border border-[#d8cfbd]/16 bg-[#101612] p-1">
            <ViewModeButton active={viewMode === 'atomic'} onClick={() => setViewMode('atomic')} icon={Atom} label="Atomic structure" />
            <ViewModeButton active={viewMode === 'process'} onClick={() => setViewMode('process')} icon={Network} label="Cell process" />
          </div>
        </section>

        {viewMode === 'atomic' ? (
          <MolecularInspector primary />
        ) : (
          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="min-w-0 overflow-hidden rounded-md border border-[#d8cfbd]/18 bg-[#111713] shadow-[0_22px_70px_rgba(0,0,0,0.4)]">
              <SimulationScene immersive />
            </div>
            <aside className="grid gap-4 xl:max-h-[calc(100vh-88px)] xl:overflow-y-auto xl:pr-1">
              <ControlPanel />
              <StructureGuide />
              <ExplanationPanel />
            </aside>
            <div className="xl:col-span-2">
              <Timeline />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ViewModeButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded px-3 text-sm font-medium transition ${active ? 'bg-[#9ec9b2]/18 text-[#d8efe0]' : 'text-[#c9c4b7] hover:bg-[#d8cfbd]/8 hover:text-[#f2eadb]'}`}
      aria-pressed={active}
    >
      <Icon size={16} aria-hidden="true" />
      {label}
    </button>
  );
}

function StructureGuide() {
  return (
    <section className="rounded-lg border border-[#d8cfbd]/18 bg-[#151c17]/92 p-4 shadow-[0_18px_44px_rgba(0,0,0,0.24)]" aria-label="Biological structure guide">
      <div className="flex items-center gap-2 text-[#f2eadb]">
        <Dna size={18} aria-hidden="true" />
        <h2 className="text-base font-semibold">Structure Guide</h2>
      </div>
      <dl className="mt-3 grid gap-3 text-sm leading-5 text-[#c9c4b7]">
        {STRUCTURE_GUIDE.map(([term, description]) => (
          <div key={term} className="border-l-2 border-[#9ec9b2]/45 pl-3">
            <dt className="font-semibold text-[#d8efe0]">{term}</dt>
            <dd>{description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
