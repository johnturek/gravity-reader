import { auth } from "@/auth"
import { getInbox, getSubscriptions } from "../actions"
import { Sidebar } from "@/components/sidebar"
import { InboxList } from "@/components/inbox-list"
import { redirect } from "next/navigation"

export default async function InboxPage() {
    const session = await auth()
    if (!session?.user) redirect("/")

    const inbox = await getInbox()
    const subscriptions = await getSubscriptions()

    return (
        <div className="flex bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-indigo-500/30">
            <Sidebar subscriptions={subscriptions} inboxCount={inbox.length} user={session.user} />
            <main className="flex-1 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                <div className="max-w-4xl mx-auto p-8">
                    <header className="mb-10 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Inbox</h1>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700">{inbox.length}</span>
                        </div>
                        <p className="text-slate-400">Articles you've saved for later.</p>
                    </header>
                    <InboxList items={inbox} />
                </div>
            </main>
        </div>
    )
}
