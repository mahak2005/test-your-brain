// import React from 'react'
import type { Question } from './QuestionCard'

type Result = {
    question: string
    correctAnswer: string
    userAnswer: string | null
}

type ResultPageProps = {
    questions: Question[]
    userAnswers: (string | null)[]
    onRestart: () => void
}

export default function ResultPage({ questions, userAnswers, onRestart }: ResultPageProps) {
    const results: Result[] = questions.map((q, idx) => ({
        question: q.question,
        correctAnswer: q.answer,
        userAnswer: userAnswers[idx] ?? null,
    }))

    const score = results.reduce((sum, r) => sum + (r.userAnswer === r.correctAnswer ? 1 : 0), 0)

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow p-6 sm:p-8">
                <div className="flex items-baseline justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Your Results</h2>
                    <div className="text-sm text-gray-600">Score: <span className="font-semibold">{score}</span> / {questions.length}</div>
                </div>

                <ul className="space-y-4">
                    {results.map((r, idx) => {
                        const isCorrect = r.userAnswer === r.correctAnswer
                        return (
                            <li key={idx} className="border border-gray-200 rounded-lg p-4">
                                <div className="font-medium text-gray-900 mb-2">{idx + 1}. {r.question}</div>
                                <div className="text-sm">
                                    <div className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                                        Your answer: {r.userAnswer ?? '—'} {isCorrect ? '✓' : '✕'}
                                    </div>
                                    {!isCorrect && (
                                        <div className="text-gray-700">Correct answer: <span className="font-medium">{r.correctAnswer}</span></div>
                                    )}
                                </div>
                            </li>
                        )
                    })}
                </ul>

                <div className="mt-6">
                    <button onClick={onRestart} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                        Restart Quiz
                    </button>
                </div>
            </div>
        </div>
    )
}


