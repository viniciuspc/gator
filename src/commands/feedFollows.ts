import { createFeedFollow, getFeedFollowsForUser, unfollow } from "src/lib/db/queries/feedFollows";
import { getFeedByURL } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/queries/users";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]){
  if(args.length != 1){
    throw "follow needs 1 arguments: The feed URL to follow."
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

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]){
  const feedFollows = await getFeedFollowsForUser(user.id);

  console.log(`Found ${feedFollows.length} feeds for user ${user.name}`)

  for(const feedFollow of feedFollows){
    console.log(` - ${feedFollow.feedName}`);
  }

}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]){
  if(args.length != 1){
    throw "follow needs 1 arguments: The feed URL to ufollow."
  }

  const [feedUrl] = args;
  
  const [feed] = await getFeedByURL(feedUrl);
  
  if (!feed ) {
    throw `Can´t get feed with url ${feedUrl} from the database.`;
  }



  const [unfollowedFeed] = await unfollow(user.id, feed.id);

  if(!unfollowedFeed){
    throw `Could find feed to unfollow for user ${user.name} and url ${feedUrl}`
  }

  console.log(`User ${user.name} has unfollowed feed ${feed.name}`)


};

