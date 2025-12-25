import Parser from "rss-parser";
import { JSDOM } from "jsdom";

const parser = new Parser();

export async function fetchFeed(url: string) {
    try {
        const feed = await parser.parseURL(url);
        return feed;
    } catch (error) {
        console.error(`Error fetching feed ${url}:`, error);
        return null;
    }
}

export async function detectFeedUrl(url: string): Promise<string | null> {
    try {
        // 1. Try fetching the URL to look for HTML tags
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 Compatible' } });
        if (!response.ok) return null;

        const contentType = response.headers.get("content-type");
        const html = await response.text();

        // If it's already an XML/RSS content type, return original URL
        if (contentType?.includes("xml") || html.trim().startsWith("<?xml") || html.includes("<rss") || html.includes("<feed")) {
            return url;
        }

        // 2. Parse HTML to find <link> tags
        const dom = new JSDOM(html, { url });
        const document = dom.window.document;

        const types = [
            "application/rss+xml",
            "application/atom+xml",
            "application/json",
            "application/feed+json"
        ];

        for (const type of types) {
            const link = document.querySelector(`link[type="${type}"]`);
            if (link && link.getAttribute("href")) {
                let href = link.getAttribute("href")!;
                // Resolve relative URLs
                return new URL(href, url).toString();
            }
        }

        // 3. Try common suffixes if no link tag found
        // Note: The caller might want to try these if this function returns null
        return null;

    } catch (error) {
        console.error("Error detecting feed:", error);
        return null;
    }
}
