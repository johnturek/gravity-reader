"use server"

import { auth, signOut as authSignOut } from "@/auth"
import { prisma } from "@/prisma"
import { fetchFeed, detectFeedUrl } from "@/lib/rss"
import { parseArticleContent } from "@/lib/readability"
import { revalidatePath } from "next/cache"
import type { Feed } from "@prisma/client"


export async function getSessionUser() {
    const session = await auth()
    return session?.user
}

export async function getSubscriptions() {
    const user = await getSessionUser()
    if (!user?.id) return []

    const subs = await prisma.subscription.findMany({
        where: { userId: user.id },
        include: { feed: true }
    })
    return subs.map(s => s.feed)
}

export async function addFeed(url: string) {
    const user = await getSessionUser()
    if (!user?.id) throw new Error("Not authenticated")

    let finalUrl = url;

    // Try to find existing by direct URL first
    let feed = await prisma.feed.findUnique({ where: { url: finalUrl } })

    if (!feed) {
        // Determine if it is a valid feed
        let rss = await fetchFeed(finalUrl)

        // If direct fetch fails, try to detect
        if (!rss) {
            const detectedUrl = await detectFeedUrl(url)
            if (detectedUrl) {
                finalUrl = detectedUrl
                // Check db again for detected url
                feed = await prisma.feed.findUnique({ where: { url: finalUrl } })
                if (!feed) {
                    rss = await fetchFeed(finalUrl)
                }
            }
        }

        if (!feed && !rss) throw new Error("Could not find or fetch RSS feed from that URL")

        if (!feed && rss) {
            feed = await prisma.feed.create({
                data: {
                    url: finalUrl,
                    name: rss.title || finalUrl,
                    description: rss.description,
                    imageUrl: rss.image?.url
                }
            })
        }
    }

    if (!feed) throw new Error("Unexpected error creating feed")

    // Check if already subscribed
    const existing = await prisma.subscription.findUnique({
        where: {
            userId_feedId: {
                userId: user.id,
                feedId: feed.id
            }
        }
    })

    if (!existing) {
        await prisma.subscription.create({
            data: {
                userId: user.id,
                feedId: feed.id
            }
        })
    }

    revalidatePath("/")
    return feed
}

export async function getInbox() {
    const user = await getSessionUser()
    if (!user?.id) return []

    return prisma.readLater.findMany({
        where: { userId: user.id, read: false },
        orderBy: { createdAt: 'desc' }
    })
}

export async function toggleReadLater(item: { url: string, title?: string, description?: string, source?: string }) {
    const user = await getSessionUser()
    if (!user?.id) throw new Error("Not authenticated")

    // Check if exists
    const existing = await prisma.readLater.findUnique({
        where: { userId_url: { userId: user.id, url: item.url } }
    })

    if (existing) {
        // If it exists, toggle the read state or remove it?
        // Let's assume if it exists we might want to just archive it (read=true) or delete it.
        // For "Read Later", usually clicking it again might mean "remove from list".
        await prisma.readLater.delete({
            where: { id: existing.id }
        })
    } else {
        await prisma.readLater.create({
            data: {
                userId: user.id,
                url: item.url,
                title: item.title,
                description: item.description,
                source: item.source,
                read: false
            }
        })
    }
    revalidatePath("/inbox")
    revalidatePath("/") // To update buttons elsewhere
}

export async function markAsRead(id: string) {
    const user = await getSessionUser()
    if (!user?.id) throw new Error("Not authenticated")

    await prisma.readLater.update({
        where: { id },
        data: { read: true }
    })
    revalidatePath("/inbox")
}

export async function getAggregatedArticles(feeds: Feed[]) {
    const promises = feeds.map(async (feed) => {
        const rss = await fetchFeed(feed.url)
        if (!rss) return []
        return rss.items.map(item => ({
            title: item.title || "Untitled",
            link: item.link || "#",
            content: item.contentSnippet || item.content || "",
            pubDate: item.pubDate,
            feedName: feed.name,
            feedId: feed.id,
            isoDate: item.isoDate
        }))
    })

    const results = await Promise.all(promises)
    // Flatten and sort
    const articles = results.flat().sort((a, b) => {
        const dateA = new Date(a.isoDate || a.pubDate || 0).getTime()
        const dateB = new Date(b.isoDate || b.pubDate || 0).getTime()
        return dateB - dateA
    })


    return articles
}

export async function getReadableArticle(url: string) {
    const user = await getSessionUser()
    if (!user?.id) throw new Error("Not authenticated")
    return parseArticleContent(url)
}

export async function updateProfile(data: { name?: string, image?: string }) {
    const user = await getSessionUser()
    if (!user?.id) throw new Error("Not authenticated")

    await prisma.user.update({
        where: { id: user.id },
        data: {
            name: data.name,
            image: data.image
        }
    })
    revalidatePath("/")
}

export async function signOut() {
    await authSignOut()
}
