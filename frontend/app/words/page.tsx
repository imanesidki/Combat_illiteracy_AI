"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, CheckCircle, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function WordsPage() {
  const [currentWord, setCurrentWord] = useState(0)
  const [completedWords, setCompletedWords] = useState<number[]>([])

  const dailyWords = [
    { arabic: "مرحبا", darija: "أهلان", category: "greetings" },
    { arabic: "شكرا", darija: "بارك الله فيك", category: "greetings" },
    { arabic: "ماء", darija: "الما", category: "basic" },
    { arabic: "خبز", darija: "الخبز", category: "food" },
    { arabic: "بيت", darija: "الدار", category: "basic" },
    { arabic: "أسرة", darija: "العائلة", category: "family" },
    { arabic: "صديق", darija: "الصاحب", category: "social" },
    { arabic: "طعام", darija: "الماكلة", category: "food" },
  ]

  const playWordSound = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = "ar-MA"
    utterance.rate = 0.7
    speechSynthesis.speak(utterance)
  }

  const markAsCompleted = () => {
    if (!completedWords.includes(currentWord)) {
      setCompletedWords([...completedWords, currentWord])
    }
  }

  const nextWord = () => {
    if (currentWord < dailyWords.length - 1) {
      setCurrentWord(currentWord + 1)
    }
  }

  const prevWord = () => {
    if (currentWord > 0) {
      setCurrentWord(currentWord - 1)
    }
  }

  const resetProgress = () => {
    // Reset function can be used for other purposes if needed
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              العودة
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">الكلمات اليومية</h1>
          <div className="text-sm text-gray-600">
            {currentWord + 1} من {dailyWords.length}
          </div>
        </div>

        {/* Main Word Display */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm mb-8">
            <CardContent className="p-12 text-center">
              <div className="w-64 h-64 mx-auto mb-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex flex-col items-center justify-center shadow-2xl">
                <span className="text-6xl text-white font-bold mb-4">{dailyWords[currentWord].arabic}</span>
                <div className="text-white text-lg opacity-80">{dailyWords[currentWord].darija}</div>
              </div>

              <div className="space-y-4 mb-8">
                <Button
                  onClick={() => playWordSound(dailyWords[currentWord].arabic)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Volume2 className="w-6 h-6 mr-2" />
                  استمع للكلمة
                </Button>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={prevWord}
                  disabled={currentWord === 0}
                  variant="outline"
                  className="px-6 py-3 rounded-xl"
                >
                  السابق
                </Button>

                <Button onClick={resetProgress} variant="outline" className="px-6 py-3 rounded-xl">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  إعادة
                </Button>

                <Button
                  onClick={markAsCompleted}
                  className={`px-6 py-3 rounded-xl ${
                    completedWords.includes(currentWord)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {completedWords.includes(currentWord) ? "مكتمل" : "أتقنت الكلمة"}
                </Button>

                <Button
                  onClick={nextWord}
                  disabled={currentWord === dailyWords.length - 1}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl"
                >
                  التالي
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progress Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dailyWords.map((word, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  index === currentWord
                    ? "ring-4 ring-blue-400 shadow-lg"
                    : completedWords.includes(index)
                      ? "bg-green-100 border-green-300"
                      : "hover:shadow-md"
                }`}
                onClick={() => {
                  setCurrentWord(index)
                }}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-gray-800 mb-2">{word.arabic}</div>
                  <div className="text-sm text-gray-600 mb-2">{word.darija}</div>
                  {completedWords.includes(index) && <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
