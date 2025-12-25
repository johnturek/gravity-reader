"use client"
import Link from "next/link"
import { useState } from "react"
import { addFeed } from "@/app/actions"
import { Plus, LayoutGrid, Inbox, Rss, Settings } from "lucide-react"

// Define simplified type for Subscription/Feed
type FeedSubset = {
    id: string;
    name: string | null;
    imageUrl: string | null;
}

export function Sidebar({ subscriptions, inboxCount, user }: { subscriptions: FeedSubset[], inboxCount: number, user?: any }) {
    const [isAdding, setIsAdding] = useState(false)
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault()
        if (!url) return
        setLoading(true)
        try {
            await addFeed(url)
            setIsAdding(false)
            setUrl("")
        } catch (err) {
            alert("Failed to add feed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <aside className="w-64 bg-slate-950/50 border-r border-slate-800 p-4 flex flex-col gap-6 h-screen sticky top-0 backdrop-blur-xl">
            <div className="flex items-center gap-2 px-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">G</div>
                <span className="font-bold text-lg tracking-tight">Gravity</span>
            </div>

            {user && (
                <Link href="/settings" className="flex items-center gap-3 px-3 py-2 -mx-1 rounded-md hover:bg-slate-800/50 transition group">
                    {user.image ? (
                        <img src={user.image} className="w-6 h-6 rounded-full" alt="" />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300">
                            {user.name?.[0] || user.email?.[0] || "U"}
                        </div>
                    )}
                    <div className="flex flex-col text-left overflow-hidden">
                        <span className="text-sm font-medium text-slate-200 truncate">{user.name || "User"}</span>
                        <span className="text-[10px] text-slate-500 truncate">Settings</span>
                    </div>
                </Link>
            )}

            <nav className="flex flex-col gap-1">
                <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/50 text-slate-300 hover:text-white transition group">
                    <LayoutGrid size={18} className="group-hover:text-indigo-400 transition-colors" />
                    All Feeds
                </Link>
                <Link href="/inbox" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/50 text-slate-300 hover:text-white transition group">
                    <Inbox size={18} className="group-hover:text-indigo-400 transition-colors" />
                    Inbox
                    {inboxCount > 0 && <span className="ml-auto bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{inboxCount}</span>}
                </Link>
            </nav>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                <div className="flex items-center justify-between px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Subscriptions</span>
                </div>

                <div className="flex flex-col gap-1">
                    {subscriptions.map(sub => (
                        <Link key={sub.id} href={`/feed/${sub.id}`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/50 text-slate-400 hover:text-white truncate transition text-sm">
                            {sub.imageUrl ? (
                                <img src={sub.imageUrl} className="w-4 h-4 rounded-full object-cover" alt="" />
                            ) : (
                                <Rss size={14} />
                            )}
                            <span className="truncate">{sub.name || "Untitled Feed"}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
                {isAdding ? (
                    <form onSubmit={handleAdd} className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                        <input
                            autoFocus
                            type="url"
                            placeholder="https://..."
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            disabled={loading}
                        />
                        <div className="flex gap-2">
                            <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-1.5 rounded transition disabled:opacity-50">
                                {loading ? "Adding..." : "Add"}
                            </button>
                            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-1.5 rounded transition">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <button onClick={() => setIsAdding(true)} className="w-full flex items-center gap-2 text-sm text-slate-400 hover:text-white px-2 py-2 hover:bg-slate-800/50 rounded transition">
                        <Plus size={16} /> Add Subscription
                    </button>
                )}
            </div>
        </aside>
    )
}
