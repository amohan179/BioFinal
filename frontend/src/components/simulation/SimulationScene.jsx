import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Html, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import * as THREE from 'three';
import EukaryoticCell from './EukaryoticCell';
import ProkaryoticCell from './ProkaryoticCell';
import Labels from './Labels';
import { LESSON_TEXT, TIMELINE_STEPS } from '../../data/lessonText';
import { useSimulationStore } from '../../store/simulationStore';

const DEFAULT_CAMERA_POSITION = [0, 4.9, 12.5];
const EUKARYOTE_PROCESS_YAW = -5.625;
const PROKARYOTE_PROCESS_YAW = -5.625;
const LOCKED_PROCESS_FRAME_STEPS = {
  prokaryote: new Set([1, 2, 3, 4])
};
const CAMERA_FRAMES = {
  eukaryote: [
    { target: [-2.35, 0.55, 0], frameHeight: 4.4, shift: [-0.05, 0.18, 0] },
    { target: [-2.08, -0.02, 0.28], frameHeight: 4.08, frameWidth: 8.35, shift: [0.02, -0.05, 0], view: 'flat', lift: 0.02, yaw: EUKARYOTE_PROCESS_YAW },
    { target: [-2.08, -0.02, 0.28], frameHeight: 4.08, frameWidth: 8.35, shift: [0.02, -0.05, 0], view: 'flat', lift: 0.02, yaw: EUKARYOTE_PROCESS_YAW },
    { target: [-2.08, -0.02, 0.28], frameHeight: 4.08, frameWidth: 8.35, shift: [0.02, -0.05, 0], view: 'flat', lift: 0.02, yaw: EUKARYOTE_PROCESS_YAW },
    { target: [-2.08, -0.02, 0.28], frameHeight: 4.08, frameWidth: 8.35, shift: [0.02, -0.05, 0], view: 'flat', lift: 0.02, yaw: EUKARYOTE_PROCESS_YAW },
    { target: [-2.0, 0.04, 0.35], frameHeight: 4.2, frameWidth: 7.65, shift: [0.12, -0.08, 0], view: 'flat' },
    { target: [-2.35, -1.35, 0.16], frameHeight: 3.0, frameWidth: 5.4, shift: [0.18, -0.02, 0] },
    { target: [0.0, -1.28, 0.1], frameHeight: 3.75, frameWidth: 7.0, shift: [0.45, 0, 0] },
    { target: [3.65, -0.58, 0.05], frameHeight: 4.1, frameWidth: 6.4, shift: [0.08, 0.08, 0] },
    { target: [3.65, 0.08, 0.08], frameHeight: 3.65, frameWidth: 5.8, shift: [0.05, 0.12, 0] },
    { target: [3.7, 0.95, 0.06], frameHeight: 3.55, frameWidth: 5.6, shift: [0.06, 0.16, 0] },
    { target: [4.02, 1.35, 0.08], frameHeight: 3.55, frameWidth: 5.6, shift: [0.06, 0.12, 0] },
    { target: [4.3, 0.48, 0.08], frameHeight: 3.45, frameWidth: 5.4, shift: [0.08, 0, 0] },
    { target: [4.45, 0.55, 0.08], frameHeight: 3.3, frameWidth: 5.2, shift: [0.08, 0.02, 0] },
    { target: [4.35, 1.45, 0.1], frameHeight: 3.55, frameWidth: 5.5, shift: [0.06, 0.08, 0] }
  ],
  prokaryote: [
    { target: [-2.35, 0.28, 0], frameHeight: 3.8, shift: [-0.08, 0.12, 0] },
    { target: [-2.35, 0.28, 0.35], frameHeight: 2.85, frameWidth: 5.8, shift: [0, 0, 0], view: 'flat', lift: 0.02, yaw: PROKARYOTE_PROCESS_YAW },
    { target: [-2.35, 0.28, 0.35], frameHeight: 2.72, frameWidth: 5.8, shift: [0, 0, 0], view: 'flat', lift: 0.02, yaw: PROKARYOTE_PROCESS_YAW },
    { target: [-2.18, 0.16, 0.35], frameHeight: 2.62, frameWidth: 5.8, shift: [0.18, -0.02, 0], view: 'flat', lift: 0.02, yaw: PROKARYOTE_PROCESS_YAW },
    { target: [-1.98, 0.05, 0.35], frameHeight: 2.62, frameWidth: 5.8, shift: [0.28, -0.04, 0], view: 'flat', lift: 0.02, yaw: PROKARYOTE_PROCESS_YAW },
    { target: [-1.78, -0.08, 0.35], frameHeight: 2.85, frameWidth: 6.0, shift: [0.36, -0.08, 0], view: 'flat' },
    { target: [0.35, -0.12, 0.08], frameHeight: 3.2, frameWidth: 5.8, shift: [0.2, -0.04, 0] },
    { target: [0.85, 0.02, 0.08], frameHeight: 3.25, frameWidth: 5.8, shift: [0.24, 0, 0] },
    { target: [1.72, 0.62, 0.08], frameHeight: 3.1, frameWidth: 5.2, shift: [0.08, 0.1, 0] },
    { target: [1.75, 0.84, 0.08], frameHeight: 2.95, frameWidth: 4.9, shift: [0.06, 0.14, 0] },
    { target: [1.95, 1.38, 0.08], frameHeight: 3.05, frameWidth: 5.0, shift: [0.1, 0.14, 0] },
    { target: [2.55, 1.1, 0.08], frameHeight: 3.05, frameWidth: 5.0, shift: [0.12, 0.08, 0] },
    { target: [2.9, 0.7, 0.08], frameHeight: 2.95, frameWidth: 4.9, shift: [0.12, 0, 0] },
    { target: [3.3, 0.3, 0.08], frameHeight: 2.9, frameWidth: 4.8, shift: [0.12, -0.02, 0] },
    { target: [3.05, 1.25, 0.1], frameHeight: 3.15, frameWidth: 5.0, shift: [0.08, 0.14, 0] }
  ]
};

const SELECTION_CAMERA_FRAMES = {
  eukaryote: {
    'DNA double helix': { target: [-2.35, 0.55, 0.25], frameHeight: 2.75, frameWidth: 5.0, shift: [0, 0, 0], view: 'flat', yaw: EUKARYOTE_PROCESS_YAW, lift: 0.02 },
    'Flat DNA transcription diagram': { target: [-2.35, 0.55, 0.25], frameHeight: 2.75, frameWidth: 5.25, shift: [0, 0, 0], view: 'flat', yaw: EUKARYOTE_PROCESS_YAW, lift: 0.02 },
    'mRNA processing': { target: [-2.15, -1.72, 0.2], frameHeight: 1.95, frameWidth: 3.75, shift: [0.06, 0.05, 0], view: 'flat', yaw: 0, lift: 0.02 },
    'Mature mRNA': { target: [-0.05, -1.38, 0.15], frameHeight: 1.75, frameWidth: 3.35, shift: [0, 0.04, 0], view: 'flat', yaw: 0, lift: 0.02 },
    'Growing RNA strand': { target: [-2.0, -0.45, 0.16], frameHeight: 1.8, frameWidth: 3.6, shift: [0, 0, 0], view: 'flat', yaw: EUKARYOTE_PROCESS_YAW, lift: 0.02 },
    Ribosome: { target: [3.75, -0.12, 0.08], frameHeight: 2.35, frameWidth: 4.0, shift: [0.08, 0.08, 0], view: 'flat', yaw: 0.08, lift: 0.02 },
    tRNA: { target: [3.75, 1.08, 0.02], frameHeight: 1.8, frameWidth: 3.4, shift: [0.08, 0.02, 0], view: 'flat', yaw: 0.08, lift: 0.02 },
    'Polypeptide chain': { target: [4.1, 1.55, 0.08], frameHeight: 1.8, frameWidth: 3.4, shift: [0.05, 0.02, 0], view: 'flat', yaw: 0.08, lift: 0.02 },
    'Folded protein': { target: [4.2, 1.55, 0.08], frameHeight: 1.9, frameWidth: 3.5, shift: [0.05, 0.02, 0], view: 'flat', yaw: 0.08, lift: 0.02 },
    'Rough endoplasmic reticulum': { target: [3.65, -1.95, -0.35], frameHeight: 1.75, frameWidth: 3.4, shift: [0, 0, 0], view: 'flat', yaw: 0.08, lift: 0.02 }
  },
  prokaryote: {
    'DNA double helix': { target: [-2.35, 0.28, 0.28], frameHeight: 2.45, frameWidth: 4.8, shift: [0, 0, 0], view: 'flat', yaw: PROKARYOTE_PROCESS_YAW, lift: 0.02 },
    'Flat DNA transcription diagram': { target: [-2.35, 0.28, 0.28], frameHeight: 2.45, frameWidth: 4.95, shift: [0, 0, 0], view: 'flat', yaw: PROKARYOTE_PROCESS_YAW, lift: 0.02 },
    'Growing RNA strand': { target: [0.3, -0.18, 0.08], frameHeight: 1.9, frameWidth: 3.8, shift: [0.08, 0.02, 0], view: 'flat', yaw: 0.05, lift: 0.02 },
    Ribosome: { target: [1.35, 0.38, 0.12], frameHeight: 2.0, frameWidth: 3.7, shift: [0.08, 0.05, 0], view: 'flat', yaw: 0.05, lift: 0.02 },
    tRNA: { target: [1.62, 1.72, 0.05], frameHeight: 1.65, frameWidth: 3.1, shift: [0.04, 0, 0], view: 'flat', yaw: 0.05, lift: 0.02 },
    'Polypeptide chain': { target: [2.85, 1.22, 0], frameHeight: 1.8, frameWidth: 3.4, shift: [0.06, 0.02, 0], view: 'flat', yaw: 0.05, lift: 0.02 },
    'Folded protein': { target: [2.85, 1.22, 0], frameHeight: 1.9, frameWidth: 3.5, shift: [0.06, 0.02, 0], view: 'flat', yaw: 0.05, lift: 0.02 }
  }
};

export default function SimulationScene({ immersive = false }) {
  const { cellType, currentStep } = useSimulationStore();
  const step = TIMELINE_STEPS[currentStep] || TIMELINE_STEPS[0];
  const stepText = LESSON_TEXT[step.phase] || LESSON_TEXT.storage;
  const controlsRef = useRef();
  const minDistance = 2.1;
  const maxDistance = 30;

  const panView = useCallback((x, y) => {
    const controls = controlsRef.current;
    const camera = controls?.object;
    if (!controls || !camera) return;

    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0).multiplyScalar(x);
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1).multiplyScalar(y);
    const offset = right.add(up);
    camera.position.add(offset);
    controls.target.add(offset);
    controls.update();
  }, []);

  const zoomView = useCallback((factor) => {
    const controls = controlsRef.current;
    const camera = controls?.object;
    if (!controls || !camera) return;

    const target = controls.target;
    const offset = camera.position.clone().sub(target);
    const nextDistance = THREE.MathUtils.clamp(offset.length() * factor, minDistance, maxDistance);
    offset.setLength(nextDistance);
    camera.position.copy(target).add(offset);
    controls.update();
  }, [maxDistance, minDistance]);

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;
      const tagName = target?.tagName?.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target?.isContentEditable) return;

      const panStep = event.shiftKey ? 0.85 : 0.48;
      const keyActions = {
        ArrowLeft: () => panView(-panStep, 0),
        a: () => panView(-panStep, 0),
        ArrowRight: () => panView(panStep, 0),
        d: () => panView(panStep, 0),
        ArrowUp: () => panView(0, panStep),
        w: () => panView(0, panStep),
        ArrowDown: () => panView(0, -panStep),
        s: () => panView(0, -panStep),
        '=': () => zoomView(0.88),
        '+': () => zoomView(0.88),
        '-': () => zoomView(1.14),
        _: () => zoomView(1.14)
      };
      const action = keyActions[event.key];
      if (!action) return;
      event.preventDefault();
      action();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panView, zoomView]);

  return (
    <div className={immersive
      ? 'relative h-[72vh] min-h-[680px] w-full overflow-hidden bg-[#111713] xl:h-[calc(100vh-76px)]'
      : 'relative h-[560px] w-full overflow-hidden bg-[#111713] sm:h-[640px] lg:h-[700px] xl:h-[740px]'}>
      <Canvas shadows dpr={[1, 1.7]} gl={{ antialias: true }}>
        <color attach="background" args={['#111713']} />
        <fog attach="fog" args={['#111713', 12, 32]} />
        <PerspectiveCamera makeDefault position={DEFAULT_CAMERA_POSITION} fov={45} />
        <ambientLight intensity={0.38} />
        <directionalLight position={[4, 7, 5]} intensity={1.65} color="#fff4df" castShadow />
        <pointLight position={[-5, 3, -3]} intensity={0.8} color="#9ec9b2" />
        <pointLight position={[3.5, -2.2, 4]} intensity={0.5} color="#d3c2a5" />
        <Suspense fallback={<SceneFallback />}>
          {cellType === 'eukaryote' && <SpecimenStage />}
          {cellType === 'eukaryote' ? <EukaryoticCell expanded={immersive} /> : <ProkaryoticCell expanded={immersive} />}
          <SelectionFocusLabels />
          <ContactShadows opacity={0.42} scale={18} blur={3.2} far={5} position={[0, -3.35, 0]} color="#06100d" />
          <Environment preset="studio" />
        </Suspense>
        <AutoCameraRig controlsRef={controlsRef} />
        <OrbitControls ref={controlsRef} enableRotate enablePan enableZoom minDistance={minDistance} maxDistance={maxDistance} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.42)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
      <div className="absolute left-3 top-3 rounded-md border border-[#d8cfbd]/20 bg-[#111713]/82 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[#d8cfbd] backdrop-blur">
        Specimen view · {cellType}
      </div>
      <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-md border border-cyanBio/35 bg-white/95 px-3 py-2 text-sm font-bold text-[#050505] shadow-[0_12px_30px_rgba(0,0,0,0.28)] sm:left-1/2 sm:right-auto sm:w-[680px] sm:max-w-[calc(100%-420px)] sm:-translate-x-1/2">
        <span className="mr-2 text-[11px] uppercase tracking-[0.16em] text-[#155263]">{step.title}</span>
        {stepText.quick}
      </div>
      <div className="absolute left-3 top-16 grid grid-cols-3 gap-1 rounded-md border border-[#d8cfbd]/20 bg-[#111713]/78 p-1 backdrop-blur" aria-label="Camera movement controls">
        <span />
        <CameraButton label="Move camera up" onClick={() => panView(0, 0.55)} icon={ArrowUp} />
        <CameraButton label="Zoom in" onClick={() => zoomView(0.88)} icon={ZoomIn} />
        <CameraButton label="Move camera left" onClick={() => panView(-0.55, 0)} icon={ArrowLeft} />
        <CameraButton label="Move camera down" onClick={() => panView(0, -0.55)} icon={ArrowDown} />
        <CameraButton label="Move camera right" onClick={() => panView(0.55, 0)} icon={ArrowRight} />
        <span />
        <CameraButton label="Zoom out" onClick={() => zoomView(1.14)} icon={ZoomOut} />
        <span />
      </div>
      <button
        type="button"
        className="touch-target absolute right-3 top-3 inline-flex items-center gap-2 rounded-md border border-[#d8cfbd]/20 bg-[#111713]/78 px-3 text-sm text-[#f2eadb] backdrop-blur transition hover:border-[#d8cfbd]/45"
        onClick={() => controlsRef.current?.reset()}
        aria-label="Reset camera"
      >
        <RotateCcw size={16} aria-hidden="true" />
        Camera
      </button>
      <div className="absolute right-3 top-16 max-w-[320px] rounded-md border border-[#d8cfbd]/20 bg-[#111713]/78 px-3 py-2 text-right text-xs text-[#d8cfbd] backdrop-blur">
        Drag to rotate · WASD / arrows to move · scroll to zoom
      </div>
    </div>
  );
}

function CameraButton({ label, onClick, icon: Icon }) {
  return (
    <button
      type="button"
      className="grid h-9 w-9 place-items-center rounded border border-[#d8cfbd]/20 bg-[#182019]/90 text-[#f2eadb] transition hover:border-[#d8cfbd]/50 hover:bg-[#243026] active:scale-[0.96]"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  );
}

function AutoCameraRig({ controlsRef }) {
  const { camera, size } = useThree();
  const { currentStep, cellType, playing, reducedMotion, speed, selectedStructure, selectedFocusVersion } = useSimulationStore();
  const targetVector = useRef(new THREE.Vector3());
  const desiredPosition = useRef(new THREE.Vector3(...DEFAULT_CAMERA_POSITION));
  const desiredUp = useRef(new THREE.Vector3(0, 1, 0));
  const lastFrameKey = useRef('');
  const lastFocusVersion = useRef(selectedFocusVersion);
  const focusUntil = useRef(0);
  const frameUntil = useRef(0);

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls || reducedMotion) return;

    const frameKey = `${cellType}:${currentStep}`;
    if (lastFrameKey.current !== frameKey) {
      lastFrameKey.current = frameKey;
      frameUntil.current = state.clock.elapsedTime + 0.85;
    }
    if (lastFocusVersion.current !== selectedFocusVersion) {
      lastFocusVersion.current = selectedFocusVersion;
      focusUntil.current = state.clock.elapsedTime + 1.35;
    }

    const selectionFrame = state.clock.elapsedTime < focusUntil.current
      ? getSelectionCameraFrame(cellType, selectedStructure)
      : null;
    const lockProcessFrame = isLockedProcessFrame(cellType, currentStep) && !selectionFrame;
    const shouldFrame = lockProcessFrame || Boolean(selectionFrame) || state.clock.elapsedTime < frameUntil.current;
    if (!shouldFrame) {
      controls.enableRotate = true;
      return;
    }

    const frame = selectionFrame || getCameraFrame(cellType, currentStep);
    const flatView = frame.view === 'flat';
    const target = targetVector.current;
    target.fromArray(frame.target).add(new THREE.Vector3(...frame.shift));

    const distance = cameraDistanceForFrame(camera, frame, size);
    if (flatView) {
      const yaw = frame.yaw || 0;
      desiredPosition.current.set(
        target.x + Math.sin(yaw) * distance,
        target.y + distance * (frame.lift || 0),
        target.z + Math.cos(yaw) * distance
      );
    } else {
      desiredPosition.current.set(target.x, target.y + distance * 0.12, target.z + distance);
    }

    const framingSpeed = playing ? 2.6 + speed * 1.1 : 4.8;
    const damping = 1 - Math.exp(-delta * (flatView ? 7.5 : framingSpeed));
    camera.position.lerp(desiredPosition.current, damping);
    camera.up.lerp(desiredUp.current, damping).normalize();
    controls.target.lerp(target, damping);
    controls.enableRotate = !lockProcessFrame;
    camera.near = 0.08;
    camera.far = 80;
    camera.updateProjectionMatrix();
    controls.update();
  });

  return null;
}

function getCameraFrame(cellType, currentStep) {
  const frames = CAMERA_FRAMES[cellType] || CAMERA_FRAMES.eukaryote;
  return frames[Math.min(currentStep, frames.length - 1)] || frames[0];
}

function isLockedProcessFrame(cellType, currentStep) {
  return LOCKED_PROCESS_FRAME_STEPS[cellType]?.has(currentStep) || false;
}

function getSelectionCameraFrame(cellType, selectedStructure) {
  return SELECTION_CAMERA_FRAMES[cellType]?.[selectedStructure]
    || SELECTION_CAMERA_FRAMES[cellType]?.[normalizeSelectionName(selectedStructure)]
    || null;
}

function normalizeSelectionName(name = '') {
  if (name.includes('mRNA')) return 'Mature mRNA';
  if (name.includes('RNA strand')) return 'Growing RNA strand';
  if (name.includes('protein')) return 'Polypeptide chain';
  if (name.includes('Ribosome')) return 'Ribosome';
  if (name.includes('tRNA')) return 'tRNA';
  if (name.includes('DNA')) return 'DNA double helix';
  return name;
}

function SelectionFocusLabels() {
  const { cellType, selectedStructure, selectedFocusVersion, labelsVisible } = useSimulationStore();
  if (!labelsVisible || selectedFocusVersion === 0) return null;

  const normalized = normalizeSelectionName(selectedStructure);
  if (cellType === 'eukaryote') return <EukaryoteSelectionLabels selected={normalized} />;
  return <ProkaryoteSelectionLabels selected={normalized} />;
}

function EukaryoteSelectionLabels({ selected }) {
  if (selected === 'DNA double helix' || selected === 'Flat DNA transcription diagram') {
    return (
      <>
        <Labels text="Coding strand" position={[-4.15, 1.2, 0]} visible />
        <Labels text="Template strand" position={[-4.1, -0.82, 0]} visible />
        <Labels text="Gene region being transcribed" position={[-2.35, 1.78, 0]} visible />
      </>
    );
  }
  if (selected === 'Mature mRNA' || selected === 'mRNA processing') {
    return (
      <>
        <Labels text="5' cap" position={[-3.45, -1.18, 0]} visible />
        <Labels text="Spliced exons" position={[-2.15, -0.82, 0]} visible />
        <Labels text="Poly-A tail" position={[-0.85, -1.18, 0]} visible />
      </>
    );
  }
  if (selected === 'Ribosome') {
    return (
      <>
        <Labels text="Large subunit" position={[2.55, 1.1, 0]} visible />
        <Labels text="mRNA channel" position={[1.45, -0.88, 0]} visible />
        <Labels text="Small subunit" position={[3.55, -0.95, 0]} visible />
      </>
    );
  }
  if (selected === 'tRNA') return <Labels text="Anticodon pairs with codon" position={[2.15, 2.05, 0]} visible />;
  if (selected === 'Polypeptide chain') return <Labels text="Amino acid chain" position={[3.0, 2.25, 0]} visible />;
  if (selected === 'Rough endoplasmic reticulum') return <Labels text="Possible translation surface" position={[2.45, -1.2, 0]} visible />;
  return null;
}

function ProkaryoteSelectionLabels({ selected }) {
  if (selected === 'DNA double helix' || selected === 'Flat DNA transcription diagram') {
    return (
      <>
        <Labels text="Bacterial chromosome region" position={[-2.35, 1.55, 0]} visible />
        <Labels text="No nucleus" position={[-0.6, 1.88, 0]} visible />
      </>
    );
  }
  if (selected === 'Growing RNA strand') {
    return (
      <>
        <Labels text="mRNA being transcribed" position={[0.2, 0.72, 0]} visible />
        <Labels text="Ribosomes can attach immediately" position={[1.3, -0.92, 0]} visible />
      </>
    );
  }
  if (selected === 'Ribosome') return <Labels text="70S ribosome translating mRNA" position={[1.45, 1.25, 0]} visible />;
  if (selected === 'tRNA') return <Labels text="tRNA brings an amino acid" position={[1.62, 2.4, 0]} visible />;
  if (selected === 'Polypeptide chain') return <Labels text="Growing polypeptide" position={[2.85, 1.95, 0]} visible />;
  return null;
}

function cameraDistanceForFrame(camera, frame, size) {
  const aspect = size.width / Math.max(size.height, 1);
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const frameWidth = frame.frameWidth || frame.frameHeight * 1.6;
  const heightDistance = frame.frameHeight / (2 * Math.tan(fov / 2));
  const widthDistance = frameWidth / (2 * Math.tan(fov / 2) * Math.max(aspect, 0.1));
  return Math.max(heightDistance, widthDistance) * 1.18;
}

function SpecimenStage() {
  const particles = useMemo(() => {
    return Array.from({ length: 42 }, (_, index) => {
      const angle = index * 2.399;
      const radius = 1.5 + (index % 9) * 0.46;
      return {
        position: [
          Math.cos(angle) * radius,
          -3.05 + (index % 5) * 0.035,
          Math.sin(angle) * radius * 0.42 - 0.45
        ],
        scale: 0.012 + (index % 4) * 0.006
      };
    });
  }, []);

  return (
    <group>
      <mesh position={[0, -3.22, -0.45]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[7.2, 96]} />
        <meshStandardMaterial color="#19231d" roughness={0.82} metalness={0.08} />
      </mesh>
      {particles.map(({ position, scale }, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[scale, 8, 8]} />
          <meshBasicMaterial color={index % 3 === 0 ? '#d8cfbd' : '#9ec9b2'} transparent opacity={0.32} />
        </mesh>
      ))}
    </group>
  );
}

function SceneFallback() {
  return (
    <Html center>
      <div className="rounded-md border border-line bg-panel px-4 py-3 text-sm text-slate-200">Loading model...</div>
    </Html>
  );
}
