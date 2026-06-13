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

export default function EukaryoticCell({ expanded = false }) {
  const { currentStep, labelsVisible, processingMode, sequenceResult } = useSimulationStore();
  const showNuclearContext = labelsVisible && currentStep <= 7;
  const showDnaContext = labelsVisible && currentStep <= 5;
  const showProcessingContext = labelsVisible && currentStep >= 5 && currentStep <= 7;
  const showTranslationContext = labelsVisible && currentStep >= 8 && currentStep <= 10;
  const showTRNAContext = labelsVisible && currentStep >= 10 && currentStep <= 11;
  const showPolypeptideContext = labelsVisible && currentStep >= 11;
  return (
    <group>
      <group scale={expanded ? 1.14 : 1}>
        <Labels text="Cytoplasm: translation occurs here" target={[2.25, -1.85, 0]} position={[3.75, -2.35, 0]} visible={showTranslationContext} />

      <ClickableMesh name="Nucleus" interactive={false}>
        <mesh position={[-2.35, 0.55, 0]} castShadow renderOrder={-2}>
          <sphereGeometry args={[1.78, 48, 32]} />
          <meshPhysicalMaterial color="#6e7d99" transparent opacity={0.18} roughness={0.28} transmission={0.22} thickness={0.42} clearcoat={0.12} depthWrite={false} />
        </mesh>
        <mesh position={[-2.35, 0.55, 0]} wireframe renderOrder={-1}>
          <sphereGeometry args={[1.82, 28, 18]} />
          <meshBasicMaterial color="#d8cfbd" transparent opacity={0.16} depthWrite={false} />
        </mesh>
      </ClickableMesh>
      <Labels text="Nucleus: DNA is transcribed here" target={[-2.35, 0.55, 0]} position={[-3.65, 2.05, 0]} visible={showDnaContext} />
      <Labels text="Nuclear envelope" target={[-0.95, 1.2, 0]} position={[-0.2, 2.55, 0]} visible={showNuclearContext && currentStep <= 4} />
      <NucleusChannels />

      <DNADoubleHelix position={[-2.35, 0.55, 0]} scale={0.78} />

      {currentStep >= 5 && currentStep <= 7 && <MRNAProcessing position={[-2.35, -1.72, 0.2]} mode={processingMode} currentStep={currentStep} sequence={sequenceResult.mrna} />}
      {currentStep >= 7 && currentStep < 8 && <MatureMrnaExport position={[-0.05, -1.38, 0.15]} sequence={sequenceResult.mrna} />}
      {currentStep >= 7 && <Labels text="Mature mRNA exits through nuclear pore" target={[-0.8, -0.92, 0.1]} position={[0.75, -2.25, 0]} visible={showProcessingContext} />}
      {currentStep >= 8 && <TranslationComplex position={[3.75, -0.46, 0]} sequence={sequenceResult.mrna} currentStep={currentStep} />}
      {currentStep >= 8 && <RoughEndoplasmicReticulum position={[3.65, -1.95, -0.35]} />}
      {currentStep >= 8 && <Labels text="Ribosome: large and small subunits read mRNA" target={[3.75, -0.25, 0]} position={[5.25, 1.15, 0]} visible={showTranslationContext} />}
      {currentStep >= 8 && <Labels text="Rough ER is a possible translation surface" target={[3.65, -1.95, -0.35]} position={[2.6, -2.55, 0]} visible={showTranslationContext && currentStep === 8} />}
      {currentStep >= 8 && <EnzymeLabel text="initiation factors" position={[2.15, -1.18, 0.2]} />}
      {currentStep >= 10 && <TRNA position={[3.05, 1.1, 0.1]} anticodon="UAC" amino="Met" labelSide="left" />}
      {currentStep >= 10 && <TRNA position={[4.66, 1.02, -0.15]} anticodon="CUU" amino="Glu" color="#f3c969" labelSide="right" />}
      {currentStep >= 10 && <Labels text="tRNA anticodons pair with mRNA codons" target={[3.25, 0.82, 0.1]} position={[2.2, 2.35, 0]} visible={showTRNAContext} />}
      {currentStep >= 11 && <EnzymeLabel text="elongation factors use GTP" position={[2.25, 1.82, 0.2]} />}
      {currentStep >= 11 && <Labels text="Polypeptide chain grows from amino acids" target={[3.92, 1.72, 0]} position={[5.25, 2.55, 0]} visible={showPolypeptideContext} />}
      {currentStep >= 13 && <EnzymeLabel text="release factor recognizes stop codon" position={[5.28, 0.08, 0.2]} />}
      {currentStep >= 14 && <EnzymeLabel text="chaperones assist protein folding" position={[5.45, 2.34, 0.1]} />}
        {currentStep >= 12 && <Labels text="Stop codon recruits a release factor, not tRNA" target={[4.75, -1.23, 0]} position={[5.75, -0.7, 0]} visible={labelsVisible && currentStep >= 12 && currentStep <= 13} />}
      </group>
    </group>
  );
}

function RoughEndoplasmicReticulum({ position }) {
  return (
    <ClickableMesh name="Rough endoplasmic reticulum" labelPosition={[0, 0.72, 0]}>
      <group position={position} rotation={[0.08, 0, -0.08]}>
        {[-0.42, 0, 0.42].map((offset, index) => (
          <mesh key={offset} position={[0, offset, index * 0.035]} castShadow>
            <boxGeometry args={[1.65, 0.06, 0.34]} />
            <meshStandardMaterial color="#315b76" transparent opacity={0.66} roughness={0.38} />
          </mesh>
        ))}
        {[-0.62, -0.22, 0.18, 0.58].map((x) => (
          <mesh key={x} position={[x, 0.52, 0.2]} castShadow>
            <sphereGeometry args={[0.055, 12, 10]} />
            <meshStandardMaterial color="#8aa3ff" roughness={0.42} />
          </mesh>
        ))}
        <WhiteTextPlate text="rough ER" position={[0, -0.76, 0.24]} width={0.62} />
      </group>
    </ClickableMesh>
  );
}

function NucleusChannels() {
  const channels = [
    [-1.4, 2.0, 0.95],
    [-3.35, 1.58, -0.85],
    [-0.55, 0.18, -1.1],
    [-3.85, -0.25, 0.75]
  ];
  return channels.map((position, index) => (
    <ClickableMesh key={index} name="Nuclear pore complex" interactive={false}>
      <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.035, 10, 24]} />
        <meshStandardMaterial color="#d8cfbd" emissive="#9ec9b2" emissiveIntensity={0.08} roughness={0.36} />
      </mesh>
    </ClickableMesh>
  ));
}

function MRNAProcessing({ position, mode, currentStep, sequence }) {
  if (mode === 'simple') {
    return (
      <group position={position}>
        <ProcessedMrnaStrand sequence={sequence} mature={currentStep >= 6} />
        <Labels text={currentStep >= 6 ? 'mature mRNA' : 'pre-mRNA'} target={[0, 0.05, 0]} position={[0, 0.9, 0]} visible />
        <EnzymeLabel text="spliceosome + capping enzymes" position={[0, -0.7, 0.1]} />
      </group>
    );
  }
  const segments = [
    ['Exon 1', '#47d4ff', -1.36],
    ['Intron', '#ff7b93', -0.66],
    ['Exon 2', '#47d4ff', 0.08],
    ['Intron', '#ff7b93', 0.82],
    ['Exon 3', '#47d4ff', 1.56]
  ];
  return (
    <ClickableMesh name="mRNA processing" labelPosition={[0, 0.75, 0]}>
      <group position={position}>
        {segments.map(([label, color, x], index) => (
          <group key={index} position={[x, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.58, 0.18, 0.14]} />
              <meshStandardMaterial color={color} transparent opacity={label === 'Intron' ? (currentStep >= 6 ? 0.16 : 0.48) : 0.92} roughness={0.46} />
            </mesh>
            <WhiteTextPlate text={label} position={[0, 0.38, 0.05]} width={0.52} />
          </group>
        ))}
        {currentStep >= 6 && <ProcessedMrnaStrand sequence={sequence} mature position={[0.2, -0.55, 0.16]} />}
        <WhiteTextPlate
          text={currentStep >= 6 ? 'mature mRNA: cap + spliced exons + poly-A tail' : 'pre-mRNA: exons and introns'}
          position={[0.2, -0.9, 0.08]}
          width={2.35}
        />
        <EnzymeLabel text="5' capping enzyme" position={[-1.62, 0.88, 0.08]} />
        <EnzymeLabel text="spliceosome removes introns" position={[0.05, 1.02, 0.08]} />
        <EnzymeLabel text="poly-A polymerase" position={[1.72, 0.88, 0.08]} />
      </group>
    </ClickableMesh>
  );
}

function ProcessedMrnaStrand({ sequence = 'AUGGAAUUU', mature = false, position = [0, 0, 0], highlightStartCodon = false }) {
  const bases = (sequence || 'AUGGAAUUU').replace(/T/g, 'U').slice(0, 9).padEnd(9, 'A').split('');
  const startCodonIndex = bases.join('').indexOf('AUG');
  const showStartCodon = highlightStartCodon && startCodonIndex >= 0 && startCodonIndex <= bases.length - 3;
  const startCodonCenterX = startCodonIndex * 0.24 - 0.67;
  return (
    <group position={position}>
      {mature && <EndMarker text="5' cap" position={[-1.55, 0, 0]} color="#f3c969" />}
      {showStartCodon && (
        <mesh position={[startCodonCenterX, 0.14, -0.035]} castShadow>
          <boxGeometry args={[0.72, 0.62, 0.035]} />
          <meshStandardMaterial color="#f3c969" emissive="#f3c969" emissiveIntensity={0.08} transparent opacity={0.34} depthWrite={false} />
        </mesh>
      )}
      {bases.map((base, index) => (
        <group key={`${base}-${index}`} position={[index * 0.24 - 0.96, 0, 0]}>
          {index > 0 && <ConnectorSegment from={[-0.15, -0.02, 0]} to={[-0.04, -0.02, 0]} />}
          <RnaNucleotideUnit base={base} />
        </group>
      ))}
      {mature && (
        <>
          {['A', 'A', 'A', 'A'].map((base, index) => (
            <group key={index} position={[1.32 + index * 0.18, 0, 0]}>
              {index > 0 && <ConnectorSegment from={[-0.12, -0.02, 0]} to={[-0.04, -0.02, 0]} />}
              <RnaNucleotideUnit base={base} compact />
            </group>
          ))}
          <WhiteTextPlate text="poly-A tail" position={[1.72, -0.22, 0.08]} width={0.74} />
        </>
      )}
    </group>
  );
}

function MatureMrnaExport({ position, sequence }) {
  return (
    <group position={position}>
      <ProcessedMrnaStrand sequence={sequence} mature />
      <WhiteTextPlate text="mature mRNA" position={[0, 0.5, 0.08]} width={0.86} />
    </group>
  );
}

function TranslationComplex({ position, sequence, currentStep }) {
  const folded = currentStep >= 14;
  const mrna = (sequence || 'AUGGAAUUU').replace(/T/g, 'U').slice(0, 9).padEnd(9, 'A');
  const startBaseIndex = mrna.indexOf('AUG');
  const hasVisibleStartCodon = startBaseIndex >= 0 && startBaseIndex <= 6;
  const startCodonCenterX = hasVisibleStartCodon ? startBaseIndex * 0.24 - 0.67 : -0.67;
  const showInitiation = currentStep >= 9;
  return (
    <group position={position}>
      <ProcessedMrnaStrand sequence={sequence} mature position={[0, -0.22, 0.08]} highlightStartCodon={showInitiation} />
      <RibosomeClamp />
      {showInitiation && hasVisibleStartCodon && (
        <>
          <InitiatorTRNA position={[startCodonCenterX, 0.88, 0.74]} />
          <WhiteTextPlate text="AUG start codon" position={[startCodonCenterX, -1.1, 0.76]} width={1.02} />
        </>
      )}
      {currentStep >= 11 && <ProteinChain position={[0.2, 1.58, 0.1]} folded={folded} />}
      <WhiteTextPlate text="mRNA threaded through ribosome" position={[0, -0.74, 0.14]} width={1.78} />
    </group>
  );
}

function InitiatorTRNA({ position }) {
  return (
    <group position={position} scale={0.72}>
      <mesh position={[0, 0.06, 0]} rotation={[0, 0, 0.42]} castShadow>
        <torusGeometry args={[0.26, 0.04, 12, 32, Math.PI * 1.45]} />
        <meshStandardMaterial color="#55d7c7" emissive="#55d7c7" emissiveIntensity={0.08} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0.48, 0.03]} castShadow>
        <sphereGeometry args={[0.13, 18, 18]} />
        <meshStandardMaterial color="#f3c969" emissive="#f3c969" emissiveIntensity={0.08} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.28, 0.02]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.34, 10]} />
        <meshStandardMaterial color="#d8fbff" roughness={0.34} />
      </mesh>
      <WhiteTextPlate text="Met" position={[0, 0.74, 0.12]} width={0.38} />
      <WhiteTextPlate text="UAC anticodon" position={[0, -0.34, 0.12]} width={0.88} />
    </group>
  );
}

function RibosomeClamp() {
  return (
    <ClickableMesh name="Ribosome">
      <group>
        <mesh position={[0, 0.32, 0]} castShadow>
          <sphereGeometry args={[0.72, 32, 20]} />
          <meshStandardMaterial color="#8aa3ff" roughness={0.42} />
        </mesh>
        <mesh position={[0, -0.34, 0]} castShadow>
          <sphereGeometry args={[0.54, 32, 20]} />
          <meshStandardMaterial color="#6a82da" roughness={0.45} />
        </mesh>
        <mesh position={[0, -0.04, 0.12]}>
          <boxGeometry args={[1.55, 0.22, 0.12]} />
          <meshStandardMaterial color="#071015" transparent opacity={0.38} />
        </mesh>
        <WhiteTextPlate text="large subunit" position={[0, 1.28, 0.72]} width={0.82} />
        <WhiteTextPlate text="small subunit" position={[0, -1.18, 0.72]} width={0.82} />
      </group>
    </ClickableMesh>
  );
}

function EndMarker({ text, position, color }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.2, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <WhiteTextPlate text={text} position={[0, 0.27, 0.08]} width={text.length > 5 ? 0.56 : 0.42} />
    </group>
  );
}

function ConnectorSegment({ from, to }) {
  const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
  return (
    <mesh position={mid} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.018, 0.018, Math.abs(to[0] - from[0]), 8]} />
      <meshStandardMaterial color="#d8fbff" />
    </mesh>
  );
}

function RnaNucleotideUnit({ base, compact = false }) {
  const color = RNA_COLORS[base] || RNA_COLORS.U;
  const scale = compact ? 0.82 : 1;
  return (
    <group scale={scale}>
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
      <WhiteTextPlate text={base} position={[0.05, 0.36, 0.08]} width={0.22} height={0.18} fontSize={0.085} />
    </group>
  );
}

function WhiteTextPlate({ text, position, width = 0.6, height = 0.24, fontSize = 0.09 }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[width, height, 0.055]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.03} roughness={0.38} depthTest={false} />
      </mesh>
      <Text position={[0, 0.01, 0.04]} fontSize={fontSize} color="#071015" anchorX="center" anchorY="middle" maxWidth={width - 0.06} material-depthTest={false}>
        {text}
      </Text>
    </group>
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
