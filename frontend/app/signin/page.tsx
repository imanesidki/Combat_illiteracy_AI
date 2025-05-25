"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignInPage() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const router = useRouter()

  const validateMoroccanPhone = (phoneNumber: string) => {
    // Remove all spaces and special characters
    const cleanPhone = phoneNumber.replace(/[\s\-$$$$]/g, "")

    // Moroccan phone number patterns:
    // Mobile: 06XXXXXXXX or 07XXXXXXXX (10 digits)
    // With country code: +2126XXXXXXXX or +2127XXXXXXXX
    // International format: 002126XXXXXXXX or 002127XXXXXXXX

    const moroccanMobileRegex = /^(\+212|00212|0)([67])\d{8}$/

    return moroccanMobileRegex.test(cleanPhone)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhone(value)

    if (value && !validateMoroccanPhone(value)) {
      setPhoneError("يرجى إدخال رقم هاتف مغربي صحيح (06XXXXXXXX أو 07XXXXXXXX)")
    } else {
      setPhoneError("")
    }
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateMoroccanPhone(phone)) {
      setPhoneError("يرجى إدخال رقم هاتف مغربي صحيح")
      return
    }

    // Simple validation for demo
    if (phone && password) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Moroccan Zellij Corner Patterns */}
      <div className="absolute top-0 left-0 w-48 h-48 opacity-30">
        <img
          src="/images/moroccan-zellij.png"
          alt="Moroccan Zellij Pattern"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.src = "/placeholder.svg?height=192&width=192"
          }}
        />
      </div>

      <div className="absolute top-0 right-0 w-48 h-48 opacity-30 transform scale-x-[-1]">
        <img
          src="/images/moroccan-zellij.png"
          alt="Moroccan Zellij Pattern"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=192&width=192"
          }}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-30 transform scale-y-[-1]">
        <img
          src="/images/moroccan-zellij.png"
          alt="Moroccan Zellij Pattern"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=192&width=192"
          }}
        />
      </div>

      <div className="absolute bottom-0 right-0 w-48 h-48 opacity-30 transform scale-x-[-1] scale-y-[-1]">
        <img
          src="/images/moroccan-zellij.png"
          alt="Moroccan Zellij Pattern"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=192&width=192"
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-800">تسجيل الدخول</CardTitle>
            <p className="text-gray-600 text-sm">مرحباً بعودتك إلى رحلة تعلم العربية</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`pl-10 h-12 border-2 ${phoneError ? "border-red-400 focus:border-red-500" : "border-orange-200 focus:border-orange-400"} rounded-xl`}
                  dir="ltr"
                />
                {phoneError && <p className="text-red-500 text-xs mt-1 text-right">{phoneError}</p>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                  dir="rtl"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                دخول
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm mb-3">ليس لديك حساب؟</p>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 font-semibold rounded-xl transition-all duration-300"
                >
                  إنشاء حساب جديد
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
