import { auth } from "@/auth"
import { getSubscriptions, getInbox } from "../actions"
import { Sidebar } from "@/components/sidebar"
import { SettingsForm } from "@/components/settings-form"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
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
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Settings</h1>
                        <p className="text-slate-400 mt-1">Manage your account and preferences.</p>
                    </header>
                    <SettingsForm user={session.user} />
                </div>
            </main>
        </div>
    )
}
