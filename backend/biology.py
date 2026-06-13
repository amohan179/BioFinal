CODON_TABLE = {
    "UUU": {"short": "Phe", "name": "Phenylalanine", "className": "nonpolar"},
    "UUC": {"short": "Phe", "name": "Phenylalanine", "className": "nonpolar"},
    "UUA": {"short": "Leu", "name": "Leucine", "className": "nonpolar"},
    "UUG": {"short": "Leu", "name": "Leucine", "className": "nonpolar"},
    "UCU": {"short": "Ser", "name": "Serine", "className": "polar"},
    "UCC": {"short": "Ser", "name": "Serine", "className": "polar"},
    "UCA": {"short": "Ser", "name": "Serine", "className": "polar"},
    "UCG": {"short": "Ser", "name": "Serine", "className": "polar"},
    "UAU": {"short": "Tyr", "name": "Tyrosine", "className": "polar"},
    "UAC": {"short": "Tyr", "name": "Tyrosine", "className": "polar"},
    "UAA": {"short": "Stop", "name": "Stop codon", "className": "stop", "stop": True},
    "UAG": {"short": "Stop", "name": "Stop codon", "className": "stop", "stop": True},
    "UGU": {"short": "Cys", "name": "Cysteine", "className": "polar"},
    "UGC": {"short": "Cys", "name": "Cysteine", "className": "polar"},
    "UGA": {"short": "Stop", "name": "Stop codon", "className": "stop", "stop": True},
    "UGG": {"short": "Trp", "name": "Tryptophan", "className": "nonpolar"},
    "CUU": {"short": "Leu", "name": "Leucine", "className": "nonpolar"},
    "CUC": {"short": "Leu", "name": "Leucine", "className": "nonpolar"},
    "CUA": {"short": "Leu", "name": "Leucine", "className": "nonpolar"},
    "CUG": {"short": "Leu", "name": "Leucine", "className": "nonpolar"},
    "CCU": {"short": "Pro", "name": "Proline", "className": "nonpolar"},
    "CCC": {"short": "Pro", "name": "Proline", "className": "nonpolar"},
    "CCA": {"short": "Pro", "name": "Proline", "className": "nonpolar"},
    "CCG": {"short": "Pro", "name": "Proline", "className": "nonpolar"},
    "CAU": {"short": "His", "name": "Histidine", "className": "positive"},
    "CAC": {"short": "His", "name": "Histidine", "className": "positive"},
    "CAA": {"short": "Gln", "name": "Glutamine", "className": "polar"},
    "CAG": {"short": "Gln", "name": "Glutamine", "className": "polar"},
    "CGU": {"short": "Arg", "name": "Arginine", "className": "positive"},
    "CGC": {"short": "Arg", "name": "Arginine", "className": "positive"},
    "CGA": {"short": "Arg", "name": "Arginine", "className": "positive"},
    "CGG": {"short": "Arg", "name": "Arginine", "className": "positive"},
    "AUU": {"short": "Ile", "name": "Isoleucine", "className": "nonpolar"},
    "AUC": {"short": "Ile", "name": "Isoleucine", "className": "nonpolar"},
    "AUA": {"short": "Ile", "name": "Isoleucine", "className": "nonpolar"},
    "AUG": {"short": "Met", "name": "Methionine", "className": "start", "start": True},
    "ACU": {"short": "Thr", "name": "Threonine", "className": "polar"},
    "ACC": {"short": "Thr", "name": "Threonine", "className": "polar"},
    "ACA": {"short": "Thr", "name": "Threonine", "className": "polar"},
    "ACG": {"short": "Thr", "name": "Threonine", "className": "polar"},
    "AAU": {"short": "Asn", "name": "Asparagine", "className": "polar"},
    "AAC": {"short": "Asn", "name": "Asparagine", "className": "polar"},
    "AAA": {"short": "Lys", "name": "Lysine", "className": "positive"},
    "AAG": {"short": "Lys", "name": "Lysine", "className": "positive"},
    "AGU": {"short": "Ser", "name": "Serine", "className": "polar"},
    "AGC": {"short": "Ser", "name": "Serine", "className": "polar"},
    "AGA": {"short": "Arg", "name": "Arginine", "className": "positive"},
    "AGG": {"short": "Arg", "name": "Arginine", "className": "positive"},
    "GUU": {"short": "Val", "name": "Valine", "className": "nonpolar"},
    "GUC": {"short": "Val", "name": "Valine", "className": "nonpolar"},
    "GUA": {"short": "Val", "name": "Valine", "className": "nonpolar"},
    "GUG": {"short": "Val", "name": "Valine", "className": "nonpolar"},
    "GCU": {"short": "Ala", "name": "Alanine", "className": "nonpolar"},
    "GCC": {"short": "Ala", "name": "Alanine", "className": "nonpolar"},
    "GCA": {"short": "Ala", "name": "Alanine", "className": "nonpolar"},
    "GCG": {"short": "Ala", "name": "Alanine", "className": "nonpolar"},
    "GAU": {"short": "Asp", "name": "Aspartic acid", "className": "negative"},
    "GAC": {"short": "Asp", "name": "Aspartic acid", "className": "negative"},
    "GAA": {"short": "Glu", "name": "Glutamic acid", "className": "negative"},
    "GAG": {"short": "Glu", "name": "Glutamic acid", "className": "negative"},
    "GGU": {"short": "Gly", "name": "Glycine", "className": "nonpolar"},
    "GGC": {"short": "Gly", "name": "Glycine", "className": "nonpolar"},
    "GGA": {"short": "Gly", "name": "Glycine", "className": "nonpolar"},
    "GGG": {"short": "Gly", "name": "Glycine", "className": "nonpolar"},
}

RNA_FROM_TEMPLATE = {"A": "U", "T": "A", "C": "G", "G": "C"}
RNA_COMPLEMENT = {"A": "U", "U": "A", "C": "G", "G": "C"}


def clean_sequence(sequence: str) -> str:
    return "".join(sequence.upper().split())


def group_codons(sequence: str) -> list[str]:
    return [sequence[i:i + 3] for i in range(0, len(sequence), 3) if sequence[i:i + 3]]


def validate_sequence(sequence: str, molecule: str = "dna") -> dict:
    cleaned = clean_sequence(sequence)
    allowed = set("ATCG") if molecule == "dna" else set("AUCG")
    invalid = sorted(set(base for base in cleaned if base not in allowed))
    warnings = []
    if not cleaned:
        warnings.append("Enter a sequence to begin.")
    if len(cleaned) % 3 != 0:
        warnings.append("The sequence has an incomplete codon at the end.")
    return {"cleaned": cleaned, "valid": bool(cleaned) and not invalid, "invalid": invalid, "warnings": warnings}


def transcribe(sequence: str, strand_type: str = "coding") -> dict:
    validation = validate_sequence(sequence, "dna")
    cleaned = validation["cleaned"]
    if strand_type == "template":
        mrna = "".join(RNA_FROM_TEMPLATE.get(base, "") for base in cleaned)
    else:
        mrna = cleaned.replace("T", "U")
    return {"dna": cleaned, "mrna": mrna, "warnings": validation["warnings"], "valid": validation["valid"]}


def anticodon_for(codon: str) -> str:
    return "".join(RNA_COMPLEMENT.get(base, "?") for base in codon)


def translate(sequence: str) -> dict:
    mrna = clean_sequence(sequence).replace("T", "U")
    codons = group_codons(mrna)
    warnings = []
    if len(mrna) % 3 != 0:
        warnings.append("The mRNA has extra bases that do not make a complete codon.")
    start_index = codons.index("AUG") if "AUG" in codons else -1
    if start_index == -1:
        warnings.append("No AUG start codon was found in this reading frame.")
    protein = []
    started = False
    for index, codon in enumerate(codons):
        entry = CODON_TABLE.get(codon)
        if not entry:
            protein.append({"codon": codon, "aminoAcid": "Unknown", "short": "?", "anticodon": anticodon_for(codon), "index": index})
            continue
        if codon == "AUG":
            started = True
        if started:
            protein.append({
                "codon": codon,
                "aminoAcid": entry["name"],
                "short": entry["short"],
                "stop": bool(entry.get("stop")),
                "start": bool(entry.get("start")),
                "anticodon": "No tRNA" if entry.get("stop") else anticodon_for(codon),
                "index": index,
            })
            if entry.get("stop"):
                break
    if not any(item.get("stop") for item in protein):
        warnings.append("No stop codon was reached after the first AUG.")
    return {"mrna": mrna, "codons": codons, "protein": protein, "warnings": warnings, "startIndex": start_index}


def full_process(sequence: str, strand_type: str = "coding") -> dict:
    transcription = transcribe(sequence, strand_type)
    translation = translate(transcription["mrna"])
    invalid = validate_sequence(sequence, "dna")["invalid"]
    warnings = transcription["warnings"] + translation["warnings"]
    if invalid:
        warnings.insert(0, f"Invalid DNA character(s): {', '.join(invalid)}")
    return {
        "source": "backend",
        "dna": transcription["dna"],
        "mrna": transcription["mrna"],
        "codons": translation["codons"],
        "protein": translation["protein"],
        "warnings": warnings,
        "valid": transcription["valid"] and not invalid,
        "strandType": strand_type,
    }
