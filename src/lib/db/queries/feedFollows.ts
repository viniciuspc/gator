import { and, eq, sql } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema"

export type FeedFollows = typeof feedFollows.$inferSelect;

export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db.insert(feedFollows).values({userId, feedId}).returning();

  return await db.select({
    feedFollowsId: feedFollows.id,
    feddFollowsCreatedAt: feedFollows.createdAt,
    feedFollowsUpdatedAt: feedFollows.updatedAt,
    feedName: feeds.name, 
    userName: users.name
  }).from(feedFollows).where(sql`${feedFollows.id} = ${newFeedFollow.id}`)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id));
}

export async function getFeedFollowsForUser(userId: string) {
  return await db.select({
    userName: users.name,
    feedName: feeds.name
  }).from(feedFollows).where(sql`${feedFollows.userId} = ${userId}`)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id));
}

export async function unfollow(userId: string, feedId: string) : Promise<FeedFollows[]> {
  return await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)))
    .returning();
}
