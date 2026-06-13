import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Atom, Database, ExternalLink, LoaderCircle, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { MOLECULAR_STRUCTURES } from '../../data/molecularStructures';
import { getStructureAnalysis, getStructureCoordinates } from '../../utils/api';

export default function MolecularInspector({ primary = false }) {
  const viewerElement = useRef(null);
  const viewerRef = useRef(null);
  const molRef = useRef(null);
  const [structureId, setStructureId] = useState('1BNA');
  const [analysis, setAnalysis] = useState(null);
  const [selectedAtom, setSelectedAtom] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const structure = useMemo(() => MOLECULAR_STRUCTURES.find((item) => item.id === structureId), [structureId]);

  useEffect(() => {
    let cancelled = false;
    let currentViewer;

    async function loadStructure() {
      setStatus('loading');
      setError('');
      setAnalysis(null);
      setSelectedAtom(null);
      try {
        const [$3DmolModule, coordinateResult] = await Promise.all([
          import('3dmol'),
          getStructureCoordinates(structureId, structure.format)
        ]);
        if (cancelled || !viewerElement.current) return;

        const $3Dmol = $3DmolModule.default || $3DmolModule;
        molRef.current = $3Dmol;
        currentViewer = $3Dmol.createViewer(viewerElement.current, {
          backgroundColor: '#101612',
          antialias: true
        });
        viewerRef.current = currentViewer;
        currentViewer.addModel(coordinateResult.coordinates, coordinateResult.format);
        currentViewer.setClickable({}, true, (atom) => {
          highlightSelectedAtom(currentViewer, atom);
          setSelectedAtom({
            atom: atom.atom,
            element: atom.elem,
            chain: atom.chain || 'blank'
          });
        });
        applyStickStyle(currentViewer);
        addContextLabels(currentViewer, structureId, coordinateResult.coordinates);
        currentViewer.zoomTo();
        currentViewer.render();
        const nextAnalysis = await getStructureAnalysis(structureId, coordinateResult.coordinates, coordinateResult.format);
        if (!cancelled) {
          setAnalysis(nextAnalysis);
          setStatus('ready');
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError.message || 'Unable to load molecular structure.');
          setStatus('error');
        }
      }
    }

    loadStructure();
    return () => {
      cancelled = true;
      currentViewer?.clear();
      viewerRef.current = null;
    };
  }, [structureId, structure.format]);

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;
      const tagName = target?.tagName?.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target?.isContentEditable) return;
      const step = event.shiftKey ? 72 : 42;
      const actions = {
        ArrowLeft: () => moveViewer(-step, 0),
        a: () => moveViewer(-step, 0),
        ArrowRight: () => moveViewer(step, 0),
        d: () => moveViewer(step, 0),
        ArrowUp: () => moveViewer(0, -step),
        w: () => moveViewer(0, -step),
        ArrowDown: () => moveViewer(0, step),
        s: () => moveViewer(0, step),
        '=': () => zoomViewer(1.22),
        '+': () => zoomViewer(1.22),
        '-': () => zoomViewer(0.82),
        _: () => zoomViewer(0.82)
      };
      const action = actions[event.key];
      if (!action) return;
      event.preventDefault();
      action();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function selectStructure(event) {
    const nextId = event.target.value;
    setStructureId(nextId);
  }

  function moveViewer(x, y) {
    viewerRef.current?.translate(x, y);
    viewerRef.current?.render();
  }

  function zoomViewer(factor) {
    viewerRef.current?.zoom(factor);
    viewerRef.current?.render();
  }

  return (
    <section className="overflow-hidden rounded-lg border border-[#d8cfbd]/18 bg-[#151c17]/94 shadow-[0_18px_44px_rgba(0,0,0,0.28)]" aria-label="Atomic structure inspector">
      <div className="border-b border-[#d8cfbd]/15 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#f2eadb]">
              <Atom size={19} className="text-[#b7dbc4]" aria-hidden="true" />
              <h2 className="text-base font-semibold">Atomic Structure Inspector</h2>
            </div>
            <p className="mt-1 text-xs leading-5 text-[#c9c4b7]">Real PDB coordinates rendered with 3Dmol.js. Click an atom to inspect it.</p>
          </div>
          <a
            href={`https://www.rcsb.org/structure/${structureId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded border border-[#d8cfbd]/20 px-2 py-1 text-xs text-[#d8cfbd] transition hover:border-[#d8cfbd]/50"
          >
            RCSB {structureId}
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        </div>

        <div className="mt-3">
          <select value={structureId} onChange={selectStructure} className="control min-w-0 px-3 text-sm" aria-label="Choose molecular structure">
            {MOLECULAR_STRUCTURES.map((item) => (
              <option key={item.id} value={item.id}>{item.category}: {item.name} ({item.id})</option>
            ))}
          </select>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#c9c4b7]">{structure.description}</p>
      </div>

      <div className={`relative bg-[#101612] ${primary ? 'h-[72vh] min-h-[680px] xl:h-[calc(100vh-186px)]' : 'h-[560px]'}`}>
        <div ref={viewerElement} className="absolute inset-0" />
        {status === 'loading' && (
          <div className="absolute inset-0 grid place-items-center bg-[#101612]/88 text-sm text-[#d8efe0]">
            <span className="inline-flex items-center gap-2"><LoaderCircle className="animate-spin" size={18} /> Loading PDB structure...</span>
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-rose-200">{error}</div>
        )}
        <button
          type="button"
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded border border-[#d8cfbd]/20 bg-[#101612]/82 text-[#f2eadb] backdrop-blur transition hover:border-[#d8cfbd]/50"
          onClick={() => {
            viewerRef.current?.zoomTo();
            viewerRef.current?.render();
          }}
          aria-label="Reset atomic structure camera"
          title="Reset atomic structure camera"
        >
          <RotateCcw size={16} aria-hidden="true" />
        </button>
        <div className="absolute left-3 top-3 grid grid-cols-3 gap-1 rounded-md border border-[#d8cfbd]/20 bg-[#101612]/78 p-1 backdrop-blur" aria-label="Molecular camera movement controls">
          <span />
          <ViewerButton label="Move up" onClick={() => moveViewer(0, -42)} icon={ArrowUp} />
          <ViewerButton label="Zoom in" onClick={() => zoomViewer(1.22)} icon={ZoomIn} />
          <ViewerButton label="Move left" onClick={() => moveViewer(-42, 0)} icon={ArrowLeft} />
          <ViewerButton label="Move down" onClick={() => moveViewer(0, 42)} icon={ArrowDown} />
          <ViewerButton label="Move right" onClick={() => moveViewer(42, 0)} icon={ArrowRight} />
          <span />
          <ViewerButton label="Zoom out" onClick={() => zoomViewer(0.82)} icon={ZoomOut} />
          <span />
        </div>
        <div className="absolute bottom-3 left-3 rounded-md border border-[#d8cfbd]/20 bg-[#101612]/78 px-3 py-2 text-xs text-[#d8cfbd] backdrop-blur">
          Drag to rotate · WASD / arrows to move · scroll or +/- to zoom
        </div>
      </div>

      <div className="grid gap-3 border-t border-[#d8cfbd]/15 p-4 lg:grid-cols-[1fr_1.1fr]">
        <AnalysisSummary analysis={analysis} />
        <AtomSelection atom={selectedAtom} />
      </div>
    </section>
  );
}

function applyStickStyle(viewer) {
  viewer.removeAllSurfaces();
  viewer.setStyle({}, {});
  viewer.setStyle({}, { stick: { colorscheme: 'Jmol', radius: 0.2 } });
}

function highlightSelectedAtom(viewer, atom) {
  applyStickStyle(viewer);
  viewer.addStyle({ serial: atom.serial }, {
    sphere: {
      color: '#ffdf5d',
      radius: 0.62
    },
    stick: {
      color: '#ffdf5d',
      radius: 0.28
    }
  });
  viewer.render();
}

function addContextLabels(viewer, structureId, structureText) {
  viewer.removeAllLabels();
  const labelStyle = {
    backgroundColor: '#151c17',
    fontColor: '#f2eadb',
    borderColor: '#d8cfbd'
  };
  if (structureId === '1BNA') {
    const positions = getDnaLabelPositions(structureText);
    viewer.addLabel('DNA double helix', { position: positions.helix, fontSize: 14, ...labelStyle });
    viewer.addLabel('sugar-phosphate backbone', { position: positions.backbone, fontSize: 12, ...labelStyle });
    viewer.addLabel('base pairs', { position: positions.basePairs, fontSize: 12, ...labelStyle });
  }
  if (structureId === '1CRN') {
    viewer.addLabel('protein chain', { position: { x: 0, y: 0, z: 0 }, fontSize: 14, ...labelStyle });
  }
  if (structureId === '1EHZ') {
    viewer.addLabel('folded tRNA', { position: { x: 0, y: 0, z: 0 }, fontSize: 14, ...labelStyle });
  }
  if (structureId === '4V6X') {
    viewer.addLabel('ribosome complex', { position: { x: 0, y: 0, z: 0 }, fontSize: 14, ...labelStyle });
  }
}

function getDnaLabelPositions(pdbText = '') {
  const atoms = parsePdbAtoms(pdbText);
  if (!atoms.length) {
    return {
      helix: { x: 0, y: 13, z: 0 },
      backbone: { x: 11, y: 3, z: 1 },
      basePairs: { x: -8, y: -5, z: 1 }
    };
  }

  const bounds = getBounds(atoms);
  const center = {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
    z: (bounds.minZ + bounds.maxZ) / 2
  };
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const labelOffset = Math.max(width, height) * 0.08;

  const backboneAtoms = atoms.filter((atom) => isBackboneAtom(atom.name));
  const rightBackboneAtom = findOutermostAtom(backboneAtoms, center) || {
    x: bounds.maxX,
    y: center.y,
    z: center.z
  };

  return {
    helix: {
      x: center.x,
      y: bounds.maxY + labelOffset,
      z: center.z
    },
    backbone: {
      x: rightBackboneAtom.x + labelOffset,
      y: rightBackboneAtom.y,
      z: rightBackboneAtom.z
    },
    basePairs: {
      x: bounds.minX - labelOffset,
      y: center.y - height * 0.18,
      z: center.z
    }
  };
}

function parsePdbAtoms(pdbText) {
  return pdbText
    .split('\n')
    .filter((line) => line.startsWith('ATOM  ') || line.startsWith('HETATM'))
    .map((line) => ({
      name: line.slice(12, 16).trim(),
      x: Number.parseFloat(line.slice(30, 38)),
      y: Number.parseFloat(line.slice(38, 46)),
      z: Number.parseFloat(line.slice(46, 54))
    }))
    .filter((atom) => Number.isFinite(atom.x) && Number.isFinite(atom.y) && Number.isFinite(atom.z));
}

function getBounds(atoms) {
  return atoms.reduce((bounds, atom) => ({
    minX: Math.min(bounds.minX, atom.x),
    maxX: Math.max(bounds.maxX, atom.x),
    minY: Math.min(bounds.minY, atom.y),
    maxY: Math.max(bounds.maxY, atom.y),
    minZ: Math.min(bounds.minZ, atom.z),
    maxZ: Math.max(bounds.maxZ, atom.z)
  }), {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
    minZ: Infinity,
    maxZ: -Infinity
  });
}

function findOutermostAtom(atoms, center) {
  return atoms.reduce((outermost, atom) => {
    if (!outermost) return atom;
    const atomDistance = Math.hypot(atom.x - center.x, atom.z - center.z);
    const outermostDistance = Math.hypot(outermost.x - center.x, outermost.z - center.z);
    return atomDistance > outermostDistance ? atom : outermost;
  }, null);
}

function isBackboneAtom(atomName) {
  return atomName === 'P'
    || atomName.startsWith('OP')
    || atomName === 'O1P'
    || atomName === 'O2P'
    || atomName.includes("'");
}

function ViewerButton({ label, onClick, icon: Icon }) {
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

function AnalysisSummary({ analysis }) {
  if (!analysis) return <div className="text-sm text-[#c9c4b7]">Molecular analysis loads with the structure.</div>;
  const metrics = [
    ['Atoms', analysis.atom_count],
    ['Chains', analysis.chain_count]
  ];
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold text-[#f2eadb]">
        <Database size={16} className="text-[#b7dbc4]" aria-hidden="true" />
        Molecular analysis
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded border border-[#d8cfbd]/14 bg-[#101612] px-2 py-1.5">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#9f9b91]">{label}</p>
            <p className="mt-0.5 font-mono text-sm text-[#d8efe0]">{value ?? 'n/a'}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-[#9f9b91]">Analysis source: {analysis.source}</p>
    </div>
  );
}

function AtomSelection({ atom }) {
  return (
    <div className="rounded border border-[#d8cfbd]/14 bg-[#101612] p-3">
      <h3 className="text-sm font-semibold text-[#f2eadb]">Selected atom</h3>
      {!atom ? (
        <p className="mt-2 text-xs leading-5 text-[#c9c4b7]">Click an atom in the molecular viewer to inspect and highlight it.</p>
      ) : (
        <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
          <AtomFact label="Atom" value={atom.atom} />
          <AtomFact label="Element" value={atom.element} />
          <AtomFact label="Chain" value={atom.chain} />
        </dl>
      )}
    </div>
  );
}

function AtomFact({ label, value }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.12em] text-[#9f9b91]">{label}</dt>
      <dd className="mt-0.5 font-mono text-[#d8efe0]">{value}</dd>
    </div>
  );
}
