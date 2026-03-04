import { createFeedFollow } from "src/lib/db/queries/feedFollows";
import { createFeed, Feed, getFeeds } from "src/lib/db/queries/feeds";
import {  User } from "src/lib/db/queries/users";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
  
  if (args.length < 2) {
    throw "addfeed needs 2 parameters: Name and URL"
  }

  const [feedName, url] = args;

  const feed = await createFeed(feedName, url, user.id);
  
  await createFeedFollow(user.id, feed.id);

  printFeed(feed, user);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  const feeds = await getFeeds();

  console.log("###################################")
  for (const feed of feeds) {
    console.log(`Feed name: ${feed.feedName}`);
    console.log(`Feed url: ${feed.feedURL}`);
    console.log(`Username: ${feed.userName}`);
    console.log("###################################")

  }

}

function printFeed(feed: Feed, user: User) {
  console.log(`User => id: ${user.id}, name: ${user.name}, createdAt: ${user.createdAt}, updatedAt: ${user.updatedAt} `);
  console.log(`Feed => id: ${feed.id}, name: ${feed.name}, url: ${feed.url}, userId: ${feed.userId}, createdAt: ${feed.createdAt}, updatedAt: ${feed.updatedAt} `);
}

