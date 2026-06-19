import { getAllArticles } from "@/lib/content";
import HomeContent from "@/components/sections/HomeContent";

export default function Home() {
  const [heroArticle, ...rest] = getAllArticles();
  const cardArticles = rest.slice(0, 4);

  return <HomeContent heroArticle={heroArticle} cardArticles={cardArticles} />;
}
