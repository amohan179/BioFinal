import { create } from 'zustand';
import { TIMELINE_STEPS } from '../data/lessonText';
import { fullProcess, generateRandomGene } from '../utils/sequenceUtils';

const initialSequence = 'ATGGAATTTTAA';
const initialResult = fullProcess(initialSequence, 'coding');
const prefersReducedMotion = typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const useSimulationStore = create((set, get) => ({
  currentStep: 0,
  cellType: 'eukaryote',
  playing: false,
  speed: 1,
  labelsVisible: true,
  baseLabelsVisible: true,
  backboneVisible: true,
  geneHighlighted: true,
  reducedMotion: Boolean(prefersReducedMotion),
  processingMode: 'advanced',
  selectedStructure: 'DNA',
  selectedFocusVersion: 0,
  dnaSequence: initialSequence,
  strandType: 'coding',
  sequenceResult: initialResult,
  quizScore: 0,
  quizIndex: 0,
  quizCompleted: false,
  setStep: (currentStep) => set({ currentStep: Math.max(0, Math.min(TIMELINE_STEPS.length - 1, currentStep)) }),
  nextStep: () => get().setStep(get().currentStep + 1),
  previousStep: () => get().setStep(get().currentStep - 1),
  setCellType: (cellType) => set({ cellType }),
  setPlaying: (playing) => set({ playing }),
  setSpeed: (speed) => set({ speed: Number(speed) }),
  toggleLabels: () => set((state) => ({ labelsVisible: !state.labelsVisible })),
  toggleBaseLabels: () => set((state) => ({ baseLabelsVisible: !state.baseLabelsVisible })),
  toggleBackbone: () => set((state) => ({ backboneVisible: !state.backboneVisible })),
  toggleGene: () => set((state) => ({ geneHighlighted: !state.geneHighlighted })),
  setProcessingMode: (processingMode) => set({ processingMode }),
  setSelectedStructure: (selectedStructure) => set((state) => ({
    selectedStructure,
    labelsVisible: true,
    baseLabelsVisible: true,
    selectedFocusVersion: state.selectedFocusVersion + 1
  })),
  setStrandType: (strandType) => {
    const dnaSequence = get().dnaSequence;
    set({ strandType, sequenceResult: fullProcess(dnaSequence, strandType) });
  },
  setSequenceResult: (dnaSequence, strandType, sequenceResult) => set({ dnaSequence, strandType, sequenceResult }),
  setDnaSequence: (dnaSequence) => {
    const strandType = get().strandType;
    set({ dnaSequence, sequenceResult: fullProcess(dnaSequence, strandType) });
  },
  randomizeSequence: () => {
    const dnaSequence = generateRandomGene();
    const strandType = 'coding';
    set({ dnaSequence, strandType, sequenceResult: fullProcess(dnaSequence, strandType) });
  },
  clearSequence: () => set({ dnaSequence: '', sequenceResult: fullProcess('', get().strandType) }),
  resetSimulation: () => set({ currentStep: 0, playing: false, selectedStructure: 'DNA', selectedFocusVersion: 0 }),
  resetQuiz: () => set({ quizScore: 0, quizIndex: 0, quizCompleted: false }),
  advanceQuiz: (correct, total) => set((state) => {
    const nextIndex = state.quizIndex + 1;
    return {
      quizScore: state.quizScore + (correct ? 1 : 0),
      quizIndex: nextIndex,
      quizCompleted: nextIndex >= total
    };
  })
}));
