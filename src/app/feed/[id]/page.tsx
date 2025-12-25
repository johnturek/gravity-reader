import { auth } from "@/auth"
import { getSubscriptions, getAggregatedArticles, getInbox } from "../../actions"
import { Sidebar } from "@/components/sidebar"
import { ArticleList } from "@/components/article-list"
import { redirect } from "next/navigation"
import { prisma } from "@/prisma"

export default async function FeedPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) redirect("/")

    const { id } = await params

    const feed = await prisma.feed.findUnique({ where: { id } })
    if (!feed) redirect("/")

    const subscriptions = await getSubscriptions()
    const inbox = await getInbox()
    const articles = await getAggregatedArticles([feed])

    return (
        <div className="flex bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-indigo-500/30">
            <Sidebar subscriptions={subscriptions} inboxCount={inbox.length} user={session.user} />
            <main className="flex-1 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                <div className="max-w-4xl mx-auto p-8">
                    <header className="mb-10 border-b border-slate-800 pb-4 flex items-center gap-4">
                        {feed.imageUrl && <img src={feed.imageUrl} className="w-12 h-12 rounded-lg bg-slate-800" />}
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{feed.name}</h1>
                            <p className="text-slate-400 mt-1 max-w-xl truncate">{feed.description || feed.url}</p>
                        </div>
                    </header>

                    {articles.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">No articles available.</div>
                    ) : (
                        <ArticleList articles={articles} />
                    )}
                </div>
            </main>
        </div>
    )
}
