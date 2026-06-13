import { useEffect } from 'react';
import { TIMELINE_STEPS } from '../data/lessonText';
import { useSimulationStore } from '../store/simulationStore';

export default function useSimulationPlayback() {
  const { currentStep, playing, speed, reducedMotion, setStep, setPlaying } = useSimulationStore();

  useEffect(() => {
    if (!playing || reducedMotion) return undefined;
    const timer = window.setTimeout(() => {
      const next = currentStep + 1;
      if (next >= TIMELINE_STEPS.length) {
        setPlaying(false);
      } else {
        setStep(next);
      }
    }, Math.max(900, 2600 / speed));
    return () => window.clearTimeout(timer);
  }, [currentStep, playing, speed, reducedMotion, setStep, setPlaying]);
}
