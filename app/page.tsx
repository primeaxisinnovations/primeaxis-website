import { getAllArticles } from "@/lib/content";
import { getAllConversations } from "@/lib/conversation-content";
import HomeContent from "@/components/sections/HomeContent";

// Reads live from GitHub on every request (see lib/content.ts /
// lib/conversation-content.ts) — must stay dynamic so a Publish/Unpublish/
// Save never waits on a rebuild.
export const dynamic = "force-dynamic";

export default async function Home() {
  // Single getAllArticles() call, reused for the hero/card grid and the
  // breaking-bar ticker — both just need the same already-sorted-by-date
  // list, so there's no reason to hit GitHub for it twice.
  const articles = await getAllArticles();
  const [heroArticle, ...rest] = articles;
  const cardArticles = rest.slice(0, 4);
  const latestArticles = articles.slice(0, 5);

  // Most recently published conversation is the featured one; the next
  // three (if they exist — never padded) fill the list beside it.
  const conversations = await getAllConversations();
  const [featuredConversation, ...otherConversations] = conversations;

  return (
    <HomeContent
      heroArticle={heroArticle}
      cardArticles={cardArticles}
      latestArticles={latestArticles}
      featuredConversation={featuredConversation}
      otherConversations={otherConversations.slice(0, 3)}
    />
  );
}
