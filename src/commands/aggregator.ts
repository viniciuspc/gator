import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { createPost } from "src/lib/db/queries/posts";
import { fetchFeed } from "src/lib/rss";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length < 1) {
    throw "agg needs 1 parameters: time_between_reqs for example: 1s or 1m or 1h";
  }

  const timeBetweenRequests = parseDuration(args[0]);

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

async function scrapeFeeds() {
  const nextFedToFetch = await getNextFeedToFetch();

  await markFeedFetched(nextFedToFetch.id);

  const rssFeed = await fetchFeed(nextFedToFetch.url);

  console.log(
    `Items in fetched rss feed ${nextFedToFetch.name} - ${nextFedToFetch.url}`,
  );
  for (const item of rssFeed.channel.item) {
    createPost(
      nextFedToFetch.id,
      item.link,
      new Date(Date.parse(item.pubDate)),
      item.title,
      item.description
    );
    console.log(` - Title: ${item.title}`);
    console.log(`   PubDate: ${Date.parse(item.pubDate)}`);
    console.log(`   Link: ${item.link}`);
    console.log(`   Description: ${item.description}`);
  }
}

function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) {
    throw `The duration ${durationStr} is invalida. Try 1s, 1m, 1h`;
  }

  const [_, value, unit] = match;

  const intValue = parseInt(value);

  switch (unit) {
    case "ms":
      return intValue;
    case "s":
      return intValue * 1000;
    case "m":
      return intValue * 1000 * 60;
    case "h":
      return intValue * 1000 * 60 * 60;
    default:
      return intValue;
  }
}
function handleError(reason: any): PromiseLike<never> {
  throw new Error(`Error durtin scrapeFeeds: ${reason}`);
}
