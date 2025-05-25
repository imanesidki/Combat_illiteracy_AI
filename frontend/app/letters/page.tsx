"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, Mic, MicOff, RotateCcw } from "lucide-react"
import Link from "next/link"

type LearningStep = "listen" | "repeat" | "recognize" | "write" | "completed"

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
  start(): void
  stop(): void
}

export default function LettersPage() {
  const currentLetterRef = useRef(0)
  const [, forceUpdate] = useState({})
  const [currentStep, setCurrentStep] = useState<LearningStep>("listen")
  const [isListening, setIsListening] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showCursor, setShowCursor] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [recognizedText, setRecognizedText] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const verificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const arabicLetters = [
    { letter: "أ", name: "ألف", sound: "alif", transcript: "الف" },
    { letter: "ب", name: "باء", sound: "ba", transcript: "باء" },
    { letter: "ت", name: "تاء", sound: "ta", transcript: "تاء" },
    { letter: "ث", name: "ثاء", sound: "tha", transcript: "ثاء" },
    { letter: "ج", name: "جيم", sound: "jim", transcript: "جيم" },
    { letter: "ح", name: "حاء", sound: "ha", transcript: "حاء" },
    { letter: "خ", name: "خاء", sound: "kha", transcript: "خاء" },
    { letter: "د", name: "دال", sound: "dal", transcript: "دال" },
    { letter: "ذ", name: "ذال", sound: "dhal", transcript: "ذال" },
    { letter: "ر", name: "راء", sound: "ra", transcript: "راء" },
    { letter: "ز", name: "زاي", sound: "zay", transcript: "زاي" },
    { letter: "س", name: "سين", sound: "sin", transcript: "سين" },
    { letter: "ش", name: "شين", sound: "shin", transcript: "شين" },
    { letter: "ص", name: "صاد", sound: "sad", transcript: "صاد" },
    { letter: "ض", name: "ضاد", sound: "dad", transcript: "ضاد" },
    { letter: "ط", name: "طاء", sound: "ta", transcript: "طاء" },
    { letter: "ظ", name: "ظاء", sound: "tha", transcript: "ظاء" },
    { letter: "ع", name: "عين", sound: "ain", transcript: "عين" },
    { letter: "غ", name: "غين", sound: "ghain", transcript: "غين" },
    { letter: "ف", name: "فاء", sound: "fa", transcript: "فاء" },
    { letter: "ق", name: "قاف", sound: "qaf", transcript: "قاف" },
    { letter: "ك", name: "كاف", sound: "kaf", transcript: "كاف" },
    { letter: "ل", name: "لام", sound: "lam", transcript: "لام" },
    { letter: "م", name: "ميم", sound: "meem", transcript: "ميم" },
    { letter: "ن", name: "نون", sound: "noon", transcript: "نون" },
    { letter: "ه", name: "هاء", sound: "ha", transcript: "هاء" },
    { letter: "و", name: "واو", sound: "wa", transcript: "واو" },
    { letter: "ي", name: "ياء", sound: "ya", transcript: "ياء" }
  ]

  const recognitionOptions = [
    arabicLetters[currentLetterRef.current].letter,
    arabicLetters[(currentLetterRef.current + 1) % arabicLetters.length].letter,
    arabicLetters[(currentLetterRef.current + 2) % arabicLetters.length].letter,
    arabicLetters[(currentLetterRef.current + 3) % arabicLetters.length].letter,
  ].sort(() => Math.random() - 0.5)

  const speakInDarija = (text: string, callback?: () => void) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "ar-MA"
    utterance.rate = 0.8
    utterance.onend = callback || null
    speechSynthesis.speak(utterance)
  }

  const showAnimatedCursor = (targetElement: string) => {
    setShowCursor(true)
    const element = document.querySelector(targetElement)
    if (element) {
      const rect = element.getBoundingClientRect()
      setCursorPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
      setTimeout(() => setShowCursor(false), 3000)
    }
  }

  const startListenStep = () => {
    setCurrentStep("listen")
    speakInDarija(`هاد هو الحرف ${arabicLetters[currentLetterRef.current].name}. اسمع مزيان`, () => {
      setTimeout(() => {
        speakInDarija("دَبَ اضغط على الزر باش تسمع الحرف", () => {
          showAnimatedCursor(".listen-button")
        })
      }, 1000)
    })
  }

  const playLetterSound = () => {
    const utterance = new SpeechSynthesisUtterance(arabicLetters[currentLetterRef.current].letter)
    utterance.lang = "ar-SA"
    utterance.rate = 0.7
    utterance.onend = () => {
      // Automatically progress to repeat step after sound finishes
      setTimeout(() => {
        setCurrentStep("repeat")
        speakInDarija("دابَ قل نفس الحرف. اضغط على الميكروفون وقل الحرف", () => {
          showAnimatedCursor(".repeat-button")
        })
      }, 1000)
    }
    speechSynthesis.speak(utterance)
  }

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
        setRecognizedText("")
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setRecognizedText(transcript)
        if (transcript.includes(arabicLetters[currentLetterRef.current].transcript)) {
          speakInDarija("برافو! نطقك صحيح", () => {
            setCurrentStep("recognize")
            setTimeout(() => {
              speakInDarija("دَبَا شوف الحرف وعرفو من بين الحروف الأخرى", () => {
                showAnimatedCursor(".recognition-grid")
              })
            }, 1000)
          })
        } else {
          speakInDarija("حاول مرة أخرى")
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    }
  }

  const handleLetterRecognition = (selectedLetter: string) => {
    if (selectedLetter === arabicLetters[currentLetterRef.current].letter) {
      speakInDarija("ممتاز! عرفت الحرف", () => {
        setCurrentStep("write")
        setTimeout(() => {
          speakInDarija("دَبَ كتب الحرف في المربع الأبيض", () => {
            showAnimatedCursor(".drawing-canvas")
          })
        }, 1000)
      })
    } else {
      speakInDarija("لا، هذا مَشِي الحرف الصحيح. حاول مرة أخرى")
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineWidth = 4
        ctx.lineCap = "round"
        ctx.strokeStyle = "#059669"
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.stroke()
      }
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const hasDrawing = imageData.data.some((pixel, index) => index % 4 === 3 && pixel > 0)

        if (hasDrawing) {
          if (verificationTimeoutRef.current) {
            clearTimeout(verificationTimeoutRef.current)
          }
          verificationTimeoutRef.current = setTimeout(() => {
            verifyDrawnLetter()
          }, 2000)
        }
      }
    }
  }

  const verifyDrawnLetter = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return

        // Create form data
        const formData = new FormData()
        formData.append('text', arabicLetters[currentLetterRef.current].letter)
        formData.append('image', blob, 'drawing.png')

        try {
          const response = await fetch('http://localhost:8000/verify-text', {
            method: 'POST',
            body: formData,
          })

          if (response.ok) {
            const result = await response.json()
            
            if (result.is_match === true || result.result === "لا") {
              // Letter is correct
              setTimeout(() => {
                speakInDarija("أحسنت! كتبت الحرف بشكل جيد", () => {
                  setCurrentStep("completed")
                  setTimeout(() => {
                    speakInDarija("مبروك! أتممت تعلم هذا الحرف. اضغط على التالي للحرف القادم", () => {
                      showAnimatedCursor(".next-button")
                    })
                  }, 1000)
                })
              }, 1000)
            } else {
              // Letter is incorrect
              speakInDarija("حاول مرة أخرى. الحرف ليس صحيحاً")
            }
          } else {
            // Fallback to simple check if API fails
            setTimeout(() => {
              speakInDarija("أحسنت! كتبت الحرف بشكل جيد", () => {
                setCurrentStep("completed")
                setTimeout(() => {
                  speakInDarija("مبروك! أتممت تعلم هذا الحرف. اضغط على التالي للحرف القادم", () => {
                    showAnimatedCursor(".next-button")
                  })
                }, 1000)
              })
            }, 1000)
          }
        } catch (error) {
          console.error('Error verifying letter:', error)
          // Fallback to simple check if API fails
          setTimeout(() => {
            speakInDarija("أحسنت! كتبت الحرف بشكل جيد", () => {
              setCurrentStep("completed")
              setTimeout(() => {
                speakInDarija("مبروك! أتممت تعلم هذا الحرف. اضغط على التالي للحرف القادم", () => {
                  showAnimatedCursor(".next-button")
                })
              }, 1000)
            })
          }, 1000)
        }
      }, 'image/png')
    } catch (error) {
      console.error('Error converting canvas to blob:', error)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    
    // Clear any pending verification timeout
    if (verificationTimeoutRef.current) {
      clearTimeout(verificationTimeoutRef.current)
      verificationTimeoutRef.current = null
    }
  }

  const nextLetter = () => {
    if (currentLetterRef.current < arabicLetters.length - 1) {
      currentLetterRef.current = currentLetterRef.current + 1
      forceUpdate({})
      setCurrentStep("listen")
      clearCanvas()
      setTimeout(() => startListenStep(), 500)
    }
  }

  const resetCurrentLetter = () => {
    setCurrentStep("listen")
    clearCanvas()
    setTimeout(() => startListenStep(), 500)
  }

  const stopAudio = () => {
    speechSynthesis.cancel();
  };

  useEffect(() => {
    startListenStep()
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Cursor */}
      {showCursor && (
        <div
          className="fixed z-50 pointer-events-none transition-all duration-1000 ease-in-out"
          style={{ left: cursorPosition.x, top: cursorPosition.y }}
        >
          <div className="relative">
            <div className="w-8 h-8 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute top-0 left-0 w-8 h-8 bg-red-600 rounded-full animate-pulse"></div>
            <div className="absolute top-2 left-2 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      )}

      {/* Moroccan Zellij Corner Patterns */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <pattern id="zellij-letters1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <polygon points="10,0 20,10 10,20 0,10" fill="#059669" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#zellij-letters1)" />
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <pattern id="zellij-letters2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="8" fill="#059669" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#zellij-letters2)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" onClick={stopAudio}>
            <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              العودة
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">الحروف العربية</h1>
          <div className="text-sm text-gray-600">
            {currentLetterRef.current + 1} من {arabicLetters.length}
          </div>
        </div>

        {/* Main Learning Area */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm mb-8">
            <CardContent className="p-12 text-center">
              {/* Letter Display */}
              <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-8xl text-white font-bold">{arabicLetters[currentLetterRef.current].letter}</span>
              </div>

              <h2 className="text-4xl font-bold text-gray-800 mb-8">{arabicLetters[currentLetterRef.current].name}</h2>

              {/* Step 1: Listen */}
              {currentStep === "listen" && (
                <div className="space-y-6">
                  <p className="text-xl text-gray-600 mb-6">اسمع الحرف واضغط على الزر</p>
                  <Button
                    onClick={playLetterSound}
                    className="listen-button bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Volume2 className="w-6 h-6 mr-2" />
                    اضغط للاستماع
                  </Button>
                </div>
              )}

              {/* Step 2: Repeat */}
              {currentStep === "repeat" && (
                <div className="space-y-6">
                  <p className="text-xl text-gray-600 mb-6">قل الحرف في الميكروفون</p>
                  <Button
                    onClick={startListening}
                    disabled={isListening}
                    className={`repeat-button px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    }`}
                  >
                    {isListening ? <MicOff className="w-6 h-6 mr-2" /> : <Mic className="w-6 h-6 mr-2" />}
                    {isListening ? "أستمع..." : "اضغط وقل الحرف"}
                  </Button>
                  {recognizedText && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg border-2 border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">سمعت:</p>
                      <p className="text-lg font-bold text-gray-800">{recognizedText}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Recognize */}
              {currentStep === "recognize" && (
                <div className="space-y-6">
                  <p className="text-xl text-gray-600 mb-6">اختر الحرف الصحيح</p>
                  <div className="recognition-grid grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {recognitionOptions.map((letter, index) => (
                      <Button
                        key={index}
                        onClick={() => handleLetterRecognition(letter)}
                        className="h-20 text-4xl font-bold bg-white border-4 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-gray-800 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        {letter}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Write */}
              {currentStep === "write" && (
                <div className="space-y-6">
                  <p className="text-xl text-gray-600 mb-6">اكتب الحرف بالماوس</p>
                  <div className="flex justify-center">
                    <div className="relative">
                      <canvas
                        ref={canvasRef}
                        width={300}
                        height={300}
                        className="drawing-canvas border-4 border-emerald-200 rounded-xl bg-white cursor-crosshair shadow-lg"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                      <Button
                        onClick={clearCanvas}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Completed */}
              {currentStep === "completed" && (
                <div className="space-y-6">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-2xl font-bold text-emerald-600 mb-6">أحسنت! أتممت تعلم الحرف</p>
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={resetCurrentLetter}
                      variant="outline"
                      className="px-6 py-3 rounded-xl border-2 border-emerald-300 hover:bg-emerald-50"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      إعادة التعلم
                    </Button>
                    {currentLetterRef.current < arabicLetters.length - 1 && (
                      <Button
                        onClick={nextLetter}
                        className="next-button bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        الحرف التالي
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border-2 border-emerald-200">
              <span className="text-gray-600 font-medium">الخطوة:</span>
              <span className="text-lg font-bold text-emerald-600">
                {currentStep === "listen" && "استمع"}
                {currentStep === "repeat" && "كرر"}
                {currentStep === "recognize" && "تعرف"}
                {currentStep === "write" && "اكتب"}
                {currentStep === "completed" && "مكتمل"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
