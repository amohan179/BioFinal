import { ExternalLink } from 'lucide-react';
import { SOURCES } from '../../data/sources';

export default function Sources() {
  return (
    <section id="sources" className="glass rounded-lg p-4">
      <h2 className="text-lg font-semibold text-white">Sources / References</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        These sources support the biology explanations, codon table, and molecular-coordinate context. The animated process model is a schematic teaching model, not a literal molecular dynamics simulation.
      </p>
      <ul className="mt-3 space-y-3 text-sm">
        {SOURCES.map((source) => (
          <li key={source.url} className="rounded-md border border-line bg-panel2/70 p-3">
            <a className="inline-flex items-center gap-2 font-medium text-cyanBio hover:text-cyan-200" href={source.url} target="_blank" rel="noopener noreferrer">
              {source.title}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
            <p className="mt-1 text-slate-300">{source.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
