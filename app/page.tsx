import { getAllArticles } from "@/lib/content";
import { getAllConversations } from "@/lib/conversation-content";
import HomeContent from "@/components/sections/HomeContent";

// ISR: served from the CDN cache, regenerated in the background at most
// once every 60s — a Publish/Unpublish/Save shows up within ~a minute.
export const revalidate = 60;

export default async function Home() {
  // Single getAllArticles() call, reused for the featured grid and the
  // breaking-bar ticker — both just need the same already-sorted-by-date
  // list, so there's no reason to hit GitHub for it twice.
  const articles = await getAllArticles();
  const featuredArticles = articles.slice(0, 6);
  const latestArticles = articles.slice(0, 5);

  // Most recently published conversation is the featured one; the next
  // three (if they exist — never padded) fill the list beside it.
  const conversations = await getAllConversations();
  const [featuredConversation, ...otherConversations] = conversations;

  return (
    <HomeContent
      featuredArticles={featuredArticles}
      latestArticles={latestArticles}
      featuredConversation={featuredConversation}
      otherConversations={otherConversations.slice(0, 3)}
    />
  );
}
