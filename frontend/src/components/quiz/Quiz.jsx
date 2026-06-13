import { useMemo, useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Radio, RadioGroup } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronsUpDown, RotateCcw } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { useSimulationStore } from '../../store/simulationStore';

export default function Quiz() {
  const { quizIndex, quizScore, quizCompleted, advanceQuiz, resetQuiz } = useSimulationStore();
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const question = QUIZ_QUESTIONS[quizIndex] || QUIZ_QUESTIONS[0];

  const rendered = useMemo(() => renderQuestion(question, answer, setAnswer), [question, answer]);

  function submit() {
    if (!String(answer).trim()) return;
    const correct = isCorrect(question, answer);
    setFeedback({ correct, explanation: question.explanation });
  }

  function next() {
    advanceQuiz(Boolean(feedback?.correct), QUIZ_QUESTIONS.length);
    setAnswer('');
    setFeedback(null);
  }

  if (quizCompleted) {
    return (
      <motion.section id="quiz" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-5">
        <h2 className="text-xl font-semibold text-white">Quiz Results</h2>
        <p className="mt-2 text-slate-300">Score: {quizScore} / {QUIZ_QUESTIONS.length}</p>
        <button type="button" className="mt-4 touch-target inline-flex items-center gap-2 rounded-md bg-cyanBio px-4 font-semibold text-ink transition hover:bg-cyan-200 active:scale-[0.98]" onClick={resetQuiz}>
          <RotateCcw size={18} aria-hidden="true" />
          Retry quiz
        </button>
      </motion.section>
    );
  }

  return (
    <motion.section id="quiz" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyanBio">{question.difficulty} · {question.type}</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Question {quizIndex + 1}</h2>
        </div>
        <span className="rounded-md border border-line bg-panel2 px-2 py-1 text-sm text-slate-300">Score {quizScore}</span>
      </div>
      <p className="mt-4 text-lg text-slate-100">{question.prompt}</p>
      <div className="mt-4">{rendered}</div>
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`mt-4 rounded-md border p-3 text-sm ${feedback.correct ? 'border-greenBio/50 bg-greenBio/10 text-green-100' : 'border-roseBio/50 bg-roseBio/10 text-rose-100'}`}
          >
            <p className="font-semibold">{feedback.correct ? 'Correct' : 'Not quite'}</p>
            <p className="mt-1">{feedback.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-4 flex gap-2">
        {!feedback ? (
          <button
            type="button"
            className="touch-target rounded-md bg-cyanBio px-4 font-semibold text-ink transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
            onClick={submit}
            disabled={!String(answer).trim()}
          >
            Submit
          </button>
        ) : (
          <button type="button" className="touch-target rounded-md bg-cyanBio px-4 font-semibold text-ink transition hover:bg-cyan-200 active:scale-[0.98]" onClick={next}>Next</button>
        )}
        <button type="button" className="control px-4 transition active:scale-[0.98]" onClick={resetQuiz}>Reset</button>
      </div>
    </motion.section>
  );
}

function renderQuestion(question, answer, setAnswer) {
  if (question.type === 'multiple' || question.type === 'label') {
    return (
      <RadioGroup value={answer} onChange={setAnswer} className="grid gap-2 sm:grid-cols-2" aria-label={question.prompt}>
        {question.choices.map((choice) => (
          <Radio key={choice} value={choice} className="headless-option text-left">
            {choice}
          </Radio>
        ))}
      </RadioGroup>
    );
  }
  if (question.type === 'ordering') {
    return (
      <div>
        <p className="mb-2 text-sm text-slate-400">Type the steps separated by commas.</p>
        <input
          className="control w-full px-3"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder={question.items.join(', ')}
          aria-label="Ordered steps separated by commas"
        />
      </div>
    );
  }
  if (question.type === 'matching') {
    return (
      <div>
        <p className="mb-2 text-sm text-slate-400">Choose the role for RNA polymerase.</p>
        <Listbox value={answer} onChange={setAnswer}>
          <div className="relative">
            <ListboxButton className="control flex w-full items-center justify-between gap-3 px-3 text-left" aria-label="Choose the role for RNA polymerase">
              <span>{answer || 'Select role'}</span>
              <ChevronsUpDown size={16} aria-hidden="true" />
            </ListboxButton>
            <ListboxOptions anchor="bottom" className="z-40 mt-1 w-[var(--button-width)] rounded-md border border-line bg-panel p-1 text-sm text-slate-100 shadow-2xl focus:outline-none">
              {question.pairs.map((pair) => (
                <ListboxOption key={pair[1]} value={pair[1]} className="cursor-pointer rounded px-3 py-2 data-[focus]:bg-panel2">
                  {pair[1]}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    );
  }
  return (
    <input
      className="control w-full px-3 font-mono"
      value={answer}
      onChange={(event) => setAnswer(event.target.value)}
      placeholder="Enter answer"
      aria-label={question.prompt}
    />
  );
}

function isCorrect(question, answer) {
  const normalized = String(answer).trim().toUpperCase();
  if (question.type === 'ordering') {
    const submitted = normalized.split(',').map((item) => item.trim()).filter(Boolean);
    const expected = question.answer.map((item) => item.toUpperCase());
    return submitted.length === expected.length && submitted.every((item, index) => item === expected[index]);
  }
  if (question.type === 'matching') return answer === 'Builds RNA';
  return normalized === String(question.answer).trim().toUpperCase();
}
