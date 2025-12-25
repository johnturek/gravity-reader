"use client"
import { addFeed } from "@/app/actions"
import { COMMON_FEEDS } from "@/lib/constants"
import { Plus } from "lucide-react"
import { useState } from "react"

export function StarterFeeds() {
    // We could track loading state per feed
    const [adding, setAdding] = useState<string | null>(null);

    const handleAdd = async (url: string) => {
        setAdding(url);
        try {
            await addFeed(url);
        } catch (e) {
            console.error(e);
        }
        setAdding(null);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMON_FEEDS.map((feed) => (
                <div key={feed.url} className="glass-card p-4 flex items-center justify-between border border-slate-800 hover:border-slate-700 transition">
                    <div>
                        <h3 className="font-semibold text-slate-200">{feed.name}</h3>
                        <p className="text-xs text-slate-500 truncate max-w-[150px]">{feed.url}</p>
                    </div>
                    <button
                        onClick={() => handleAdd(feed.url)}
                        disabled={adding === feed.url}
                        className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 rounded-lg text-white transition"
                    >
                        {adding === feed.url ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={16} />}
                    </button>
                </div>
            ))}
        </div>
    )
}
