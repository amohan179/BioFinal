import { Text as DreiText } from '@react-three/drei';
import ClickableMesh from './ClickableMesh';

function Text(props) {
  return <DreiText {...props} color="#050505" fontWeight={700} />;
}

export default function Ribosome({ position = [0, 0, 0], scale = 1 }) {
  return (
    <ClickableMesh name="Ribosome" labelPosition={[0, 1.0, 0]}>
      <group position={position} scale={scale}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.72, 32, 20]} />
          <meshStandardMaterial color="#8aa3ff" roughness={0.42} />
        </mesh>
        <mesh position={[0, -0.28, 0]} castShadow>
          <sphereGeometry args={[0.58, 32, 20]} />
          <meshStandardMaterial color="#6a82da" roughness={0.45} />
        </mesh>
        <mesh position={[0, -0.03, 0.04]}>
          <boxGeometry args={[1.42, 0.22, 0.18]} />
          <meshStandardMaterial color="#071015" transparent opacity={0.36} />
        </mesh>
        {['E', 'P', 'A'].map((site, index) => (
          <group key={site} position={[(index - 1) * 0.36, -0.04, 0.16]}>
            <mesh>
              <boxGeometry args={[0.24, 0.16, 0.035]} />
              <meshStandardMaterial color={site === 'A' ? '#f3c969' : '#0d1820'} transparent opacity={0.82} />
            </mesh>
            <TextPlate text={site} position={[0, 0.02, 0.06]} width={0.18} height={0.14} fontSize={0.07} />
          </group>
        ))}
        <TextPlate text="large subunit" position={[0, 1.16, 0.72]} width={0.82} />
        <TextPlate text="small subunit" position={[0, -1.04, 0.72]} width={0.82} />
      </group>
    </ClickableMesh>
  );
}

function TextPlate({ text, position, width = 0.6, height = 0.22, fontSize = 0.085 }) {
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
