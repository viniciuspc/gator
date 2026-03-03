import { readConfig } from "src/config";
import { createFeed, Feed } from "src/lib/db/queries/feeds";
import { getUserByName, User } from "src/lib/db/queries/users";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  const currentUsername = readConfig().currentUserName; 
  if(!currentUsername) {
    throw "There are no user logged in.";
  }

  const users = await getUserByName(currentUsername);

  if(!users || users.length == 0 || users.length > 1){
    throw `Can´t get user ${currentUsername} from the database.`; 
  }

  if(args.length < 2){
   throw "addfeed needs 2 parameters: Name and URL"
  }

  const feedName = args[0];
  const url = args[1];
  
  const feed = await createFeed(feedName, url, users[0].id);
  
  printFeed(feed, users[0]);
}

export function printFeed(feed: Feed, user: User){
 console.log(`User => id: ${user.id}, name: ${user.name}, createdAt: ${user.createdAt}, updatedAt: ${user.updatedAt} `);
 console.log(`Feed => id: ${feed.id}, name: ${feed.name}, url: ${feed.url}, userId: ${feed.userId}, createdAt: ${feed.createdAt}, updatedAt: ${feed.updatedAt} `);
}

