// import React from 'react'

export type Question = {
    question: string
    options: string[]
    answer: string
}

type QuestionCardProps = {
    question: Question
    selectedOption: string | null
    onSelect: (option: string) => void
    currentIndex: number
    total: number
    showFeedback?: boolean
}

export default function QuestionCard({ question, selectedOption, onSelect, currentIndex, total, showFeedback = false }: QuestionCardProps) {
    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="bg-white rounded-xl shadow p-6 sm:p-8">
                <div className="mb-2 text-sm text-gray-500">Question {currentIndex + 1} of {total}</div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">{question.question}</h2>

                <div className="grid gap-3">
                    {question.options.map((opt) => {
                        const isSelected = selectedOption === opt
                        const isCorrect = opt === question.answer
                        const isWrong = isSelected && !isCorrect

                        let buttonClass = 'text-left w-full px-4 py-3 rounded-lg border transition-colors '

                        if (showFeedback) {
                            if (isCorrect) {
                                buttonClass += 'bg-green-600 text-white border-green-600'
                            } else if (isWrong) {
                                buttonClass += 'bg-red-600 text-white border-red-600'
                            } else if (isSelected) {
                                buttonClass += 'bg-gray-400 text-white border-gray-400'
                            } else {
                                buttonClass += 'bg-gray-100 text-gray-500 border-gray-200'
                            }
                        } else {
                            buttonClass += isSelected
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                        }

                        return (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => !showFeedback && onSelect(opt)}
                                disabled={showFeedback}
                                className={buttonClass}
                            >
                                {opt}
                            </button>
                        )
                    })}
                </div>

                {showFeedback && selectedOption && (
                    <div className="mt-4 p-3 rounded-lg bg-gray-50">
                        {selectedOption === question.answer ? (
                            <div className="text-green-700 font-medium">✓ Correct!</div>
                        ) : (
                            <div className="text-red-700">
                                <div className="font-medium">✗ Incorrect</div>
                                <div className="text-sm mt-1">Correct answer: <span className="font-medium">{question.answer}</span></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}


