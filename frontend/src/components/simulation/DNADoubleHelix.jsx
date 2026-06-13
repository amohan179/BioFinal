import { Text as DreiText } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import ClickableMesh from './ClickableMesh';
import Labels from './Labels';
import { useSimulationStore } from '../../store/simulationStore';

const BASE_COLORS = { A: '#7ee787', T: '#ff7b93', C: '#47d4ff', G: '#f3c969' };
const COMPLEMENT = { A: 'T', T: 'A', C: 'G', G: 'C' };
const PHOSPHATE_COLOR = '#f3c969';
const SUGAR_COLOR = '#8bdcff';
const BACKBONE_COLOR = '#d8fbff';

function Text(props) {
  return <DreiText {...props} color="#050505" fontWeight={700} />;
}

export default function DNADoubleHelix({ position = [0, 0, 0], scale = 1 }) {
  const ref = useRef();
  const { currentStep, reducedMotion, baseLabelsVisible, backboneVisible, geneHighlighted, labelsVisible, sequenceResult } = useSimulationStore();
  const unzipped = currentStep >= 2 && currentStep <= 5;
  const transcription = currentStep >= 3 && currentStep <= 5;
  const flatProcessView = currentStep >= 1 && currentStep <= 5;
  const bases = useMemo(() => {
    const sequence = (sequenceResult.dna || 'ATGGAATTTTAA').slice(0, 18).padEnd(18, 'ATCG');
    return sequence.split('').map((base, index) => ({ base, pair: COMPLEMENT[base] || 'A', index }));
  }, [sequenceResult.dna]);

  useFrame((_, delta) => {
    if (!flatProcessView && !reducedMotion && ref.current) ref.current.rotation.y += delta * 0.18;
  });

  if (flatProcessView) {
    return (
      <group ref={ref} position={position} scale={scale}>
        <FlatDNAProcess bases={bases} />
      </group>
    );
  }

  return (
    <group ref={ref} position={position} scale={scale}>
      <ClickableMesh name="DNA double helix" labelPosition={[0, 2.5, 0]}>
        {bases.map(({ base, pair, index }) => {
          const current = nucleotidePairAt(index, bases.length, unzipped);
          const previous = index > 0 ? nucleotidePairAt(index - 1, bases.length, unzipped) : null;
          const highlight = geneHighlighted && index >= 2 && index <= 12;
          return (
            <group key={`${base}-${index}`}>
              {backboneVisible && (
                <>
                  <NucleotidePart type="phosphate" position={current.strandA.phosphate} highlight={highlight} />
                  <NucleotidePart type="sugar" position={current.strandA.sugar} highlight={highlight} />
                  <NucleotidePart type="sugar" position={current.strandB.sugar} highlight={highlight} />
                  <NucleotidePart type="phosphate" position={current.strandB.phosphate} highlight={highlight} />

                  <Connector start={current.strandA.phosphate} end={current.strandA.sugar} color={highlight ? BACKBONE_COLOR : '#7f98a7'} radius={0.022} />
                  <Connector start={current.strandB.phosphate} end={current.strandB.sugar} color={highlight ? BACKBONE_COLOR : '#7f98a7'} radius={0.022} />
                  {previous && (
                    <>
                      <Connector start={previous.strandA.sugar} end={current.strandA.phosphate} color={highlight ? BACKBONE_COLOR : '#7f98a7'} radius={0.022} />
                      <Connector start={previous.strandB.sugar} end={current.strandB.phosphate} color={highlight ? BACKBONE_COLOR : '#7f98a7'} radius={0.022} />
                    </>
                  )}
                </>
              )}
              <Base start={current.strandA.sugar} end={current.baseAEnd} label={base} color={BASE_COLORS[base]} showLabel={baseLabelsVisible} />
              <Base start={current.strandB.sugar} end={current.baseBEnd} label={pair} color={BASE_COLORS[pair]} showLabel={baseLabelsVisible} />
              <Connector start={current.baseAEnd} end={current.baseBEnd} color={highlight ? '#47d4ff' : '#496371'} radius={0.016} opacity={0.72} />
              {index === 1 && backboneVisible && (
                <>
                  <Labels text="Phosphate group" target={current.strandA.phosphate} position={add(current.strandA.phosphate, [0.62, 0.46, 0])} visible={labelsVisible} />
                  <Labels text="5-carbon sugar" target={current.strandA.sugar} position={add(current.strandA.sugar, [-0.72, 0.38, 0])} visible={labelsVisible} />
                  <Labels text="Nitrogenous base" target={[0, current.y, 0]} position={[0.72, current.y + 0.54, 0]} visible={labelsVisible} />
                </>
              )}
              {transcription && index === Math.min(4 + currentStep, 9) && <Labels text="transcription bubble" target={[0, current.y, 0]} position={[1.08, current.y + 0.54, 0]} visible={labelsVisible} />}
            </group>
          );
        })}
      </ClickableMesh>
      <Labels text="Highlighted gene segment" target={[0.45, 0.05, 0]} position={[2.15, 0.78, 0]} visible={labelsVisible && geneHighlighted} />
    </group>
  );
}

function FlatDNAProcess({ bases }) {
  const { currentStep, baseLabelsVisible, backboneVisible, geneHighlighted, labelsVisible, sequenceResult } = useSimulationStore();
  const transcription = currentStep >= 3 && currentStep <= 5;
  const transcriptionStart = 4;
  const activeIndex = Math.min(4 + currentStep, bases.length - 4);
  const visibleRNA = transcription ? Math.max(2, Math.min(activeIndex - 2, 9)) : 0;
  const mrna = bases
    .slice(transcriptionStart, transcriptionStart + visibleRNA)
    .map(({ base }) => (base === 'T' ? 'U' : base))
    .join('') || (sequenceResult.mrna || 'AUGGAAUUUUAA').slice(0, visibleRNA);

  return (
    <ClickableMesh name="Flat DNA transcription diagram" labelPosition={[0, 1.45, 0]}>
      <group rotation={[0, 0, 0]}>
        {bases.map(({ base, pair, index }) => {
          const current = flatNucleotidePairAt(index, bases.length, currentStep);
          const previous = index > 0 ? flatNucleotidePairAt(index - 1, bases.length, currentStep) : null;
          const highlight = geneHighlighted && index >= 2 && index <= 12;
          const opened = currentStep >= 2 && index >= 4 && index <= 11;
          return (
            <group key={`${base}-${pair}-${index}`}>
              {backboneVisible && (
                <>
                  <NucleotidePart type="phosphate" position={current.coding.phosphate} highlight={highlight} />
                  <NucleotidePart type="sugar" position={current.coding.sugar} highlight={highlight} />
                  <NucleotidePart type="sugar" position={current.template.sugar} highlight={highlight} />
                  <NucleotidePart type="phosphate" position={current.template.phosphate} highlight={highlight} />
                  <Connector start={current.coding.phosphate} end={current.coding.sugar} color={highlight ? BACKBONE_COLOR : '#7f98a7'} radius={0.018} />
                  <Connector start={current.template.phosphate} end={current.template.sugar} color={highlight ? BACKBONE_COLOR : '#7f98a7'} radius={0.018} />
                  {previous && (
                    <>
                      <Connector start={previous.coding.sugar} end={current.coding.phosphate} color={highlight ? BACKBONE_COLOR : '#7f98a7'} radius={0.018} />
                      <Connector start={previous.template.sugar} end={current.template.phosphate} color={highlight ? BACKBONE_COLOR : '#7f98a7'} radius={0.018} />
                    </>
                  )}
                </>
              )}
              <Base start={current.coding.sugar} end={current.coding.baseEnd} label={base} color={BASE_COLORS[base]} showLabel={baseLabelsVisible || (currentStep >= 1 && currentStep <= 5)} />
              <Base start={current.template.sugar} end={current.template.baseEnd} label={pair} color={BASE_COLORS[pair]} showLabel={baseLabelsVisible || (currentStep >= 1 && currentStep <= 5)} />
              {!opened && <Connector start={current.coding.baseEnd} end={current.template.baseEnd} color={highlight ? '#47d4ff' : '#496371'} radius={0.012} opacity={0.62} />}
              {opened && <Connector start={current.coding.baseEnd} end={current.template.baseEnd} color="#47d4ff" radius={0.008} opacity={0.22} />}
            </group>
          );
        })}

        {transcription && (
          <>
            <Polymerase2D position={[flatX(activeIndex, bases.length), -0.02, 0.18]} />
            <GrowingRNA2D mrna={mrna} startX={flatX(transcriptionStart, bases.length)} />
            <Labels text="RNA polymerase moves along the template strand" target={[flatX(activeIndex, bases.length), -0.02, 0.18]} position={[flatX(activeIndex, bases.length) + 1.02, 1.44, 0.2]} visible={labelsVisible} />
            <EnzymeBadge text="RNA polymerase builds RNA from template DNA" position={[flatX(activeIndex + 5, bases.length) + 0.2, 1.46, 0.08]} width={1.48} />
          </>
        )}

        <Labels text="Coding strand" target={[-2.15, 0.46, 0]} position={[-3.15, 0.92, 0]} visible={labelsVisible} />
        <Labels text="Template strand read by RNA polymerase" target={[-2.15, -0.46, 0]} position={[-3.08, -1.15, 0]} visible={labelsVisible} />
        <Labels text="Flat process view: DNA is laid out for clarity" position={[-0.3, 1.62, 0]} visible={labelsVisible} />
        {currentStep >= 1 && (
          <>
            <RegulatorySite text="promoter" position={[flatX(1, bases.length) - 0.2, 1.05, 0.06]} color="#f3c969" labelPosition={[0, -0.34, 0.08]} labelWidth={0.78} />
            <RegulatorySite text="enhancer / regulatory DNA" position={[flatX(7, bases.length) + 0.24, 1.08, 0.06]} color="#b28cff" />
          </>
        )}
        {currentStep >= 1 && <EnzymeBadge text="transcription factors recruit RNA polymerase" position={[flatX(0, bases.length) - 0.28, 1.66, 0.08]} width={1.46} />}
        {currentStep >= 2 && <Labels text="Local transcription bubble" target={[0.24, 0.02, 0.2]} position={[2.02, -0.36, 0.2]} visible={labelsVisible} />}
        {geneHighlighted && <GeneHighlight length={bases.length} />}
      </group>
    </ClickableMesh>
  );
}

function flatNucleotidePairAt(index, total, currentStep) {
  const x = flatX(index, total);
  const opened = currentStep >= 2 && index >= 4 && index <= 11;
  const topY = opened ? 0.68 : 0.46;
  const bottomY = opened ? -0.68 : -0.46;
  const phosphateOffset = index % 2 === 0 ? -0.07 : 0.07;
  return {
    coding: {
      phosphate: [x + phosphateOffset, topY, 0],
      sugar: [x, topY - 0.16, 0],
      baseEnd: [x, opened ? 0.18 : 0.06, 0]
    },
    template: {
      phosphate: [x - phosphateOffset, bottomY, 0],
      sugar: [x, bottomY + 0.16, 0],
      baseEnd: [x, opened ? -0.18 : -0.06, 0]
    }
  };
}

function flatX(index, total) {
  return (index - (total - 1) / 2) * 0.27;
}

function Polymerase2D({ position }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, -0.35]} castShadow>
        <torusGeometry args={[0.36, 0.075, 18, 48, Math.PI * 1.42]} />
        <meshStandardMaterial color="#f3c969" emissive="#f3c969" emissiveIntensity={0.14} roughness={0.32} />
      </mesh>
      <mesh position={[0.03, -0.08, 0.02]} castShadow>
        <sphereGeometry args={[0.19, 20, 16]} />
        <meshStandardMaterial color="#d99d3f" roughness={0.36} />
      </mesh>
      <mesh position={[0.02, -0.32, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.13, 0.018, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#b28cff" emissive="#b28cff" emissiveIntensity={0.12} />
      </mesh>
      <TextPlate text="RNA polymerase" position={[0, 0.13, 0.22]} width={0.66} height={0.22} fontSize={0.07} />
    </group>
  );
}

function EnzymeBadge({ text, position, width = 1.26 }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[width, 0.44, 0.08]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.03} roughness={0.38} />
      </mesh>
      <Text position={[0, 0.02, 0.055]} fontSize={0.102} color="#071015" anchorX="center" anchorY="middle" maxWidth={width - 0.14}>
        {text}
      </Text>
    </group>
  );
}

function RegulatorySite({ text, position, labelPosition = [0, 0.38, 0.08], labelWidth }) {
  return (
    <group position={position}>
      <TextPlate text={text} position={labelPosition} width={labelWidth || (text.length > 10 ? 1.14 : 0.72)} />
    </group>
  );
}

function GrowingRNA2D({ mrna, startX }) {
  return (
    <group>
      {mrna.split('').map((base, index) => {
        const x = startX + index * 0.27;
        return (
          <group key={`${base}-${index}`} position={[x, -1.08, 0.12]}>
            {index > 0 && <Connector start={[-0.16, -0.02, 0]} end={[-0.05, -0.02, 0]} color="#d8fbff" radius={0.012} />}
            <RnaNucleotide2D base={base} />
          </group>
        );
      })}
      {mrna && <Labels text="Growing RNA strand uses U instead of T" target={[startX + 0.7, -1.08, 0.1]} position={[startX + 2.2, -1.82, 0.1]} visible />}
    </group>
  );
}

function RnaNucleotide2D({ base }) {
  const color = base === 'U' ? '#b28cff' : BASE_COLORS[base];
  return (
    <group>
      <mesh position={[-0.06, -0.02, 0]} castShadow>
        <sphereGeometry args={[0.055, 14, 12]} />
        <meshStandardMaterial color={PHOSPHATE_COLOR} emissive={PHOSPHATE_COLOR} emissiveIntensity={0.08} roughness={0.36} />
      </mesh>
      <mesh position={[0.05, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.07, 0.018, 8, 24]} />
        <meshStandardMaterial color={SUGAR_COLOR} emissive={SUGAR_COLOR} emissiveIntensity={0.08} roughness={0.34} />
      </mesh>
      <Connector start={[0.05, 0.04, 0]} end={[0.05, 0.16, 0]} color="#7f98a7" radius={0.01} />
      <mesh position={[0.05, 0.26, 0]} castShadow>
        <boxGeometry args={[0.13, 0.2, 0.055]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.08} roughness={0.42} />
      </mesh>
      <TextPlate text={base} position={[0.05, 0.43, 0.06]} width={0.22} height={0.18} fontSize={0.095} />
    </group>
  );
}

function TextPlate({ text, position, width = 0.9, height = 0.28, fontSize = 0.092 }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[width, height, 0.055]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.03} roughness={0.38} />
      </mesh>
      <Text position={[0, 0.01, 0.04]} fontSize={fontSize} color="#071015" anchorX="center" anchorY="middle" maxWidth={width - 0.08}>
        {text}
      </Text>
    </group>
  );
}

function GeneHighlight({ length }) {
  const start = flatX(2, length);
  const end = flatX(12, length);
  return (
    <mesh position={[(start + end) / 2, 0, -0.03]}>
      <boxGeometry args={[end - start + 0.28, 1.72, 0.025]} />
      <meshStandardMaterial color="#47d4ff" transparent opacity={0.08} />
    </mesh>
  );
}

function nucleotidePairAt(index, total, unzipped) {
  const angle = index * 0.72;
  const y = (index - total / 2) * 0.22;
  const radius = 1.12;
  const separation = unzipped && index > 3 && index < 12 ? 0.65 : 0;
  const outwardA = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
  const outwardB = outwardA.clone().multiplyScalar(-1);
  const phosphateA = outwardA.clone().multiplyScalar(radius + separation).setY(y);
  const phosphateB = outwardB.clone().multiplyScalar(radius + separation).setY(y);
  const sugarA = outwardA.clone().multiplyScalar(radius - 0.24 + separation).setY(y);
  const sugarB = outwardB.clone().multiplyScalar(radius - 0.24 + separation).setY(y);
  const baseAEnd = outwardA.clone().multiplyScalar(0.18).setY(y);
  const baseBEnd = outwardB.clone().multiplyScalar(0.18).setY(y);

  return {
    y,
    strandA: { phosphate: phosphateA.toArray(), sugar: sugarA.toArray() },
    strandB: { phosphate: phosphateB.toArray(), sugar: sugarB.toArray() },
    baseAEnd: baseAEnd.toArray(),
    baseBEnd: baseBEnd.toArray()
  };
}

function NucleotidePart({ type, position, highlight }) {
  if (type === 'sugar') {
    return (
      <group position={position}>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.09, 0.024, 10, 28]} />
          <meshStandardMaterial color={highlight ? '#d8fbff' : SUGAR_COLOR} emissive={SUGAR_COLOR} emissiveIntensity={0.12} roughness={0.32} />
        </mesh>
        <mesh castShadow>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#eaf7fb" roughness={0.35} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.078, 18, 18]} />
        <meshStandardMaterial color={highlight ? '#fff1bb' : PHOSPHATE_COLOR} emissive={PHOSPHATE_COLOR} emissiveIntensity={0.12} roughness={0.32} />
      </mesh>
      {[[-0.08, 0.04, 0], [0.08, 0.04, 0], [0, -0.08, 0.04]].map((offset) => (
        <mesh key={offset.join(',')} position={offset} castShadow>
          <sphereGeometry args={[0.03, 10, 10]} />
          <meshStandardMaterial color="#ffe7a3" roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function Base({ start, end, color, label, showLabel }) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const mid = startVector.clone().lerp(endVector, 0.56);
  const direction = endVector.clone().sub(startVector).normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction);
  const length = startVector.distanceTo(endVector) * 0.72;
  return (
    <group>
      <Connector start={start} end={end} color={color} radius={0.055} opacity={1} />
      <mesh position={mid.toArray()} quaternion={quaternion} castShadow>
        <boxGeometry args={[length, 0.12, 0.13]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.12} roughness={0.45} />
      </mesh>
      {showLabel && (
        <TextPlate text={label} position={add(mid.toArray(), [0, 0.18, 0.08])} width={0.24} height={0.2} fontSize={0.12} />
      )}
    </group>
  );
}

function Connector({ start, end, color, radius = 0.018, opacity = 1 }) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const mid = startVector.clone().add(endVector).multiplyScalar(0.5);
  const direction = endVector.clone().sub(startVector);
  const length = direction.length();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );

  return (
    <mesh position={mid.toArray()} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, length, 10]} />
      <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} roughness={0.38} />
    </mesh>
  );
}

function add(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}
