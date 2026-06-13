import { Text as DreiText } from '@react-three/drei';
import ClickableMesh from './ClickableMesh';
import { useSimulationStore } from '../../store/simulationStore';

const COLORS = { A: '#7ee787', U: '#b28cff', C: '#47d4ff', G: '#f3c969' };

function Text(props) {
  return <DreiText {...props} color="#050505" fontWeight={700} />;
}

export default function RNAstrand({ position = [0, 0, 0], codonMode = false, limit = 18, mature = false }) {
  const { sequenceResult, currentStep } = useSimulationStore();
  const sequence = (sequenceResult.mrna || 'AUGGAAUUUUAA').slice(0, limit);
  const visibleCount = currentStep <= 5 ? Math.max(3, Math.min(sequence.length, currentStep * 3)) : sequence.length;
  const chars = sequence.slice(0, visibleCount).split('');

  return (
    <ClickableMesh name={mature ? 'Mature mRNA' : 'Growing RNA strand'} labelPosition={[0, 0.75, 0]}>
      <group position={position}>
        {mature && <EndCap text="5' cap" position={[-chars.length * 0.14 - 0.35, 0, 0]} color="#f3c969" />}
        {chars.map((base, index) => (
          <group key={`${base}-${index}`} position={[index * 0.28 - chars.length * 0.14, Math.sin(index * 0.7) * 0.08, 0]}>
            {index > 0 && <BackboneLink />}
            <RnaNucleotide base={base} />
            {codonMode && index % 3 === 0 && <CodonBracket active={index / 3 === Math.max(0, currentStep - 9)} />}
          </group>
        ))}
        {mature && <EndCap text="poly-A tail" position={[chars.length * 0.14 + 0.42, 0, 0]} color="#7ee787" width={0.46} />}
      </group>
    </ClickableMesh>
  );
}

function RnaNucleotide({ base }) {
  const color = COLORS[base] || COLORS.U;
  return (
    <group>
      <mesh position={[-0.06, -0.02, 0]} castShadow>
        <sphereGeometry args={[0.06, 14, 12]} />
        <meshStandardMaterial color="#f3c969" emissive="#f3c969" emissiveIntensity={0.08} roughness={0.36} />
      </mesh>
      <mesh position={[0.06, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.074, 0.018, 8, 24]} />
        <meshStandardMaterial color="#8bdcff" emissive="#8bdcff" emissiveIntensity={0.08} roughness={0.34} />
      </mesh>
      <mesh position={[0.06, 0.2, 0.02]} castShadow>
        <boxGeometry args={[0.13, 0.22, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.08} roughness={0.42} />
      </mesh>
      <mesh position={[0.06, 0.08, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.14, 8]} />
        <meshStandardMaterial color="#7f98a7" />
      </mesh>
      <TextPlate text={base} position={[0.06, 0.39, 0.07]} width={0.22} height={0.18} fontSize={0.09} />
    </group>
  );
}

function BackboneLink() {
  return (
    <mesh position={[-0.17, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
      <meshStandardMaterial color="#d8fbff" />
    </mesh>
  );
}

function EndCap({ text, position, color, width = 0.28 }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[width, 0.2, 0.18]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <TextPlate text={text} position={[0, 0.32, 0.08]} width={text.length > 7 ? 0.68 : 0.48} />
    </group>
  );
}

function TextPlate({ text, position, width = 0.6, height = 0.24, fontSize = 0.09 }) {
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

function CodonBracket({ active }) {
  return (
    <mesh position={[0.28, -0.26, 0]}>
      <boxGeometry args={[0.82, 0.035, 0.035]} />
      <meshStandardMaterial color={active ? '#f3c969' : '#5b7280'} emissive={active ? '#f3c969' : '#000'} emissiveIntensity={0.2} />
    </mesh>
  );
}
