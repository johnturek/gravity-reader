"use client"
import { signIn } from "next-auth/webauthn"
import { useState } from "react"

export function SignIn() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSignIn = async () => {
        try {
            setLoading(true)
            setError("")
            // WebAuthn sign in
            const result = await signIn("webauthn", { email, redirect: false })
            if (result?.error) {
                setError(result.error)
            } else {
                // Success mostly handled by redirect, but if redirect: false, we might want to reload
                window.location.reload()
            }
        } catch (e: any) {
            console.error(e)
            setError(e.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="webauthn"
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white w-full"
            />
            <button
                onClick={handleSignIn}
                disabled={loading}
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition shadow-lg shadow-indigo-500/20 disabled:opacity-50 w-full"
            >
                {loading ? "Signing in..." : "Sign in with Passkey"}
            </button>
            {error && (
                <p className="text-red-400 text-sm max-w-xs text-center">{error}</p>
            )}
            <p className="text-xs text-slate-400 text-center max-w-xs">
                (First time? Enter email to register, then follow your browser prompts to create a passkey)
            </p>
        </div>
    )
}
