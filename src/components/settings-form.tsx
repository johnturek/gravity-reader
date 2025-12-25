"use client"
import { useState } from "react"
import { updateProfile, signOut } from "@/app/actions"
import { useRouter } from "next/navigation"

export function SettingsForm({ user }: { user: any }) {
    const [name, setName] = useState(user.name || "")
    const [image, setImage] = useState(user.image || "")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            await updateProfile({ name, image })
            router.refresh()
            alert("Profile updated!")
        } catch (e) {
            console.error(e)
            alert("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSave} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Display Name</label>
                    <input
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-3">Avatar</label>

                    {/* Preview */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-800 ring-2 ring-indigo-500/50">
                            {image ? (
                                <img src={image} className="w-full h-full object-cover" alt="Preview" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 text-2xl font-bold">
                                    {name?.[0] || "U"}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-300 mb-1">Pick a preset or upload your own</p>
                            <input
                                type="file"
                                accept="image/*"
                                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-indigo-400 hover:file:bg-slate-700 transition"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        if (file.size > 1024 * 1024) {
                                            alert("File too large (max 1MB)")
                                            return
                                        }
                                        const reader = new FileReader()
                                        reader.onloadend = () => {
                                            setImage(reader.result as string)
                                        }
                                        reader.readAsDataURL(file)
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Presets */}
                    <div className="mb-4">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Presets</label>
                        <div className="grid grid-cols-5 gap-2">
                            {[
                                "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix",
                                "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka",
                                "https://api.dicebear.com/9.x/avataaars/svg?seed=Zoe",
                                "https://api.dicebear.com/9.x/avataaars/svg?seed=Jack",
                                "https://api.dicebear.com/9.x/avataaars/svg?seed=Precious",
                                "https://api.dicebear.com/9.x/notionists/svg?seed=Felix",
                                "https://api.dicebear.com/9.x/notionists/svg?seed=Bailey",
                                "https://api.dicebear.com/9.x/bottts/svg?seed=Cuddles",
                                "https://api.dicebear.com/9.x/bottts/svg?seed=Spot",
                                "https://api.dicebear.com/9.x/thumbs/svg?seed=Ginger"
                            ].map((url, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setImage(url)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${image === url ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-800 hover:border-slate-600'}`}
                                >
                                    <img src={url} className="w-full h-full object-cover" alt="avatar preset" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-950 px-2 text-slate-600">Or use URL</span>
                        </div>
                    </div>

                    <div className="mt-2">
                        <input
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://..."
                        />
                    </div>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded transition font-medium"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>

            <div className="pt-6 border-t border-slate-800">
                <button
                    onClick={() => signOut()}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                >
                    Sign Out
                </button>
            </div>
        </div>
    )
}
