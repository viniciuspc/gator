import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "..";
import { feedFollows, posts } from "../schema";

export type Post = typeof posts.$inferSelect;

export async function createPost(
  feedId: string,
  url: string,
  publishedAt: Date,
  title?: string,
  description?: string,
): Promise<Post> {
  const [result] = await db
    .insert(posts)
    .values({
      url: url,
      publishedAt: publishedAt,
      feedId: feedId,
      title: title,
      description: description,
    })
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getPostsForUser(
  userId: string,
  limit: number,
): Promise<Post[]> {
  return await db
    .select({ ...getTableColumns(posts) })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}
