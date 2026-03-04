import { readConfig } from "src/config";
import { createFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feedFollows";
import { getFeedByURL } from "src/lib/db/queries/feeds";
import { getUserByName } from "src/lib/db/queries/users";

export async function handlerFollow(cmdName: string, ...args: string[]){
  if(args.length != 1){
    throw "follow needs 1 arguments: The feed URL to follow."
  }

  const currentUsername = readConfig().currentUserName;
  if (!currentUsername) {
    throw "There are no user logged in.";
  }

  const [user] = await getUserByName(currentUsername);

  if (!user) {
    throw `Can´t get user ${currentUsername} from the database.`;
  }

  const [feedUrl] = args;

  const [feed] = await getFeedByURL(feedUrl);
  
  if (!feed ) {
    throw `Can´t get feed with url ${feedUrl} from the database.`;
  }

  const [newFeedFollow] = await createFeedFollow(user.id, feed.id);

  if(!newFeedFollow){
    throw `Could not create a feed follow for user ${user.name} and url ${feedUrl}`
  }

  console.log(`User ${newFeedFollow.userName} is now following feed ${newFeedFollow.feedName}`)


};

export async function handlerFollowing(cmdName: string, ...args: string[]){

  const currentUsername = readConfig().currentUserName;
  if (!currentUsername) {
    throw "There are no user logged in.";
  }

  const [user] = await getUserByName(currentUsername);

  if (!user) {
    throw `Can´t get user ${currentUsername} from the database.`;
  }

  const feedFollows = await getFeedFollowsForUser(user.id);

  console.log(`Found ${feedFollows.length} feeds for user ${user.name}`)

  for(const feedFollow of feedFollows){
    console.log(` - ${feedFollow.feedName}`);
  }

}
