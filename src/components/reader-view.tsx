"use client"
import { useState, useEffect } from "react"
import { getReadableArticle } from "@/app/actions"
import { X, Type, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ReaderView({ url, onClose }: { url: string, onClose: () => void }) {
    const [article, setArticle] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [fontSize, setFontSize] = useState(18)

    useEffect(() => {
        let mounted = true
        async function load() {
            setLoading(true)
            try {
                const data = await getReadableArticle(url)
                if (mounted) setArticle(data)
            } catch (e) {
                console.error(e)
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [url])

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = 'unset' }
    }, [])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 md:p-8"
            >
                <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl h-full max-h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 z-10">
                        <div className="flex items-center gap-4">
                            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                            <span className="text-sm font-medium text-slate-400 truncate max-w-md">
                                {article?.siteName || new URL(url).hostname}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-slate-800 rounded-full px-3 py-1.5">
                                <Type size={14} className="text-slate-400" />
                                <input
                                    type="range"
                                    min="14"
                                    max="24"
                                    step="1"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-24 accent-indigo-500 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 md:p-16 scrollbar-thin scrollbar-thumb-slate-700 bg-[#0f1115]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                                <Loader2 size={32} className="animate-spin" />
                                <p>Extracting content...</p>
                            </div>
                        ) : article ? (
                            <article className="max-w-2xl mx-auto prose prose-invert prose-lg prose-indigo" style={{ fontSize: `${fontSize}px` }}>
                                <h1 className="mb-8 font-serif text-4xl md:text-5xl leading-tight font-bold text-slate-100">{article.title}</h1>
                                <div
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                    className="reader-content font-serif leading-relaxed text-slate-300"
                                />
                            </article>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                <p>Could not load reader view for this article.</p>
                            </div>
                        )}
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    )
}
