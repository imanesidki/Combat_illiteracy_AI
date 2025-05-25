"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, CheckCircle, Shuffle } from "lucide-react"
import Link from "next/link"

export default function SentencesPage() {
  const [currentSentence, setCurrentSentence] = useState(0)
  const [completedSentences, setCompletedSentences] = useState<number[]>([])

  const sentences = [
    {
      arabic: "أنا أحب أسرتي",
      darija: "أنا كنحب عائلتي",
      type: "family",
    },
    {
      arabic: "هذا بيتي الجميل",
      darija: "هادي داري الزوينة",
      type: "description",
    },
    {
      arabic: "أريد أن آكل",
      darija: "بغيت ناكل",
      type: "needs",
    },
    {
      arabic: "الطقس جميل اليوم",
      darija: "الجو زوين اليوم",
      type: "weather",
    },
    {
      arabic: "أين المدرسة؟",
      darija: "فين المدرسة؟",
      type: "questions",
    },
    {
      arabic: "شكرا لك كثيرا",
      darija: "بارك الله فيك بزاف",
      type: "gratitude",
    },
  ]

  const playSentenceSound = (sentence: string) => {
    const utterance = new SpeechSynthesisUtterance(sentence)
    utterance.lang = "ar-MA"
    utterance.rate = 0.6
    speechSynthesis.speak(utterance)
  }

  const markAsCompleted = () => {
    if (!completedSentences.includes(currentSentence)) {
      setCompletedSentences([...completedSentences, currentSentence])
    }
  }

  const nextSentence = () => {
    if (currentSentence < sentences.length - 1) {
      setCurrentSentence(currentSentence + 1)
    }
  }

  const prevSentence = () => {
    if (currentSentence > 0) {
      setCurrentSentence(currentSentence - 1)
    }
  }

  const randomSentence = () => {
    const randomIndex = Math.floor(Math.random() * sentences.length)
    setCurrentSentence(randomIndex)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              العودة
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">تعلم الجمل</h1>
          <div className="text-sm text-gray-600">
            {currentSentence + 1} من {sentences.length}
          </div>
        </div>

        {/* Main Sentence Display */}
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm mb-8">
            <CardContent className="p-12 text-center">
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl p-8 mb-8 shadow-2xl">
                <div className="text-white mb-6">
                  <div className="text-sm opacity-80 mb-2">الفصحى</div>
                  <div className="text-3xl font-bold mb-4">{sentences[currentSentence].arabic}</div>
                  <div className="text-sm opacity-80 mb-2">الدارجة</div>
                  <div className="text-2xl">{sentences[currentSentence].darija}</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => playSentenceSound(sentences[currentSentence].arabic)}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Volume2 className="w-5 h-5 mr-2" />
                    الفصحى
                  </Button>

                  <Button
                    onClick={() => playSentenceSound(sentences[currentSentence].darija)}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Volume2 className="w-5 h-5 mr-2" />
                    الدارجة
                  </Button>
                </div>
              </div>

              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  onClick={prevSentence}
                  disabled={currentSentence === 0}
                  variant="outline"
                  className="px-6 py-3 rounded-xl"
                >
                  السابق
                </Button>

                <Button onClick={randomSentence} variant="outline" className="px-6 py-3 rounded-xl">
                  <Shuffle className="w-4 h-4 mr-2" />
                  عشوائي
                </Button>

                <Button
                  onClick={markAsCompleted}
                  className={`px-6 py-3 rounded-xl ${
                    completedSentences.includes(currentSentence)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {completedSentences.includes(currentSentence) ? "مكتمل" : "أتقنت الجملة"}
                </Button>

                <Button
                  onClick={nextSentence}
                  disabled={currentSentence === sentences.length - 1}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl"
                >
                  التالي
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progress Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sentences.map((sentence, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  index === currentSentence
                    ? "ring-4 ring-purple-400 shadow-lg"
                    : completedSentences.includes(index)
                      ? "bg-green-100 border-green-300"
                      : "hover:shadow-md"
                }`}
                onClick={() => {
                  setCurrentSentence(index)
                }}
              >
                <CardContent className="p-4">
                  <div className="text-lg font-bold text-gray-800 mb-2 text-right">{sentence.arabic}</div>
                  <div className="text-sm text-gray-600 mb-2 text-right">{sentence.darija}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-purple-600 capitalize bg-purple-100 px-2 py-1 rounded">
                      {sentence.type}
                    </span>
                    {completedSentences.includes(index) && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
