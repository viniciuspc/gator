import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
      "Accept": "application/xml, text/xml" // Good practice for RSS
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status}`);
  }

  const xml = await response.text();
  const parser = new XMLParser();
  const parsedXml = parser.parse(xml);

  const channel = parsedXml.rss?.channel;
  if (!channel || !channel.title || !channel.link || !channel.description) {
    throw new Error("Missing channel metadata");
  }

  // Normalize items to an array
  const rawItems = channel.item 
    ? (Array.isArray(channel.item) ? channel.item : [channel.item])
    : [];

  const items: RSSItem[] = [];
  for (const item of rawItems) {
    if (item.title && item.link && item.description && item.pubDate) {
      items.push({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate
      });
    }
  }

  return {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: items
    }
  };
}
