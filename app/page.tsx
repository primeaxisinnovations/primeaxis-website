import { getPublicArticles, getPublicConversations } from "@/lib/public-content";
import { getAllViewCounts } from "@/lib/view-counts";
import HomeContent from "@/components/sections/HomeContent";
import BreakingBar from "@/components/sections/BreakingBar";

export default async function Home() {
  const articles = await getPublicArticles();
  const featuredArticles = articles
    .filter((article) => article.section === "intelligence")
    .slice(0, 6);

  // Most recently published conversation is the featured one; the next
  // three (if they exist — never padded) fill the list beside it.
  const conversations = await getPublicConversations();
  const [featuredConversation, ...otherConversations] = conversations;

  // One Blob read per content type — read-only badges on the featured cards.
  const articleViewCounts = await getAllViewCounts("article");
  const conversationViewCounts = await getAllViewCounts("conversation");

  return (
    <>
      {/* The breaking-news bar uses the deployment's local article files. */}
      <BreakingBar />
      <HomeContent
        featuredArticles={featuredArticles}
        featuredConversation={featuredConversation}
        otherConversations={otherConversations.slice(0, 3)}
        articleViewCounts={articleViewCounts}
        conversationViewCounts={conversationViewCounts}
      />
    </>
  );
}
