import { ArticleCard } from "./article-card"

export function ArticleList({ articles }: { articles: any[] }) {
    return (
        <div className="max-w-3xl mx-auto pb-20">
            {articles.map((article, i) => (
                <ArticleCard key={i} article={article} />
            ))}
        </div>
    )
}
