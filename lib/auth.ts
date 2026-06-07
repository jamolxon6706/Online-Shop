// const TOKEN_KEY = 'apex-access-token'
// const REFRESH_KEY = 'apex-refresh-token'
//
// export function getToken(): string | null {
//     if (typeof window === 'undefined') return null
//     return localStorage.getItem(TOKEN_KEY)
// }
//
// export function setTokens(access: string, refresh: string) {
//     localStorage.setItem(TOKEN_KEY, access)
//     localStorage.setItem(REFRESH_KEY, refresh)
// }
//
// export function clearTokens() {
//     localStorage.removeItem(TOKEN_KEY)
//     localStorage.removeItem(REFRESH_KEY)
// }
//
// export function authHeaders(): HeadersInit {
//     const token = getToken()
//     return token ? { Authorization: `Bearer ${token}` } : {}
// }
//
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
//
// export async function loginApi(email: string, password: string) {
//     const res = await fetch(`${BASE_URL}/api/token/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//     })
//     if (!res.ok) {
//         const err = await res.json()
//         throw new Error(err?.detail || 'Login xatosi')
//     }
//     return res.json() as Promise<{ access: string; refresh: string }>
// }
//
// export async function registerApi(data: {
//     phone_number: string
//     password: string
//     first_name?: string
//     last_name?: string
//     email?: string
// }) {
//     const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
//     const res = await fetch(`${BASE_URL}/api/auth/register/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//     })
//     if (!res.ok) {
//         const err = await res.json()
//         throw new Error(JSON.stringify(err))
//     }
//     return res.json()
// }
//
// export async function getProfileApi() {
//     const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
//     const res = await fetch(`${BASE_URL}/api/profile/`, {
//         headers: { 'Content-Type': 'application/json', ...authHeaders() },
//     })
//     if (!res.ok) return null
//     return res.json()
// }