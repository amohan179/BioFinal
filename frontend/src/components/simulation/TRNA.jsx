import { Text as DreiText } from '@react-three/drei';
import ClickableMesh from './ClickableMesh';

function Text(props) {
  return <DreiText {...props} color="#050505" fontWeight={700} />;
}

export default function TRNA({ position = [0, 0, 0], anticodon = 'UAC', amino = 'Met', color = '#ff7b93', labelSide = 'right' }) {
  const side = labelSide === 'left' ? -1 : 1;
  return (
    <ClickableMesh name="tRNA" label={`tRNA anticodon ${anticodon}`} labelPosition={[0, 0.9, 0]}>
      <group position={position}>
        <mesh position={[0, 0.18, 0]} rotation={[0, 0, 0.4]}>
          <torusGeometry args={[0.28, 0.045, 12, 32, Math.PI * 1.45]} />
          <meshStandardMaterial color="#55d7c7" />
        </mesh>
        <mesh position={[0, 0.62, 0]} castShadow>
          <sphereGeometry args={[0.15, 18, 18]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.42, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.42, 10]} />
          <meshStandardMaterial color="#d8fbff" />
        </mesh>
        <TextPlate text={amino} position={[side * 0.5, 0.9, 0.14]} width={0.42} />
        <TextPlate text={anticodon} position={[side * 0.5, -0.34, 0.14]} width={0.44} />
        <TextPlate text="amino acid" position={[side * 0.92, 0.58, 0.14]} width={0.68} fontSize={0.075} />
        <TextPlate text="anticodon" position={[side * 0.92, -0.08, 0.14]} width={0.62} fontSize={0.075} />
      </group>
    </ClickableMesh>
  );
}

function TextPlate({ text, position, width = 0.6, height = 0.22, fontSize = 0.09 }) {
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
