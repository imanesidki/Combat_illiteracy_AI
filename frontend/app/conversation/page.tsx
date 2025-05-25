"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mic, MicOff, Volume2, MessageCircle } from "lucide-react"
import Link from "next/link"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: any) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onerror: ((this: SpeechRecognition, ev: any) => any) | null
  start(): void
  stop(): void
}

export default function ConversationPage() {
  const [isListening, setIsListening] = useState(false)
  const [conversation, setConversation] = useState<Array<{ speaker: "user" | "ai"; text: string; darija?: string }>>([
    {
      speaker: "ai",
      text: "أهلاً وسهلاً! أنا هنا لمساعدتك في تعلم العربية. تحدث معي بالدارجة المغربية!",
      darija: "أهلان! أنا هنا باش نعاونك تتعلم العربية. هدر معايا بالدارجة!",
    },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition: any = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      recognition.lang = "ar-MA"
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setCurrentInput(transcript)
        handleUserInput(transcript)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognition.start()
    } else {
      alert("متصفحك لا يدعم التعرف على الصوت")
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const handleUserInput = (input: string) => {
    // Add user message
    setConversation((prev) => [...prev, { speaker: "user", text: input }])

    // Simulate AI response (in a real app, this would call an AI service)
    setTimeout(() => {
      const responses = [
        {
          text: "ممتاز! نطقك جيد جداً. هل تريد أن نتعلم كلمات جديدة؟",
          darija: "مزيان! النطق ديالك زوين بزاف. بغيتي نتعلمو كلمات جداد؟",
        },
        { text: "أحسنت! دعنا نتدرب على جملة أخرى.", darija: "برافو! يالاه نتمرنو على جملة أخرى." },
        { text: "رائع! أنت تتقدم بسرعة في تعلم العربية.", darija: "واعر! راك كتقدم بزربة في تعلم العربية." },
        { text: "جيد جداً! هل يمكنك أن تقول لي عن يومك؟", darija: "مزيان بزاف! واش تقدر تقول ليا على نهارك؟" },
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setConversation((prev) => [...prev, { speaker: "ai", ...randomResponse }])
    }, 1000)

    setCurrentInput("")
  }

  const playText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "ar-MA"
    utterance.rate = 0.7
    speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              العودة
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">هيا نتحدث</h1>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-orange-500" />
            <span className="text-sm text-gray-600">محادثة صوتية</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Conversation Area */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm mb-6 h-96 overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {conversation.map((message, index) => (
                  <div key={index} className={`flex ${message.speaker === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.speaker === "user"
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">{message.text}</div>
                      {message.darija && (
                        <div className="text-xs opacity-80 border-t border-white/20 pt-2 mt-2">{message.darija}</div>
                      )}
                      {message.speaker === "ai" && (
                        <Button
                          onClick={() => playText(message.text)}
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-6 px-2 text-xs hover:bg-gray-200"
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Voice Input Controls */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div
                  className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                    isListening
                      ? "bg-gradient-to-br from-red-400 to-red-600 animate-pulse"
                      : "bg-gradient-to-br from-orange-400 to-red-500 hover:scale-105"
                  }`}
                >
                  {isListening ? <MicOff className="w-16 h-16 text-white" /> : <Mic className="w-16 h-16 text-white" />}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">{isListening ? "أستمع إليك..." : "اضغط للتحدث"}</h3>

                <p className="text-gray-600 max-w-md mx-auto">
                  {isListening
                    ? "تحدث الآن بالدارجة المغربية وسأساعدك في تعلم العربية الفصحى"
                    : "اضغط على الميكروفون وتحدث معي بالدارجة المغربية. سأساعدك في تحسين عربيتك!"}
                </p>

                <div className="flex justify-center gap-4">
                  {!isListening ? (
                    <Button
                      onClick={startListening}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <Mic className="w-6 h-6 mr-2" />
                      ابدأ التحدث
                    </Button>
                  ) : (
                    <Button
                      onClick={stopListening}
                      variant="outline"
                      className="border-2 border-red-300 text-red-600 hover:bg-red-50 px-8 py-4 rounded-xl"
                    >
                      <MicOff className="w-6 h-6 mr-2" />
                      توقف
                    </Button>
                  )}
                </div>

                {currentInput && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                    <p className="text-orange-800 font-medium">سمعت: {currentInput}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-bold text-orange-800 mb-1">نصيحة</h4>
                <p className="text-sm text-orange-700">تحدث ببطء ووضوح</p>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🗣️</div>
                <h4 className="font-bold text-red-800 mb-1">تدرب</h4>
                <p className="text-sm text-red-700">كرر الكلمات والجمل</p>
              </CardContent>
            </Card>

            <Card className="bg-pink-50 border-pink-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">💪</div>
                <h4 className="font-bold text-pink-800 mb-1">استمر</h4>
                <p className="text-sm text-pink-700">التعلم يحتاج صبر</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
