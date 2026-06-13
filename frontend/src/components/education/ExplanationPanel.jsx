import { LESSON_TEXT, TIMELINE_STEPS } from '../../data/lessonText';
import { useSimulationStore } from '../../store/simulationStore';

export default function ExplanationPanel() {
  const { currentStep, selectedStructure, cellType } = useSimulationStore();
  const step = TIMELINE_STEPS[currentStep];
  const text = LESSON_TEXT[step.phase] || LESSON_TEXT.storage;

  return (
    <section className="glass rounded-lg p-4" aria-label="Biology explanation">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-amberBio">{cellType}</p>
          <h2 className="mt-1 text-lg font-semibold text-white">{step.title}</h2>
        </div>
        <span className="rounded-md border border-line bg-panel2 px-2 py-1 text-xs text-slate-300">
          Selected: {selectedStructure}
        </span>
      </div>
      <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
        <InfoBlock title="Quick explanation" body={text.quick} />
        <InfoBlock title="AP Biology explanation" body={text.ap} />
        {text.enzymes?.length > 0 && <EnzymeBlock enzymes={text.enzymes} />}
        {text.teacher && <InfoBlock title="Teacher note" body={text.teacher} tone="amber" />}
      </div>
    </section>
  );
}

function EnzymeBlock({ enzymes }) {
  return (
    <div className="rounded-md border-l-2 border-greenBio/55 bg-ink/35 px-3 py-2">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Relevant enzymes and molecular machines</h3>
      <ul className="mt-2 space-y-2">
        {enzymes.map((enzyme) => (
          <li key={enzyme.name}>
            <span className="font-semibold text-green-100">{enzyme.name}: </span>
            <span>{enzyme.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoBlock({ title, body, tone = 'cyan' }) {
  const color = tone === 'rose' ? 'border-roseBio/50' : tone === 'amber' ? 'border-amberBio/50' : 'border-cyanBio/45';
  return (
    <div className={`rounded-md border-l-2 ${color} bg-ink/35 px-3 py-2`}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{title}</h3>
      <p className="mt-1">{body}</p>
    </div>
  );
}
