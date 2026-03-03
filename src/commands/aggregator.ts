import { fetchFeed } from "src/lib/rss";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  
  const feedUrl = "https://www.wagslane.dev/index.xml";
  
  const rssFeed = await fetchFeed(feedUrl);
  console.dir(rssFeed, {depth: null});
}
