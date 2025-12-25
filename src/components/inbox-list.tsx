"use client"
import { markAsRead } from "@/app/actions"
import { Check, ExternalLink, Calendar } from "lucide-react"

export function InboxList({ items }: { items: any[] }) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-700">
                    <Check size={32} />
                </div>
                <p>Your inbox is empty. Great job!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 pb-20">
            {items.map(item => (
                <div key={item.id} className="glass-card p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center group border border-slate-800/50 hover:border-indigo-500/30 transition-all">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-indigo-400 mb-2 font-medium">
                            <span>{item.source || "Unknown Source"}</span>
                            <span className="text-slate-700">•</span>
                            <span className="text-slate-500 flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-slate-100">
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition focus:outline-none focus:underline">
                                {item.title || item.url}
                            </a>
                        </h3>
                        {item.description && <p className="text-slate-400 text-sm line-clamp-2 max-w-2xl">{item.description}</p>}
                    </div>
                    <div className="flex gap-3 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition"
                            title="Open Link"
                        >
                            <ExternalLink size={18} />
                        </a>
                        <button
                            onClick={() => markAsRead(item.id)}
                            className="p-2.5 bg-indigo-600 hover:bg-emerald-500 rounded-lg text-white transition shadow-lg shadow-indigo-500/20 hover:shadow-emerald-500/30"
                            title="Mark as Read"
                        >
                            <Check size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
