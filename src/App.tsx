import { useEffect, useState } from 'react'
import QuestionCard, { type Question } from './QuestionCard'
import ResultPage from './ResultPage'

function shuffleArray<T>(array: T[]): T[] {
  const newArr = array.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

export default function App() {
  const [allQuestions, setAllQuestions] = useState<Question[] | null>(null)
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [answers, setAnswers] = useState<(string | null)[]>([])
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [numToAsk, setNumToAsk] = useState<number | null>(null)
  const [atStart, setAtStart] = useState(true)

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true)
        const res = await fetch('/questions.json')
        if (!res.ok) throw new Error('Failed to load questions')
        const data: Question[] = await res.json()
        const shuffled = data.map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }))
        setAllQuestions(shuffleArray(shuffled))
        setError(null)
      } catch (e: any) {
        setError(e?.message ?? 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [])

  function handleSelect(option: string) {
    setSelectedOption(option)
  }

  function handleNext() {
    if (!questions) return
    const updated = answers.slice()
    updated[currentIndex] = selectedOption
    setAnswers(updated)

    const nextIndex = currentIndex + 1
    if (nextIndex >= questions.length) {
      setCompleted(true)
    } else {
      setCurrentIndex(nextIndex)
      setSelectedOption(updated[nextIndex])
    }
  }

  function handleRestart() {
    // Return to start screen
    setCurrentIndex(0)
    setSelectedOption(null)
    setCompleted(false)
    setNumToAsk(null)
    setAtStart(true)
  }

  function handleStart() {
    if (!allQuestions || !numToAsk) return
    const pool = shuffleArray(
      allQuestions.map((q) => ({ ...q, options: shuffleArray(q.options) }))
    )
    const selected = pool.slice(0, Math.max(1, Math.min(numToAsk, pool.length)))
    setQuestions(selected)
    setAnswers(new Array(selected.length).fill(null))
    setCurrentIndex(0)
    setSelectedOption(null)
    setCompleted(false)
    setAtStart(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading questions…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!allQuestions) return null

  if (atStart) {
    const max = allQuestions.length
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow p-6 sm:p-8 space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">Start Quiz</h1>
          <label className="block text-sm font-medium text-gray-700">Number of questions</label>
          <input
            type="number"
            min={1}
            max={max}
            value={numToAsk ?? ''}
            onChange={(e) => setNumToAsk(Number(e.target.value))}
            placeholder={`1 - ${max}`}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleStart}
            disabled={!numToAsk || numToAsk < 1 || numToAsk > max}
            className={
              `w-full px-4 py-2 rounded-lg font-medium transition-colors ` +
              (numToAsk && numToAsk >= 1 && numToAsk <= max
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed')
            }
          >
            Start
          </button>
        </div>
      </main>
    )
  }

  if (completed && questions) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <ResultPage questions={questions} userAnswers={answers} onRestart={handleRestart} />
      </main>
    )
  }

  if (!questions) return null

  const currentQuestion = questions[currentIndex]

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="space-y-4 w-full max-w-xl">
        <QuestionCard
          question={currentQuestion}
          selectedOption={selectedOption}
          onSelect={handleSelect}
          currentIndex={currentIndex}
          total={questions.length}
        />

        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={selectedOption == null}
            className={
              `px-4 py-2 rounded-lg font-medium transition-colors ` +
              (selectedOption
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed')
            }
          >
            {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </main>
  )
}

