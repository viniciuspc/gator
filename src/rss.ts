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

export async function fetchFeed(feedURL: string) {
  console.log(`Fetching RSS from: ${feedURL}`);

  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "viniciuspc-gator"
    }
  })

  const xml = await response.text();

  const parser = new XMLParser();

  const parsedXml = parser.parse(xml);


  const { channel } = parsedXml.rss;

  if (channel) {

    const { title, link, description, item } = channel;

    if (title && link && description) {

      const items = new Array<RSSItem>;

      if (item) {
        if (Array.isArray(item)) {
          for (const { title, link, description, pubDate } of item) {
            if (title && link && description && pubDate) {
              items.push({ title, link, description, pubDate })
            }
          }
        } else {
          const { title, link, description, pubDate } = item;
          items.push({ title, link, description, pubDate })

        }
      }

      const rssFeed: RSSFeed = { channel: { title, link, description, item: items } }
      return rssFeed;
    } else {
      throw Error("Title or link or description does not exists.")
    }

  } else {
    throw Error("Channel does not exists.")
  }

}
