import { auth } from "@/auth"
import { SignIn } from "@/components/sign-in"
import { getSubscriptions, getAggregatedArticles, getInbox } from "./actions"
import { ArticleList } from "@/components/article-list"
import { Sidebar } from "@/components/sidebar"
import { StarterFeeds } from "@/components/starter-feeds"

export default async function Page() {
  const session = await auth()

  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="glass-card p-10 max-w-md w-full text-center space-y-8 relative z-10 border-slate-800">
          <div>
            <div className="w-16 h-16 bg-indigo-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/30">
              <span className="text-3xl font-bold">G</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
              Gravity Reader
            </h1>
            <p className="text-slate-400 mt-2">
              A premium, focused RSS reader with read-it-later integration.
            </p>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <SignIn />
          </div>

          <p className="text-xs text-slate-500">
            Powered by WebAuthn Passkeys. Secure and Passwordless.
          </p>
        </div>
      </main>
    )
  }

  const subscriptions = await getSubscriptions()
  const inbox = await getInbox()

  let articles: any[] = []
  if (subscriptions.length > 0) {
    articles = await getAggregatedArticles(subscriptions)
  }

  return (
    <div className="flex bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <Sidebar subscriptions={subscriptions} inboxCount={inbox.length} user={session.user} />

      <main className="flex-1 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        <div className="max-w-4xl mx-auto p-8">
          <header className="mb-10 flex justify-between items-end border-b border-slate-800 pb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Your Feed</h1>
              <p className="text-slate-400 mt-1">Latest updates from {subscriptions.length} sources</p>
            </div>
            <div className="text-slate-500 text-sm">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </header>

          {subscriptions.length === 0 ? (
            <div className="py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold mb-4 text-white">Welcome to Gravity</h2>
                <p className="text-slate-400 max-w-md mx-auto">You don't have any subscriptions yet. Get started by adding some popular tech feeds below, or use the sidebar to add your own.</p>
              </div>
              <StarterFeeds />
            </div>
          ) : (
            <>
              {articles.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  No recent articles found.
                </div>
              ) : (
                <ArticleList articles={articles} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
