import { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Activity, Atom, BookOpen, Dna, ExternalLink, GraduationCap, Network, Table2 } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SimulationScene from './components/simulation/SimulationScene';
import MolecularInspector from './components/molecular/MolecularInspector';
import ControlPanel from './components/controls/ControlPanel';
import Timeline from './components/controls/Timeline';
import ExplanationPanel from './components/education/ExplanationPanel';
import VocabularyPanel from './components/education/VocabularyPanel';
import Sources from './components/education/Sources';
import SequenceInput from './components/sequence/SequenceInput';
import CodonTable from './components/sequence/CodonTable';
import TranslationResults from './components/sequence/TranslationResults';
import Quiz from './components/quiz/Quiz';
import { useSimulationStore } from './store/simulationStore';
import { TIMELINE_STEPS } from './data/lessonText';
import useSimulationPlayback from './hooks/useSimulationPlayback';

export default function App() {
  const { currentStep } = useSimulationStore();
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState(0);
  const [simulationView, setSimulationView] = useState('atomic');
  useSimulationPlayback();

  function navigateWorkspace(index) {
    setActiveWorkspaceTab(index);
    window.requestAnimationFrame(() => {
      document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  return (
    <div id="top" className="min-h-screen text-slate-100">
      <Navbar onNavigate={navigateWorkspace} />
      <main>
        <section className="px-4 pb-6 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1500px] gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-lg p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyanBio">Interactive AP Biology Simulation</p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-normal text-white sm:text-3xl">
                    Protein Synthesis and the Central Dogma
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a href="/model.html" className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#d8cfbd]/30 bg-[#d8cfbd]/10 px-3 py-2 text-sm font-medium text-[#f2eadb] transition hover:border-[#d8cfbd]/60 hover:bg-[#d8cfbd]/15">
                    <ExternalLink size={16} aria-hidden="true" />
                    Open large model
                  </a>
                  <div className="flex items-center gap-2 rounded-md border border-cyanBio/30 bg-cyanBio/10 px-3 py-2 text-sm text-cyan-100">
                    <Activity size={18} aria-hidden="true" />
                    Step {currentStep + 1} of {TIMELINE_STEPS.length}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-4">
                <p className="text-sm text-slate-300">
                  Inspect real molecular coordinate files or switch to a simplified classroom process model. Scale, timing, color, and motion are schematic.
                </p>
                <div className="grid grid-cols-2 gap-1 rounded-md border border-line bg-ink/70 p-1">
                  <SimulationViewButton active={simulationView === 'atomic'} onClick={() => setSimulationView('atomic')} icon={Atom} label="Atomic sticks" />
                  <SimulationViewButton active={simulationView === 'process'} onClick={() => setSimulationView('process')} icon={Network} label="Cell process" />
                </div>
              </div>
            </motion.div>

            {simulationView === 'atomic' ? (
              <MolecularInspector primary />
            ) : (
              <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.35fr)_440px]">
                <div className="grid gap-4">
                  <div className="glass overflow-hidden rounded-lg">
                    <SimulationScene />
                  </div>
                  <Timeline />
                </div>
                <aside className="grid gap-4">
                  <ControlPanel />
                  <ExplanationPanel />
                </aside>
              </div>
            )}
          </div>
        </section>

        <section id="workspace" className="px-4 pb-10 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="mx-auto max-w-[1500px]"
          >
            <TabGroup selectedIndex={activeWorkspaceTab} onChange={setActiveWorkspaceTab}>
              <div className="glass rounded-lg p-2">
                <TabList className="grid gap-2 md:grid-cols-4">
                  <LabTab icon={Dna} title="DNA Input Lab" subtitle="Validate, transcribe, translate, and animate classroom sequences." />
                  <LabTab icon={Table2} title="Complete RNA Codon Table" subtitle="All 64 codons with start, stop, and current-sequence highlighting." />
                  <LabTab icon={GraduationCap} title="Quiz Mode" subtitle="Immediate feedback for AP Biology vocabulary and reasoning." />
                  <LabTab icon={BookOpen} title="Teacher Panels" subtitle="Vocabulary, model notes, comparison, and references." />
                </TabList>
              </div>

              <TabPanels className="mt-4">
                <LabPanel>
                  <div className="grid gap-4">
                    <SectionHeader icon={Dna} title="DNA Input Lab" subtitle="Validate, transcribe, translate, and animate classroom sequences." />
                    <SequenceInput />
                    <TranslationResults />
                  </div>
                </LabPanel>
                <LabPanel>
                  <div className="grid gap-4">
                    <SectionHeader icon={Table2} title="Complete RNA Codon Table" subtitle="All 64 codons with start, stop, and current-sequence highlighting." />
                    <CodonTable />
                  </div>
                </LabPanel>
                <LabPanel>
                  <div className="grid gap-4">
                    <SectionHeader icon={GraduationCap} title="Quiz Mode" subtitle="Immediate feedback for AP Biology vocabulary and reasoning." />
                    <Quiz />
                  </div>
                </LabPanel>
                <LabPanel>
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
                    <div className="grid gap-4">
                      <SectionHeader icon={BookOpen} title="Teacher Panels" subtitle="Vocabulary, model notes, comparison, and references." />
                      <VocabularyPanel />
                    </div>
                    <Sources />
                  </div>
                </LabPanel>
              </TabPanels>
            </TabGroup>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function SimulationViewButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded px-3 text-sm font-medium transition ${active ? 'bg-cyanBio/15 text-cyan-100' : 'text-slate-300 hover:bg-panel2 hover:text-white'}`}
      aria-pressed={active}
    >
      <Icon size={16} aria-hidden="true" />
      {label}
    </button>
  );
}

function LabTab({ icon: Icon, title, subtitle }) {
  return (
    <Tab className="group rounded-md border border-line bg-panel/80 p-3 text-left transition hover:border-cyanBio/50 hover:bg-panel2 data-[selected]:border-cyanBio data-[selected]:bg-cyanBio/12 data-[selected]:shadow-glow">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-line bg-ink/70 text-slate-300 transition group-data-[selected]:border-cyanBio/50 group-data-[selected]:bg-cyanBio/10 group-data-[selected]:text-cyanBio">
          <Icon size={20} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-white">{title}</span>
          <span className="mt-1 block text-xs leading-5 text-slate-400">{subtitle}</span>
        </span>
      </div>
    </Tab>
  );
}

function LabPanel({ children }) {
  return (
    <TabPanel
      as={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="outline-none"
    >
      {children}
    </TabPanel>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-md border border-cyanBio/30 bg-cyanBio/10 p-2 text-cyanBio">
        <Icon size={20} aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-slate-300">{subtitle}</p>
      </div>
    </div>
  );
}
