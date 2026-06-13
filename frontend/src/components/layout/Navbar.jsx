import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dna, Menu, Pause, Play, X } from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';

const NAV_ITEMS = [
  ['Sequence', 0],
  ['Codon Table', 1],
  ['Quiz', 2],
  ['Teacher Panels', 3]
];

export default function Navbar({ onNavigate }) {
  const { playing, setPlaying } = useSimulationStore();
  return (
    <Disclosure as="header" className="sticky top-0 z-30 border-b border-line/80 bg-ink/90 backdrop-blur-xl">
      {({ open }) => (
        <>
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <a href="#top" className="flex min-w-0 items-center gap-3 text-white" aria-label="Central Dogma Lab home">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-cyanBio/30 bg-cyanBio/10 text-cyanBio shadow-glow">
                <Dna size={22} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-base font-semibold">Central Dogma Lab</span>
                <span className="hidden text-xs text-slate-300 sm:block">DNA to RNA to protein</span>
              </span>
            </a>
            <nav className="hidden items-center gap-1 rounded-md border border-line/70 bg-panel/70 p-1 text-sm text-slate-300 md:flex" aria-label="Page sections">
              {NAV_ITEMS.map(([label, index]) => (
                <button key={label} type="button" onClick={() => onNavigate(index)} className="rounded px-3 py-2 transition hover:bg-panel2 hover:text-white">{label}</button>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="touch-target inline-flex items-center gap-2 rounded-md bg-cyanBio px-3 text-sm font-semibold text-ink transition hover:bg-cyan-200"
                onClick={() => setPlaying(!playing)}
                aria-label={playing ? 'Pause simulation' : 'Play simulation'}
              >
                {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
                <span className="hidden sm:inline">{playing ? 'Pause' : 'Play'}</span>
              </button>
              <DisclosureButton className="control touch-target grid place-items-center px-3 md:hidden" aria-label="Toggle navigation">
                {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
              </DisclosureButton>
            </div>
          </div>
          <AnimatePresence>
            {open && (
              <DisclosurePanel
                static
                as={motion.nav}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-line/70 bg-panel/90 px-4 py-2 text-sm text-slate-300 md:hidden"
                aria-label="Page sections"
              >
                {NAV_ITEMS.map(([label, index]) => (
                  <button key={label} type="button" onClick={() => onNavigate(index)} className="block w-full rounded-md px-3 py-2 text-left hover:bg-panel2 hover:text-white">{label}</button>
                ))}
              </DisclosurePanel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}
