import { useSimulationStore } from '../../store/simulationStore';

export default function ClickableMesh({ name, children, interactive = true }) {
  const { setSelectedStructure } = useSimulationStore();
  if (!interactive) return <group>{children}</group>;

  return (
    <group
      onClick={(event) => {
        event.stopPropagation();
        setSelectedStructure(name);
      }}
    >
      {children}
    </group>
  );
}
