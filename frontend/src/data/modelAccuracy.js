export const MODEL_ACCURACY_NOTES = {
  eukaryote: {
    storage: [
      'Eukaryotic DNA is enclosed by a double nuclear envelope.',
      'Only a small gene region is shown; real chromosomes are much longer and packed with histones.'
    ],
    selection: [
      'Promoters are near transcription start sites, while enhancers can act from farther away.',
      'Transcription factors regulate polymerase recruitment instead of becoming part of the RNA product.'
    ],
    unwind: [
      'A local transcription bubble opens; the entire DNA molecule does not unzip.',
      'RNA polymerase reads the template strand while the coding strand matches the RNA sequence except T is replaced by U.'
    ],
    polymerase: [
      'RNA polymerase synthesizes RNA 5 prime to 3 prime and does not need a primer.',
      'The model separates coding and template strands so the direction of information flow is visible.'
    ],
    transcription: [
      'RNA uses ribonucleotides and uracil instead of thymine.',
      'The growing RNA strand remains antiparallel to the DNA template strand.'
    ],
    premrna: [
      'Pre-mRNA includes introns and exons before processing.',
      'The model shows a simplified transcript, not every regulatory RNA-binding protein.'
    ],
    processing: [
      "A 5' cap, splicing, and a poly-A tail are shown because these modifications support stability, export, and translation.",
      'Spliceosome action is represented as intron removal and exon joining.'
    ],
    export: [
      'Only processed mature mRNA is shown leaving through a nuclear pore complex.',
      'Translation is kept outside the nucleus to preserve the eukaryotic compartment boundary.'
    ],
    ribosome: [
      'Eukaryotic ribosomes have large and small subunits and contain rRNA catalytic activity.',
      'The mRNA channel and tRNA binding sites are simplified but positioned on the ribosome.'
    ],
    'translation-start': [
      'AUG establishes the reading frame and usually codes for methionine.',
      'Initiation factors help assemble the mRNA, ribosome, and initiator tRNA.'
    ],
    trna: [
      'Each tRNA is charged with an amino acid by an aminoacyl-tRNA synthetase before entering the ribosome.',
      'Anticodons pair with codons; stop codons are not matched by tRNA.'
    ],
    elongation: [
      'The ribosome forms peptide bonds using catalytic rRNA activity.',
      'Elongation factors use GTP during tRNA delivery and ribosome movement.'
    ],
    termination: [
      'Release factors recognize stop codons and trigger polypeptide release.',
      'Stop codons do not encode amino acids.'
    ],
    release: [
      'The released chain is a polypeptide; final function depends on folding and sometimes modification.',
      'The model shows primary-structure growth, not atomic-scale chemistry.'
    ],
    folding: [
      'Folding is illustrative, not a structure prediction.',
      'Chaperones can assist folding, but amino acid sequence remains the primary determinant.'
    ]
  },
  prokaryote: {
    storage: [
      'Bacterial DNA is shown in a nucleoid region without a nuclear envelope.',
      'The process view omits cell boundaries so transcription and translation appear in one open cytoplasmic space.'
    ],
    selection: [
      'Operons place multiple genes under shared regulatory control.',
      'The operator is a DNA site where repressors can block transcription.'
    ],
    unwind: [
      'RNA polymerase opens a local transcription bubble in the bacterial chromosome.',
      'No nucleus separates transcription from translation.'
    ],
    polymerase: [
      'Bacterial RNA polymerase begins at promoters with help from specificity factors such as sigma factors.',
      'The diagram keeps the enzyme simplified so strand use remains clear.'
    ],
    transcription: [
      'mRNA can begin interacting with ribosomes before transcription finishes.',
      'RNA is synthesized using complementary base pairing with U in place of T.'
    ],
    premrna: [
      'Bacteria usually do not use the same nucleus-dependent pre-mRNA processing shown for eukaryotes.',
      'The prokaryotic model emphasizes direct coupling to translation.'
    ],
    processing: [
      'Most bacterial mRNAs are not processed with a eukaryotic-style 5 prime cap, spliceosome, and poly-A tail before export.',
      'No nuclear export step is shown because bacteria lack a nucleus.'
    ],
    export: [
      'Prokaryotic mRNA stays in the cytoplasm.',
      'Ribosomes can bind the transcript while RNA polymerase is still transcribing it.'
    ],
    ribosome: [
      'Bacterial ribosomes are 70S particles made from 30S and 50S subunits.',
      'The ribosome is placed close to the growing transcript to show coupled expression.'
    ],
    'translation-start': [
      'AUG usually starts translation and sets the reading frame.',
      'Bacterial initiation is simplified; detailed Shine-Dalgarno positioning is not modeled.'
    ],
    trna: [
      'Charged tRNAs bring amino acids to ribosomal binding sites.',
      'Codon-anticodon pairing is shown as a classroom-scale representation.'
    ],
    elongation: [
      'Peptide bonds form as the ribosome advances codon by codon.',
      'GTP-powered elongation factors support tRNA delivery and translocation.'
    ],
    termination: [
      'Release factors recognize stop codons in the ribosomal A site.',
      'No tRNA carries an amino acid for UAA, UAG, or UGA.'
    ],
    release: [
      'The new polypeptide separates from the translation complex.',
      'The bacterial cell can translate many mRNAs at the same time; one transcript is shown for clarity.'
    ],
    folding: [
      'The folded shape is a teaching schematic, not a molecular dynamics result.',
      'Protein folding depends on sequence, interactions, and the cellular environment.'
    ]
  }
};
