export const TIMELINE_STEPS = [
  { id: 0, title: 'DNA stored in cell', focus: 'dna', phase: 'storage' },
  { id: 1, title: 'Gene selected', focus: 'gene', phase: 'selection' },
  { id: 2, title: 'DNA unwinds', focus: 'unzip', phase: 'unwind' },
  { id: 3, title: 'RNA polymerase binds', focus: 'polymerase', phase: 'polymerase' },
  { id: 4, title: 'Transcription begins', focus: 'rna', phase: 'transcription' },
  { id: 5, title: 'Pre-mRNA forms', focus: 'premrna', phase: 'premrna' },
  { id: 6, title: 'mRNA processing occurs', focus: 'processing', phase: 'processing' },
  { id: 7, title: 'Mature mRNA exits nucleus', focus: 'export', phase: 'export' },
  { id: 8, title: 'Ribosome binds mRNA', focus: 'ribosome', phase: 'ribosome' },
  { id: 9, title: 'Translation begins at AUG', focus: 'start', phase: 'translation-start' },
  { id: 10, title: 'tRNA matches codons', focus: 'trna', phase: 'trna' },
  { id: 11, title: 'Amino acids join', focus: 'peptide', phase: 'elongation' },
  { id: 12, title: 'Stop codon is reached', focus: 'stop', phase: 'termination' },
  { id: 13, title: 'Polypeptide is released', focus: 'release', phase: 'release' },
  { id: 14, title: 'Protein folds', focus: 'protein', phase: 'folding' }
];

export const LESSON_TEXT = {
  storage: {
    quick: 'DNA stores genetic instructions in base sequences inside cells.',
    ap: 'A gene is a DNA sequence that can be transcribed into RNA. In eukaryotes, chromosomes are enclosed in the nucleus; in prokaryotes, DNA is found in a nucleoid region.',
    vocab: ['DNA', 'gene', 'regulatory DNA sequences', 'chromosome', 'nucleoid'],
    enzymes: [
      { name: 'No synthesis enzyme active yet', role: 'At this stage the model is showing information storage, not copying or translation.' }
    ],
    misconception: 'DNA is not directly converted into protein. RNA is an intermediate in the central dogma.',
    teacher: 'Use this step to separate genetic information from gene expression.'
  },
  selection: {
    quick: 'A gene region is selected for expression.',
    ap: 'Regulatory DNA sequences, including promoters and enhancers in eukaryotes, influence whether RNA polymerase can begin transcription. Activators can increase transcription, while repressors can reduce transcription.',
    vocab: ['gene expression', 'gene', 'promoter', 'enhancer', 'regulatory DNA sequences', 'activators', 'repressors'],
    enzymes: [
      { name: 'Transcription factors', role: 'Regulatory proteins, including activators and repressors, that affect RNA polymerase binding and transcription.' },
      { name: 'RNA polymerase', role: 'Enzyme that transcribes a DNA template into RNA.' }
    ],
    misconception: 'Cells do not express every gene at the same time.',
    teacher: 'Ask students why different cells with the same genome can make different proteins.'
  },
  unwind: {
    quick: 'The DNA strands separate locally near the gene.',
    ap: 'Transcription requires access to the template strand. The whole chromosome does not unzip; only a local transcription bubble opens.',
    vocab: ['template strand', 'coding strand', 'RNA polymerase', 'RNA nucleotides', 'transcription bubble'],
    enzymes: [
      { name: 'RNA polymerase', role: 'Opens a local transcription bubble while reading the DNA template strand.' }
    ],
    misconception: 'Transcription does not copy both strands of DNA.',
    teacher: 'Have students identify which strand is used as the template.'
  },
  polymerase: {
    quick: 'RNA polymerase binds and prepares to build RNA.',
    ap: 'RNA polymerase reads the DNA template strand and synthesizes RNA in a complementary sequence using ribonucleotides.',
    vocab: ['RNA polymerase', 'RNA nucleotides', 'ribonucleotide', 'promoter', 'no primer'],
    enzymes: [
      { name: 'RNA polymerase', role: "Builds RNA 5' to 3' from a DNA template." },
      { name: 'Transcription factors', role: 'Help regulate when RNA polymerase begins transcription.' }
    ],
    misconception: 'RNA polymerase is not a ribosome; it builds RNA, not protein. No primer is used in transcription or translation.'
  },
  transcription: {
    quick: 'RNA nucleotides are added one by one.',
    ap: 'DNA A pairs with RNA U, DNA T pairs with RNA A, DNA C pairs with RNA G, and DNA G pairs with RNA C. The mRNA resembles the coding strand except uracil replaces thymine.',
    vocab: ['mRNA', 'RNA nucleotides', 'uracil', 'complementary base pairing'],
    enzymes: [
      { name: 'RNA polymerase', role: 'Catalyzes bond formation as RNA nucleotides are added to the growing RNA strand.' }
    ],
    misconception: 'RNA uses U instead of T.'
  },
  premrna: {
    quick: 'In eukaryotes, the first RNA transcript is pre-mRNA.',
    ap: 'Pre-mRNA includes exons and introns. Before translation, eukaryotic transcripts are modified to improve stability, export, and translation.',
    vocab: ['pre-mRNA', 'RNA processing enzymes', '5’ capping enzymes', 'exons', 'introns'],
    enzymes: [
      { name: "5' capping enzymes", role: "Add and modify the 5' cap on eukaryotic pre-mRNA." },
      { name: 'Spliceosome', role: 'RNA-protein machine that removes introns and joins exons.' }
    ],
    misconception: 'The entire pre-mRNA sequence is not always translated.'
  },
  processing: {
    quick: 'Introns are removed, exons are joined, and ends are modified.',
    ap: "This model shows eukaryotic mRNA processing through splicing, a 5' cap, and a poly-A tail. These modifications produce mature mRNA before nuclear export.",
    vocab: ['spliceosome', 'introns', 'exons', "5' cap", 'poly-A tail', 'mature mRNA'],
    enzymes: [
      { name: 'Spliceosome', role: 'Catalyzes intron removal and exon joining in eukaryotic pre-mRNA.' },
      { name: "5' capping enzymes", role: 'Protect the RNA end and help later ribosome recognition.' },
      { name: 'Poly-A polymerase', role: "Adds adenine bases to the 3' end of the transcript." }
    ],
    misconception: 'Do not apply eukaryotic pre-mRNA processing to bacteria.'
  },
  export: {
    quick: 'Mature mRNA is exported from the nucleus to the cytoplasm.',
    ap: 'In eukaryotes, mature mRNA is exported to the cytoplasm where ribosomes translate it. In prokaryotes, there is no nucleus, so transcription and translation can be coupled.',
    vocab: ['nuclear envelope', 'mature mRNA', '5’ cap', 'cytoplasm'],
    enzymes: [
      { name: 'RNA export proteins', role: 'Help move properly processed mRNA into the cytoplasm.' }
    ]
  },
  ribosome: {
    quick: 'A ribosome binds the mRNA.',
    ap: 'Ribosomes are ribonucleoprotein complexes with small and large subunits. They read codons and catalyze peptide bond formation.',
    vocab: ['ribosome', 'rRNA', 'ribosomal subunits', 'large subunit', 'small subunit', 'mRNA codons'],
    enzymes: [
      { name: 'Ribosome / rRNA', role: 'A ribozyme-containing molecular machine with ribosomal subunits that positions mRNA and tRNAs.' },
      { name: 'Initiation factors', role: 'Help assemble the translation initiation complex at the start codon.' }
    ]
  },
  'translation-start': {
    quick: 'Translation commonly begins at AUG.',
    ap: 'AUG encodes methionine and usually establishes the reading frame. Codons are read in non-overlapping groups of three.',
    vocab: ['AUG', 'start codon', 'mRNA codons', 'ATP', 'GTP', 'initiation factors', 'reading frame'],
    enzymes: [
      { name: 'Initiation factors', role: 'Use GTP to help the ribosome, mRNA, and initiator tRNA assemble correctly.' }
    ],
    misconception: 'Changing the reading frame changes every downstream codon.'
  },
  trna: {
    quick: 'tRNA anticodons pair with mRNA codons.',
    ap: 'Each tRNA carries a specific amino acid and has an anticodon that pairs with an mRNA codon. Stop codons are recognized by release factors rather than tRNAs.',
    vocab: ['tRNA', 'anticodons', 'amino acids', 'mRNA codons', 'elongation factors', 'GTP'],
    enzymes: [
      { name: 'Elongation factors', role: 'Help deliver charged tRNAs and move the ribosome along mRNA.' }
    ]
  },
  elongation: {
    quick: 'Amino acids are linked by peptide bonds.',
    ap: 'The ribosome positions tRNAs so a peptide bond forms between amino acids, extending the polypeptide chain.',
    vocab: ['peptide bonds', 'polypeptide chain', 'rRNA', 'elongation factors', 'GTP'],
    enzymes: [
      { name: 'Elongation factors', role: 'Use GTP to help tRNA entry and ribosome translocation.' }
    ]
  },
  termination: {
    quick: 'A stop codon ends translation.',
    ap: 'UAA, UAG, and UGA are stop codons. They do not code for amino acids and trigger release of the polypeptide.',
    vocab: ['stop codons', 'release factors', 'termination', 'mRNA codons'],
    enzymes: [
      { name: 'Release factors', role: 'Recognize stop codons and trigger polypeptide release.' },
      { name: 'Ribosome', role: 'Stops adding amino acids when a stop codon is reached.' }
    ]
  },
  release: {
    quick: 'The completed polypeptide is released.',
    ap: 'The amino acid sequence is the primary structure of the protein. Additional folding and modification may occur after translation.',
    vocab: ['polypeptide chain', 'peptide bonds', 'protein'],
    enzymes: [
      { name: 'Release factors', role: 'Complete termination by freeing the polypeptide from the ribosome.' }
    ]
  },
  folding: {
    quick: 'The amino acid chain folds into a functional protein.',
    ap: 'Protein folding depends on amino acid sequence, interactions with water, charge, shape, chaperones, and cellular environment. This animation is illustrative, not predictive.',
    vocab: ['protein', 'protein folding', 'structure', 'function'],
    enzymes: [
      { name: 'Molecular chaperones', role: 'Help some proteins fold correctly; the amino acid sequence still determines the protein’s primary structure.' }
    ],
    misconception: 'This app does not predict real protein 3D structure from DNA.'
  }
};

export const COMPARISON = [
  ['Feature', 'Eukaryotes', 'Prokaryotes'],
  ['Nucleus', 'Present; transcription occurs inside it.', 'Absent; DNA is in a nucleoid region.'],
  ['mRNA processing', "Splicing and 5' cap before export.", 'Usually simpler; no nucleus-specific export step.'],
  ['Translation location', 'Cytoplasm or rough ER after mRNA export.', 'Cytoplasm, often while mRNA is still being transcribed.'],
  ['Coupling', 'Transcription and translation are separated by the nuclear envelope.', 'Transcription and translation can be coupled.']
];
