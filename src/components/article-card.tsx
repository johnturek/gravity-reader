"use client"
import { Clock, Bookmark, ExternalLink, BookOpen } from "lucide-react"
import { toggleReadLater } from "@/app/actions"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { ReaderView } from "./reader-view"

// Simplified Article type
type Article = {
    title: string;
    link: string;
    content: string;
    pubDate?: string;
    isoDate?: string;
    feedName?: string | null;
    feedIcon?: string | null;
}

export function ArticleCard({ article }: { article: Article }) {
    const [showReader, setShowReader] = useState(false)

    // Safety check for date
    const dateObj = article.isoDate ? new Date(article.isoDate) : (article.pubDate ? new Date(article.pubDate) : new Date());
    let timeAgo = "Just now";
    try {
        timeAgo = formatDistanceToNow(dateObj, { addSuffix: true });
    } catch (e) {
        // Fallback
    }

    // Strip HTML for summary
    const summary = article.content.replace(/<[^>]*>?/gm, "").slice(0, 300) + (article.content.length > 300 ? "..." : "");

    return (
        <>
            {showReader && <ReaderView url={article.link} onClose={() => setShowReader(false)} />}
            <article className="glass-card p-6 mb-4 hover:bg-slate-800/80 transition-all duration-300 group border border-slate-800/50 hover:border-indigo-500/30">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            {article.feedIcon && <img src={article.feedIcon} className="w-4 h-4 rounded-full" alt="" />}
                            <span className="text-indigo-400">{article.feedName}</span>
                            <span className="text-slate-700">•</span>
                            <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {timeAgo}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight text-slate-100 group-hover:text-indigo-300 transition-colors cursor-pointer" onClick={() => setShowReader(true)}>
                            {article.title}
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                            {summary}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                        <button
                            onClick={() => setShowReader(true)}
                            className="p-2.5 bg-slate-800 hover:bg-indigo-500 rounded-lg text-slate-400 hover:text-white transition shadow-lg shadow-black/20"
                            title="Reader View"
                        >
                            <BookOpen size={18} />
                        </button>
                        <button
                            onClick={() => toggleReadLater({ url: article.link, title: article.title, description: summary, source: article.feedName || undefined })}
                            className="p-2.5 bg-slate-800 hover:bg-indigo-600 rounded-lg text-slate-400 hover:text-white transition shadow-lg shadow-black/20"
                            title="Read Later"
                        >
                            <Bookmark size={18} />
                        </button>
                        <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-slate-800 hover:bg-emerald-600 rounded-lg text-slate-400 hover:text-white transition shadow-lg shadow-black/20"
                            title="Open Link"
                        >
                            <ExternalLink size={18} />
                        </a>
                    </div>
                </div>
            </article>
        </>
    )
}
