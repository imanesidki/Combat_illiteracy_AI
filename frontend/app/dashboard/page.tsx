"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, MessageSquare, Volume2, Users, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [speechEnabled, setSpeechEnabled] = useState(false)

  // Auto-play welcome audio on page load (only once)
  useEffect(() => {
    // Check if welcome message has been played before
    const hasPlayedWelcome = localStorage.getItem('hasPlayedWelcome')
    console.log("hasPlayedWelcome", hasPlayedWelcome)
    if (!hasPlayedWelcome || hasPlayedWelcome === 'false') {
      const timer = setTimeout(() => {
        speakWelcome()
        localStorage.setItem('hasPlayedWelcome', 'true')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Welcome voice greeting function using audio file
  const speakWelcome = () => {
    // Create audio element
    const audio = new Audio('/audio/welcome_speech.mp3')
    
    // Set audio properties
    audio.volume = 1.0
    
    // Handle audio events
    audio.onplay = () => {
      setSpeechEnabled(true)
    }
    
    audio.onended = () => {
      setSpeechEnabled(false)
    }
    
    audio.onerror = () => {
      console.error('Error playing welcome audio')
      setSpeechEnabled(false)
    }
    
    // Play the audio
    audio.play().catch(error => {
      console.error('Failed to play audio:', error)
      setSpeechEnabled(false)
    })
  }

  const modules = [
    {
      id: 1,
      title: "الحروف العربية",
      subtitle: "تعلم الحروف",
      icon: BookOpen,
      color: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      href: "/letters",
      emoji: "🔤",
    },
    {
      id: 2,
      title: "الكلمات اليومية",
      subtitle: "كلمات مفيدة",
      icon: Volume2,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      href: "/words",
      emoji: "📝",
    },
    {
      id: 3,
      title: "الجمل",
      subtitle: "تكوين الجمل",
      icon: MessageSquare,
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      href: "/sentences",
      emoji: "💬",
    },
    {
      id: 4,
      title: "هيا نتحدث",
      subtitle: "محادثة صوتية",
      icon: Users,
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      href: "/conversation",
      emoji: "🗣️",
    },
  ]

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Moroccan Zellij Corner Patterns */}
      <div className="absolute top-0 left-0 w-56 h-56 opacity-25">
        <img
          src="/images/moroccan-zellij.png"
          alt="Moroccan Zellij Pattern"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=224&width=224"
          }}
        />
      </div>

      <div className="absolute top-0 right-0 w-56 h-56 opacity-25 transform scale-x-[-1]">
        <img
          src="/images/moroccan-zellij.png"
          alt="Moroccan Zellij Pattern"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=224&width=224"
          }}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-56 h-56 opacity-25 transform scale-y-[-1]">
        <img
          src="/images/moroccan-zellij.png"
          alt="Moroccan Zellij Pattern"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=224&width=224"
          }}
        />
      </div>

      <div className="absolute bottom-0 right-0 w-56 h-56 opacity-25 transform scale-x-[-1] scale-y-[-1]">
        <img
          src="/images/moroccan-zellij.png"
          alt="Moroccan Zellij Pattern"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=224&width=224"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">أهلاً وسهلاً</h1>
          <p className="text-xl text-gray-600 mb-4">مرحباً بك في رحلة تعلم العربية</p>
        </div>

        {/* Learning Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {modules.map((module) => {
            const IconComponent = module.icon
            const isCompleted = currentLevel >= module.id
            return (
              <Card
                key={module.id}
                className={`relative overflow-hidden transition-all duration-300 transform hover:scale-105 border-2 cursor-pointer ${
                  isCompleted
                    ? `${module.borderColor} shadow-xl hover:shadow-2xl ${module.bgColor}`
                    : "border-gray-200 bg-gray-50 hover:shadow-lg"
                }`}
              >
                <CardContent className="relative p-8 text-center">
                  {isCompleted && (
                    <div className="absolute top-4 left-4">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  )}

                  {/* Large Emoji Icon */}
                  <div className="text-6xl mb-4">{module.emoji}</div>

                  {/* Icon Circle */}
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full ${
                      isCompleted ? `bg-gradient-to-br ${module.color}` : "bg-gray-300"
                    } flex items-center justify-center shadow-lg`}
                  >
                    <IconComponent className={`w-8 h-8 ${isCompleted ? "text-white" : "text-gray-500"}`} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{module.title}</h3>
                  <p className="text-gray-600 mb-6">{module.subtitle}</p>

                  <Link href={module.href}>
                    <Button
                      className={`w-full font-semibold py-4 text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105 ${
                        isCompleted
                          ? `bg-gradient-to-r ${module.color} text-white`
                          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      }`}
                    >
                      ابدأ التعلم
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border-2 border-orange-200">
            <span className="text-gray-600 font-medium text-lg">المستوى الحالي:</span>
            <span className="text-3xl font-bold text-orange-500">{currentLevel}</span>
            <span className="text-gray-600 text-lg">من 4</span>
          </div>
          
          {/* Level Controls for Testing */}
          <div className="mt-4 flex justify-center gap-2">
            <Button
              onClick={() => setCurrentLevel(Math.max(1, currentLevel - 1))}
              disabled={currentLevel <= 1}
              variant="outline"
              size="sm"
              className="px-4 py-2"
            >
              -
            </Button>
            <Button
              onClick={() => setCurrentLevel(Math.min(4, currentLevel + 1))}
              disabled={currentLevel >= 4}
              variant="outline"
              size="sm"
              className="px-4 py-2"
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
