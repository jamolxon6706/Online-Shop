"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Shield, ArrowLeft, RotateCcw } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// ─── API helpers ─────────────────────────────────────────────────────────────

async function adminLogin(username: string, password: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false as const, error: data?.error || "Xatolik yuz berdi" }
    return { ok: true as const, email: data.email as string, message: data.message as string }
  } catch {
    return { ok: false as const, error: "Server bilan aloqa yo'q" }
  }
}

async function adminVerifyOtp(username: string, code: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth/verify/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, code }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false as const, error: data?.error || "Kod xato" }
    return { ok: true as const, access: data.access as string, refresh: data.refresh as string }
  } catch {
    return { ok: false as const, error: "Server bilan aloqa yo'q" }
  }
}

async function adminResendOtp(username: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth/resend/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false as const, error: data?.error || "Xatolik" }
    return { ok: true as const }
  } catch {
    return { ok: false as const, error: "Server bilan aloqa yo'q" }
  }
}

// ─── OTP Input Component ─────────────────────────────────────────────────────

function OtpInput({ value, onChange, disabled }: {
  value: string
  onChange: (v: string) => void
  disabled: boolean
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const digits = value.padEnd(6, "").split("").slice(0, 6)

  const handleChange = (index: number, char: string) => {
    const cleaned = char.replace(/\D/g, "").slice(-1)
    const next = digits.map((d, i) => (i === index ? cleaned : d)).join("").replace(/ /g, "")
    onChange(next)
    if (cleaned && index < 5) inputs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus()
      const next = digits.map((d, i) => (i === index - 1 ? "" : d)).join("")
      onChange(next)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    onChange(pasted)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit === " " ? "" : digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="h-14 w-11 sm:h-16 sm:w-12 rounded-2xl border-2 bg-card text-center text-xl font-bold 
                     border-border text-foreground
                     focus:border-foreground focus:outline-none focus:ring-0
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-150
                     data-[filled=true]:border-foreground/40"
          data-filled={digit !== " " && digit !== "" ? "true" : "false"}
        />
      ))}
    </div>
  )
}

// ─── Countdown timer ─────────────────────────────────────────────────────────

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds)
  const [active, setActive] = useState(true)

  useEffect(() => {
    if (!active) return
    if (remaining <= 0) { setActive(false); return }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining, active])

  const reset = (s = seconds) => { setRemaining(s); setActive(true) }
  return { remaining, expired: remaining <= 0, reset }
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Step = "credentials" | "otp"

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("credentials")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [maskedEmail, setMaskedEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [otpValue, setOtpValue] = useState("")
  const { remaining, expired, reset: resetTimer } = useCountdown(300) // 5 min

  // Check already logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) router.replace("/admin")
  }, [router])

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`

  // ── Step 1: credentials ──────────────────────────────────
  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await adminLogin(username, password)
    setLoading(false)
    if (!res.ok) { setError(res.error); return }
    setMaskedEmail(res.email)
    setStep("otp")
    resetTimer(300)
  }

  // ── Step 2: OTP ──────────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpValue.length < 6) { setError("6 xonali kodni to'liq kiriting"); return }
    setError("")
    setLoading(true)
    const res = await adminVerifyOtp(username, otpValue)
    setLoading(false)
    if (!res.ok) { setError(res.error); setOtpValue(""); return }
    // Save tokens
    localStorage.setItem("access_token", res.access)
    localStorage.setItem("refresh_token", res.refresh)
    router.push("/admin")
  }

  // ── Resend ───────────────────────────────────────────────
  const handleResend = async () => {
    setError("")
    setLoading(true)
    const res = await adminResendOtp(username)
    setLoading(false)
    if (!res.ok) { setError(res.error); return }
    setOtpValue("")
    resetTimer(300)
  }

  // ── Auto-submit when 6 digits entered ───────────────────
  useEffect(() => {
    if (otpValue.length === 6 && step === "otp" && !loading) {
      handleVerify(new Event("submit") as unknown as React.FormEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpValue])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-secondary/80 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary/60 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center gap-3 border-b border-border bg-secondary/40 px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground">
              <span className="text-background font-bold text-sm">A</span>
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">APEX Admin</p>
              <p className="text-xs text-muted-foreground mt-0.5">Boshqaruv paneli</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1 border border-border">
              <Shield className="h-3 w-3 text-green-500" />
              <span className="text-xs font-medium text-muted-foreground">Xavfsiz</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === "credentials" ? (
              <>
                <div className="mb-6">
                  <h1 className="text-xl font-bold">Kirish</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Admin hisob ma'lumotlarini kiriting
                  </p>
                </div>

                <form onSubmit={handleCredentials} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      autoComplete="username"
                      autoFocus
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm
                                 placeholder:text-muted-foreground/50
                                 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30
                                 disabled:opacity-50 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Parol
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm
                                 placeholder:text-muted-foreground/50
                                 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30
                                 disabled:opacity-50 transition-all"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 dark:bg-red-950/20 dark:border-red-900/30">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !username || !password}
                    className="w-full rounded-xl bg-foreground text-background py-3 text-sm font-semibold
                               hover:opacity-90 active:scale-[0.98] transition-all
                               disabled:opacity-40 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Tekshirilmoqda...</>
                    ) : (
                      "Davom etish →"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <button
                    onClick={() => { setStep("credentials"); setError(""); setOtpValue("") }}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Orqaga
                  </button>
                  <h1 className="text-xl font-bold">Tasdiqlash</h1>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    <span className="font-medium text-foreground">{maskedEmail}</span> manziliga
                    6 xonali kod yuborildi
                  </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-5">
                  <OtpInput
                    value={otpValue}
                    onChange={setOtpValue}
                    disabled={loading}
                  />

                  {/* Timer */}
                  {!expired ? (
                    <p className="text-center text-xs text-muted-foreground">
                      Kod amal qilish vaqti:{" "}
                      <span className={`font-mono font-semibold ${remaining <= 60 ? "text-red-500" : "text-foreground"}`}>
                        {timeStr}
                      </span>
                    </p>
                  ) : (
                    <p className="text-center text-xs text-red-500 font-medium">
                      Kod muddati tugadi. Qayta yuboring.
                    </p>
                  )}

                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 dark:bg-red-950/20 dark:border-red-900/30">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otpValue.length < 6 || expired}
                    className="w-full rounded-xl bg-foreground text-background py-3 text-sm font-semibold
                               hover:opacity-90 active:scale-[0.98] transition-all
                               disabled:opacity-40 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Tekshirilmoqda...</>
                    ) : (
                      "Admin panelga kirish ✓"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading || (!expired && remaining > 240)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-border
                               py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary
                               disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Kodni qayta yuborish
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          APEX Store © {new Date().getFullYear()} — Faqat ruxsat berilgan foydalanuvchilar uchun
        </p>
      </div>
    </div>
  )
}
