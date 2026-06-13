import ClickableMesh from './ClickableMesh';
import { useSimulationStore } from '../../store/simulationStore';
import * as THREE from 'three';

const AMINO_COLORS = ['#7ee787', '#47d4ff', '#f3c969', '#ff7b93', '#b28cff', '#55d7c7'];

export default function ProteinChain({ position = [0, 0, 0], folded = false }) {
  const { sequenceResult, currentStep } = useSimulationStore();
  const protein = sequenceResult.protein.filter((item) => !item.stop);
  const count = Math.max(2, Math.min(protein.length || 5, currentStep >= 13 ? 10 : Math.max(2, currentStep - 8)));
  const beads = Array.from({ length: count }, (_, index) => protein[index] || { short: ['Met', 'Glu', 'Phe', 'Ala', 'Lys'][index % 5] });

  return (
    <ClickableMesh name={folded ? 'Folded protein' : 'Polypeptide chain'} labelPosition={[0, 0.85, 0]}>
      <group position={position}>
        {beads.map((aa, index) => {
          const x = folded ? Math.cos(index * 1.15) * 0.55 : index * 0.34 - beads.length * 0.17;
          const y = folded ? Math.sin(index * 0.9) * 0.38 : Math.sin(index * 0.8) * 0.12;
          const z = folded ? Math.sin(index * 1.4) * 0.32 : 0;
          return (
            <group key={`${aa.short}-${index}`}>
              {index > 0 && <Bond from={folded ? [Math.cos((index - 1) * 1.15) * 0.55, Math.sin((index - 1) * 0.9) * 0.38, Math.sin((index - 1) * 1.4) * 0.32] : [(index - 1) * 0.34 - beads.length * 0.17, Math.sin((index - 1) * 0.8) * 0.12, 0]} to={[x, y, z]} />}
              <mesh position={[x, y, z]} castShadow>
                <sphereGeometry args={[0.13, 20, 20]} />
                <meshStandardMaterial color={AMINO_COLORS[index % AMINO_COLORS.length]} />
              </mesh>
            </group>
          );
        })}
      </group>
    </ClickableMesh>
  );
}

function Bond({ from, to }) {
  const fromVector = new THREE.Vector3(...from);
  const toVector = new THREE.Vector3(...to);
  const mid = fromVector.clone().add(toVector).multiplyScalar(0.5);
  const direction = toVector.clone().sub(fromVector);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  return (
    <mesh position={mid.toArray()} quaternion={quaternion}>
      <cylinderGeometry args={[0.026, 0.026, direction.length(), 10]} />
      <meshStandardMaterial color="#d8fbff" />
    </mesh>
  );
}
