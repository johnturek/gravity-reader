"use server"
import { JSDOM } from "jsdom"
import { Readability } from "@mozilla/readability"
import DOMPurify from "dompurify"

export async function parseArticleContent(url: string) {
    try {
        const response = await fetch(url)
        const html = await response.text()
        const doc = new JSDOM(html, { url })
        const reader = new Readability(doc.window.document)
        const article = reader.parse()

        if (!article) return null

        // Basic sanitization (optional in server context if just Text, but reasonable for HTML)
        const window = new JSDOM("").window
        const purify = DOMPurify(window)
        const cleanHtml = purify.sanitize(article.content)

        return {
            title: article.title,
            content: cleanHtml,
            excerpt: article.excerpt,
            siteName: article.siteName
        }
    } catch (error) {
        console.error("Failed to parse article", error)
        return null
    }
}
