import { Radio, RadioGroup, Switch } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';
import { TIMELINE_STEPS } from '../../data/lessonText';

export default function ControlPanel() {
  const {
    currentStep, cellType, setCellType, playing, setPlaying, setStep, speed, setSpeed, labelsVisible, toggleLabels,
    baseLabelsVisible, toggleBaseLabels, backboneVisible, toggleBackbone, geneHighlighted,
    toggleGene, processingMode, setProcessingMode, nextStep, previousStep, resetSimulation
  } = useSimulationStore();

  function togglePlayback() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (currentStep >= TIMELINE_STEPS.length - 1) setStep(0);
    setPlaying(true);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-lg p-4"
      aria-label="Simulation controls"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Simulation Controls</h2>
        <button type="button" className="control touch-target px-3 transition active:scale-[0.98]" onClick={resetSimulation} aria-label="Reset simulation">
          <RotateCcw size={18} aria-hidden="true" />
        </button>
      </div>

      <RadioGroup value={cellType} onChange={setCellType} className="mt-4 grid grid-cols-2 gap-2" aria-label="Cell type">
        <Radio value="eukaryote" className="headless-option">Eukaryote</Radio>
        <Radio value="prokaryote" className="headless-option">Prokaryote</Radio>
      </RadioGroup>

      <div className="mt-4 flex gap-2">
        <button type="button" className="control touch-target flex-1 px-3 transition active:scale-[0.98]" onClick={previousStep} aria-label="Previous step">
          <SkipBack size={18} aria-hidden="true" />
        </button>
        <button type="button" className="touch-target inline-flex flex-[2] items-center justify-center gap-2 rounded-md bg-cyanBio px-3 font-semibold text-ink transition hover:bg-cyan-200 active:scale-[0.98]" onClick={togglePlayback}>
          {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          {playing ? 'Pause' : 'Play'}
        </button>
        <button type="button" className="control touch-target flex-1 px-3 transition active:scale-[0.98]" onClick={nextStep} aria-label="Next step">
          <SkipForward size={18} aria-hidden="true" />
        </button>
      </div>

      <label className="mt-4 block text-sm text-slate-300" htmlFor="speed-slider">
        Animation speed: {speed.toFixed(1)}x
      </label>
      <input
        id="speed-slider"
        type="range"
        min="0.5"
        max="3"
        step="0.5"
        value={speed}
        onChange={(event) => setSpeed(event.target.value)}
        className="mt-2 w-full accent-cyanBio"
      />

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Toggle active={labelsVisible} onClick={toggleLabels} label="Scene labels" />
        <Toggle active={baseLabelsVisible} onClick={toggleBaseLabels} label="Base labels" />
        <Toggle active={backboneVisible} onClick={toggleBackbone} label="Backbone" />
        <Toggle active={geneHighlighted} onClick={toggleGene} label="Gene highlight" />
      </div>

      <RadioGroup value={processingMode} onChange={setProcessingMode} className="mt-4 grid grid-cols-2 gap-2" aria-label="Processing mode">
        <Radio value="simple" className="headless-option data-[checked]:border-amberBio data-[checked]:bg-amberBio/15">Simple processing</Radio>
        <Radio value="advanced" className="headless-option data-[checked]:border-amberBio data-[checked]:bg-amberBio/15">Advanced processing</Radio>
      </RadioGroup>
    </motion.section>
  );
}

function Toggle({ active, onClick, label }) {
  return (
    <Switch checked={active} onChange={onClick} className="control inline-flex items-center justify-center gap-2 px-3 transition data-[checked]:border-greenBio/70 data-[checked]:bg-greenBio/10 active:scale-[0.98]">
      {active ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}
      {label}
    </Switch>
  );
}
