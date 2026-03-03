import { db } from "..";
import { feeds } from "../schema";

export type Feed = typeof feeds.$inferSelect; // feeds is the table object in schema.ts

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db.insert(feeds).values({url: url, userId: userId, name: name}).returning();
  return result;
}

