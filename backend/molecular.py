from collections import Counter
from io import StringIO
import ssl
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

import certifi
from Bio.PDB import MMCIFParser, PDBParser
from Bio.PDB.Polypeptide import is_aa

RCSB_STRUCTURE_URL = "https://files.rcsb.org/download/{pdb_id}.{file_format}"
STRUCTURE_FORMATS = {
    "1BNA": "pdb",
    "1EHZ": "pdb",
    "1CRN": "pdb",
    "4V6X": "cif",
}


def fetch_structure_text(pdb_id: str) -> tuple[str, str]:
    normalized = pdb_id.upper()
    file_format = STRUCTURE_FORMATS.get(normalized)
    if not file_format:
        raise ValueError("Structure is not available in this classroom dataset.")

    request = Request(
        RCSB_STRUCTURE_URL.format(pdb_id=normalized, file_format=file_format),
        headers={"User-Agent": "CentralDogmaLab/1.0"},
    )
    try:
        with urlopen(request, timeout=12, context=ssl.create_default_context(cafile=certifi.where())) as response:
            return response.read().decode("utf-8"), file_format
    except (HTTPError, URLError, TimeoutError) as error:
        raise RuntimeError(f"Unable to fetch {normalized} from RCSB PDB.") from error


def analyze_structure_text(pdb_id: str, structure_text: str, file_format: str) -> dict:
    parser = MMCIFParser(QUIET=True) if file_format == "cif" else PDBParser(QUIET=True)
    structure = parser.get_structure(pdb_id, StringIO(structure_text))
    models = list(structure.get_models())
    chains = list(structure.get_chains())
    residues = list(structure.get_residues())
    atoms = list(structure.get_atoms())
    standard_residues = [residue for residue in residues if residue.id[0] == " "]
    amino_acids = [residue for residue in standard_residues if is_aa(residue, standard=True)]
    nucleotides = [
        residue
        for residue in standard_residues
        if residue.resname.strip() in {"A", "C", "G", "U", "DA", "DC", "DG", "DT", "DU"}
    ]
    heteroatoms = [atom for residue in residues if residue.id[0] != " " for atom in residue]
    elements = Counter((atom.element or atom.name[0]).strip().upper() for atom in atoms)

    return {
        "source": "biopython",
        "pdb_id": pdb_id.upper(),
        "format": file_format,
        "model_count": len(models),
        "chain_count": len(chains),
        "residue_count": len(standard_residues),
        "amino_acid_count": len(amino_acids),
        "nucleotide_count": len(nucleotides),
        "atom_count": len(atoms),
        "heteroatom_count": len(heteroatoms),
        "elements": dict(elements.most_common(8)),
    }
