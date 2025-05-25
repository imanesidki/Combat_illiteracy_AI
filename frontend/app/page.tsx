"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* App Logo and Name */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">اقرأ</h1>
          <p className="text-xl text-gray-600 mb-2">تطبيق تعلم العربية</p>
          <p className="text-lg text-gray-500">لمحاربة الأمية</p>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="bg-emerald-50 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-emerald-800 mb-2">تعلم الحروف</h3>
              <p className="text-emerald-700 text-sm">ابدأ بتعلم الحروف العربية بطريقة تفاعلية</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-blue-800 mb-2">تعلم تفاعلي</h3>
              <p className="text-blue-700 text-sm">تعلم بالصوت والصورة والكتابة اليدوية</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-orange-800 mb-2">محادثة ذكية</h3>
              <p className="text-orange-700 text-sm">تحدث مع الذكاء الاصطناعي بالدارجة المغربية</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full h-14 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
              تسجيل الدخول
            </Button>
          </Link>
          <Link href="/signup" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-14 border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              إنشاء حساب
            </Button>
          </Link>
        </div>

        {/* App Description */}
        <div className="mt-12 text-center max-w-2xl">
          <p className="text-gray-600 leading-relaxed">
            تطبيق "اقرأ" مصمم خصيصاً لمساعدة المغاربة الأميين على تعلم القراءة والكتابة باللغة العربية. يستخدم التطبيق
            الدارجة المغربية والذكاء الاصطناعي لتوفير تجربة تعلم سهلة وممتعة.
          </p>
        </div>
      </div>
    </div>
  )
}
