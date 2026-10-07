import { getAllArticles } from "@/lib/content";
import { getAllConversations } from "@/lib/conversation-content";
import { getAllNews } from "@/lib/news";
import { getAllViewCounts } from "@/lib/view-counts";
import HomeContent from "@/components/sections/HomeContent";
import BreakingBar from "@/components/sections/BreakingBar";
import type { NewsListItem } from "@/components/news/NewsBrowser";

// ISR: served from the CDN cache, regenerated in the background at most
// once an hour (3600s) — a Publish/Unpublish/Save shows up within ~an hour.
// Raised from 60s to cut GitHub-API cold-load latency on cache misses.
export const revalidate = 3600;

export default async function Home() {
  const articles = await getAllArticles();
  const featuredArticles = articles.slice(0, 6);

  // Most recently published conversation is the featured one; the next
  // three (if they exist — never padded) fill the list beside it.
  const conversations = await getAllConversations();
  const [featuredConversation, ...otherConversations] = conversations;

  // Four most recent news items, stripped to what the homepage cards render
  // — the rich body never crosses into the client component.
  const latestNews: NewsListItem[] = (await getAllNews())
    .slice(0, 4)
    .map(({ slug, title, date, category, coverImage, excerpt }) => ({
      slug,
      title,
      date,
      category,
      coverImage,
      excerpt,
    }));

  // One Blob read per content type — read-only badges on the featured cards.
  const articleViewCounts = await getAllViewCounts("article");
  const conversationViewCounts = await getAllViewCounts("conversation");

  return (
    <>
      {/* Self-fetching breaking-news bar — fetches its own articles; the
          getAllArticles() call above is request-memoized so this shares it. */}
      <BreakingBar />
      <HomeContent
        featuredArticles={featuredArticles}
        featuredConversation={featuredConversation}
        otherConversations={otherConversations.slice(0, 3)}
        latestNews={latestNews}
        articleViewCounts={articleViewCounts}
        conversationViewCounts={conversationViewCounts}
      />
    </>
  );
}
