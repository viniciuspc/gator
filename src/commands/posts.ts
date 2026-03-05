import { getPostsForUser, Post } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/queries/users";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
  
  let limit = 2;

  if(args.length >= 1) {
    try {
      limit = parseInt(args[0])
    } catch(e) {
      throw "The limit parameter must be an integer."
    }
  }

  const posts = await getPostsForUser(user.id, limit);

  for(const post of posts){
    printPost(post);
  }
}

function printPost(post: Post): void {
    console.log(` - Title: ${post.title}`);
    console.log(`   PubDate: ${post.publishedAt}`);
    console.log(`   Link: ${post.url}`);
    console.log(`   Description: ${post.description}`);
}


