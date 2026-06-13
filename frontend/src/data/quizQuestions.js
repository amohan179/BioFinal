export const QUIZ_QUESTIONS = [
  {
    id: 'rna-base',
    type: 'multiple',
    difficulty: 'foundational',
    prompt: 'Which base is found in RNA instead of thymine?',
    choices: ['Uracil', 'Adenine', 'Guanine', 'Cytosine'],
    answer: 'Uracil',
    explanation: 'RNA uses uracil (U), while DNA uses thymine (T).'
  },
  {
    id: 'template-pair',
    type: 'missing-base',
    difficulty: 'ap',
    prompt: 'If the DNA template base is A, which RNA base is added?',
    answer: 'U',
    explanation: 'RNA is complementary to the template strand, so DNA A pairs with RNA U.'
  },
  {
    id: 'order',
    type: 'ordering',
    difficulty: 'ap',
    prompt: 'Place the eukaryotic steps in order.',
    items: ['DNA unwinds', 'Transcription', 'mRNA processing', 'Nuclear export', 'Translation'],
    answer: ['DNA unwinds', 'Transcription', 'mRNA processing', 'Nuclear export', 'Translation'],
    explanation: 'Eukaryotic transcription and mRNA processing occur before mature mRNA exits the nucleus.'
  },
  {
    id: 'anticodon',
    type: 'anticodon',
    difficulty: 'ap',
    prompt: 'What anticodon pairs with the mRNA codon AUG?',
    answer: 'UAC',
    explanation: 'Anticodons pair complementarily with codons: A with U, and G with C.'
  },
  {
    id: 'codon-aa',
    type: 'codon',
    difficulty: 'ap',
    prompt: 'Which amino acid is encoded by GAA?',
    answer: 'Glutamic acid',
    explanation: 'GAA encodes glutamic acid in the standard genetic code.'
  },
  {
    id: 'matching',
    type: 'matching',
    difficulty: 'foundational',
    prompt: 'What role belongs to RNA polymerase?',
    pairs: [
      ['RNA polymerase', 'Builds RNA'],
      ['Ribosome', 'Builds polypeptide'],
      ['tRNA', 'Carries amino acid'],
      ['Intron', 'Removed during splicing']
    ],
    explanation: 'These roles distinguish transcription, processing, and translation machinery.'
  },
  {
    id: 'label',
    type: 'label',
    difficulty: 'foundational',
    prompt: 'Which structure reads mRNA codons during translation?',
    choices: ['Ribosome', 'Nucleus', 'DNA backbone', 'RNA polymerase'],
    answer: 'Ribosome',
    explanation: 'The ribosome moves along mRNA and reads codons in groups of three.'
  },
  {
    id: 'prok-coupled',
    type: 'multiple',
    difficulty: 'ap',
    prompt: 'Why can prokaryotic transcription and translation be coupled?',
    choices: ['They lack a nucleus', 'They use thymine in RNA', 'They do not have ribosomes', 'They do not make proteins'],
    answer: 'They lack a nucleus',
    explanation: 'Without a nuclear envelope separating processes, ribosomes can translate mRNA as it is being transcribed.'
  }
];
