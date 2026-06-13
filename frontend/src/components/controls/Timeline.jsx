import { motion } from 'framer-motion';
import { TIMELINE_STEPS } from '../../data/lessonText';
import { useSimulationStore } from '../../store/simulationStore';

export default function Timeline() {
  const { currentStep, setStep } = useSimulationStore();
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="glass rounded-lg p-4"
      aria-label="Clickable animation timeline"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Animation Timeline</h2>
        <p className="text-sm text-slate-300">Click any stage to update the 3D model and explanation.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {TIMELINE_STEPS.map((step, index) => (
          <motion.button
            key={step.id}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * index }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => setStep(step.id)}
            className={`min-h-[58px] rounded-md border px-3 py-2 text-left text-sm transition ${
              currentStep === step.id
                ? 'border-cyanBio bg-cyanBio/14 text-white shadow-glow'
                : 'border-line bg-panel2/70 text-slate-300 hover:border-cyanBio/50 hover:text-white'
            }`}
            aria-current={currentStep === step.id ? 'step' : undefined}
          >
            <span className="block text-xs text-slate-400">{String(step.id + 1).padStart(2, '0')}</span>
            <span className="block font-medium">{step.title}</span>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
