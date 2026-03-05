import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";

export type Feed = typeof feeds.$inferSelect; // feeds is the table object in schema.ts

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db.insert(feeds).values({url: url, userId: userId, name: name}).returning();
  return result;
}

export async function getFeeds(){
  return await db.select({
    feedName: feeds.name, 
    feedURL: feeds.url, 
    userName: users.name
  }).from(feeds).innerJoin(users, eq(users.id, feeds.userId));
}

export async function getFeedByURL(url: string){
  return await db.select()
    .from(feeds)
    .where(sql`${feeds.url} = ${url}`)
    .limit(1);
}

export async function markFeedFetched(feedId: string): Promise<Feed> {
  const [markedFeedFetched] = await db.update(feeds).set({lastFetchedAt: new Date()}).where(eq(feeds.id, feedId)).returning();
  return markedFeedFetched;
}

export async function getNextFeedToFetch(): Promise<Feed> {
 const [nextFeedToFecth] = await db.select()
  .from(feeds)
  .orderBy(sql`last_fetched_at ASC NULLS FIRST`)
  .limit(1);

  return nextFeedToFecth;
}
