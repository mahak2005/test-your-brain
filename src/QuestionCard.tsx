import React from 'react'

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
}

export default function QuestionCard({ question, selectedOption, onSelect, currentIndex, total }: QuestionCardProps) {
    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="bg-white rounded-xl shadow p-6 sm:p-8">
                <div className="mb-2 text-sm text-gray-500">Question {currentIndex + 1} of {total}</div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">{question.question}</h2>

                <div className="grid gap-3">
                    {question.options.map((opt) => {
                        const isSelected = selectedOption === opt
                        return (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => onSelect(opt)}
                                className={
                                    `text-left w-full px-4 py-3 rounded-lg border transition-colors ` +
                                    (isSelected
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50')
                                }
                            >
                                {opt}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


