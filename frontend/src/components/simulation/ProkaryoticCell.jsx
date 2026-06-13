import { Text as DreiText } from '@react-three/drei';
import DNADoubleHelix from './DNADoubleHelix';
import TRNA from './TRNA';
import ProteinChain from './ProteinChain';
import Labels from './Labels';
import ClickableMesh from './ClickableMesh';
import { useSimulationStore } from '../../store/simulationStore';

const RNA_COLORS = { A: '#7ee787', U: '#b28cff', C: '#47d4ff', G: '#f3c969' };

function Text(props) {
  return <DreiText {...props} color="#050505" fontWeight={700} />;
}

export default function ProkaryoticCell({ expanded = false }) {
  const { currentStep, labelsVisible, sequenceResult } = useSimulationStore();
  const showDnaContext = labelsVisible && currentStep <= 6;
  const showCoupledContext = labelsVisible && currentStep >= 6 && currentStep <= 10;
  const showTRNAContext = labelsVisible && currentStep >= 10 && currentStep <= 11;
  const showPolypeptideContext = labelsVisible && currentStep >= 11;
  return (
    <group>
      <group scale={expanded ? 1.16 : 1}>
        <Labels text="Open cytoplasm: no nucleus" target={[0.4, 0.25, 0]} position={[0.2, 2.55, 0]} visible={labelsVisible && (currentStep === 0 || showCoupledContext)} />
      {currentStep >= 1 && <Labels text="Operon: promoter, operator, and structural genes" target={[-2.25, 0.65, 0]} position={[-4.25, 1.95, 0]} visible={showDnaContext} />}
      {currentStep >= 1 && <Labels text="Operator: DNA site where a repressor can bind" target={[-2.65, 0.05, 0.15]} position={[-4.2, -0.45, 0]} visible={showDnaContext && currentStep <= 3} />}
      <Labels text="Nucleoid: circular bacterial chromosome" target={[-2.35, 0.28, 0]} position={[-4.2, 1.05, 0]} visible={showDnaContext} />
      <DNADoubleHelix position={[-2.35, 0.28, 0]} scale={0.65} />
      {currentStep >= 5 && <PolysomeTranscript position={[0.15, -0.18, 0.08]} sequence={sequenceResult.mrna} currentStep={currentStep} />}
      {currentStep >= 6 && <Labels text="mRNA can be translated before transcription finishes" target={[0.35, -0.18, 0]} position={[0.2, -2.05, 0]} visible={showCoupledContext} />}
      {currentStep >= 8 && <Labels text="70S ribosome reads the mRNA" target={[1.72, 0.62, 0]} position={[3.45, 1.62, 0]} visible={showCoupledContext} />}
      {currentStep >= 8 && <EnzymeLabel text="initiation factors" position={[0.38, 1.5, 0.12]} />}
      {currentStep >= 10 && <TRNA position={[1.62, 1.72, 0.05]} anticodon="UAC" amino="Met" />}
      {currentStep >= 10 && <Labels text="tRNA carries amino acid to matching codon" target={[1.62, 1.46, 0.05]} position={[3.25, 2.35, 0]} visible={showTRNAContext} />}
      {currentStep >= 11 && <EnzymeLabel text="elongation factors use GTP" position={[0.65, 0.02, 0.12]} />}
      {currentStep >= 11 && <ProteinChain position={[2.85, 1.22, 0]} folded={currentStep >= 14} />}
      {currentStep >= 11 && <Labels text="Polypeptide emerges as peptide bonds form" target={[2.85, 1.22, 0]} position={[4.3, 0.95, 0]} visible={showPolypeptideContext} />}
      {currentStep >= 13 && <EnzymeLabel text="release factor at stop codon" position={[3.5, 0.12, 0.12]} />}
        <Labels text="Coupled transcription/translation" target={[1.0, -0.05, 0]} position={[2.85, -1.75, 0]} visible={showCoupledContext} />
      </group>
    </group>
  );
}

function PolysomeTranscript({ position, sequence = 'AUGGAAUUUUAA', currentStep }) {
  const visibleLength = currentStep >= 10 ? 15 : currentStep >= 8 ? 12 : currentStep >= 6 ? 9 : 6;
  const bases = (sequence || 'AUGGAAUUUUAA').replace(/T/g, 'U').slice(0, visibleLength).split('');
  const ribosomeCount = currentStep >= 10 ? 4 : currentStep >= 8 ? 3 : currentStep >= 6 ? 2 : 1;
  const ribosomePositions = Array.from({ length: ribosomeCount }, (_, index) => {
    const baseIndex = Math.min(2 + index * 3, Math.max(2, bases.length - 2));
    return [baseIndex * 0.24 - 0.98, 0.34 + (index % 2) * 0.08, 0.2];
  });
  return (
    <group position={position}>
      <TextPlate text="RNA polymerase" position={[-1.45, 0.7, 0.12]} width={0.88} />
      <mesh position={[-1.42, 0.12, 0.08]} rotation={[0, 0, -0.25]} castShadow>
        <torusGeometry args={[0.3, 0.065, 14, 36, Math.PI * 1.45]} />
        <meshStandardMaterial color="#f3c969" emissive="#f3c969" emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[-1.32, 0.05, 0.12]} castShadow>
        <sphereGeometry args={[0.15, 18, 14]} />
        <meshStandardMaterial color="#d99d3f" roughness={0.36} />
      </mesh>
      {bases.map((base, index) => (
        <group key={`${base}-${index}`} position={[index * 0.24 - 1.12, -0.18 + Math.sin(index * 0.55) * 0.045, 0.1]}>
          {index > 0 && <ConnectorSegment from={[-0.16, -0.02, 0]} to={[-0.04, -0.02, 0]} />}
          <RnaNucleotideUnit base={base} />
        </group>
      ))}
      {ribosomePositions.map((ribosomePosition, index) => (
        <MiniRibosome
          key={index}
          position={ribosomePosition}
          peptideLength={currentStep >= 11 ? Math.min(4, index + 2) : Math.max(1, index)}
        />
      ))}
      <TextPlate text="multiple ribosomes translate the mRNA as it is made" position={[0.72, -0.92, 0.16]} width={2.35} />
    </group>
  );
}

function MiniRibosome({ position, peptideLength = 0 }) {
  return (
    <ClickableMesh name="Ribosome">
      <group position={position} scale={0.55}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.48, 24, 16]} />
          <meshStandardMaterial color="#8aa3ff" roughness={0.42} />
        </mesh>
        <mesh position={[0, -0.18, 0]} castShadow>
          <sphereGeometry args={[0.36, 24, 16]} />
          <meshStandardMaterial color="#6a82da" roughness={0.45} />
        </mesh>
        <mesh position={[0, -0.02, 0.1]}>
          <boxGeometry args={[0.86, 0.14, 0.08]} />
          <meshStandardMaterial color="#071015" transparent opacity={0.36} />
        </mesh>
        {peptideLength > 0 && <MiniPeptide count={peptideLength} />}
      </group>
    </ClickableMesh>
  );
}

function MiniPeptide({ count }) {
  return (
    <group position={[0.12, 0.72, 0.12]}>
      {Array.from({ length: count }, (_, index) => (
        <group key={index}>
          {index > 0 && <ConnectorSegment from={[(index - 1) * 0.18, 0, 0]} to={[index * 0.18, 0.08 * Math.sin(index), 0]} />}
          <mesh position={[index * 0.18, 0.08 * Math.sin(index), 0]} castShadow>
            <sphereGeometry args={[0.08, 14, 12]} />
            <meshStandardMaterial color={['#7ee787', '#47d4ff', '#f3c969', '#ff7b93'][index % 4]} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RnaNucleotideUnit({ base }) {
  const color = RNA_COLORS[base] || RNA_COLORS.U;
  return (
    <group>
      <mesh position={[-0.05, -0.02, 0]} castShadow>
        <sphereGeometry args={[0.052, 14, 12]} />
        <meshStandardMaterial color="#f3c969" emissive="#f3c969" emissiveIntensity={0.08} roughness={0.36} />
      </mesh>
      <mesh position={[0.05, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.064, 0.016, 8, 24]} />
        <meshStandardMaterial color="#8bdcff" emissive="#8bdcff" emissiveIntensity={0.08} roughness={0.34} />
      </mesh>
      <mesh position={[0.05, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.11, 8]} />
        <meshStandardMaterial color="#7f98a7" />
      </mesh>
      <mesh position={[0.05, 0.22, 0.02]} castShadow>
        <boxGeometry args={[0.12, 0.18, 0.055]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.08} roughness={0.42} />
      </mesh>
      <TextPlate text={base} position={[0.05, 0.36, 0.08]} width={0.22} height={0.18} fontSize={0.085} />
    </group>
  );
}

function ConnectorSegment({ from, to }) {
  const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
  return (
    <mesh position={mid} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.016, 0.016, Math.abs(to[0] - from[0]), 8]} />
      <meshStandardMaterial color="#d8fbff" />
    </mesh>
  );
}

function EnzymeLabel({ text, position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.05, 0.28, 0.08]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.03} roughness={0.38} />
      </mesh>
      <Text position={[0, 0.015, 0.055]} fontSize={0.082} color="#071015" anchorX="center" anchorY="middle" maxWidth={0.94}>
        {text}
      </Text>
    </group>
  );
}

function TextPlate({ text, position, width = 0.6, height = 0.22, fontSize = 0.085 }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[width, height, 0.055]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.03} roughness={0.38} />
      </mesh>
      <Text position={[0, 0.01, 0.04]} fontSize={fontSize} color="#071015" anchorX="center" anchorY="middle" maxWidth={width - 0.06}>
        {text}
      </Text>
    </group>
  );
}
