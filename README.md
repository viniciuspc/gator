# Gator
An RSS feed aggregator in TypeScript! We'll call it "Gator", you know, because aggreGATOR 🐊.

### Prerequisites:

- Install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) to manage node.js versions.

### Run the progam.

Use the node.js version from .nvmrc
```bash
nvm use
```

Install all depencies:
```bash
npm install
```

Add the config file to `~/.gatorconfig.json` with the db connection url:
```json
{
  "db_url": "postgres://example"
}
```

Start gator with:
```bash
npm run start
```

### Commands:

- `npm run start register USERNAME`: To register a new user and login.
- `npm run start login USERNAME`: To login with an existed user and login.
- `npm run start addfeed NAME URL`: To register a new feed and follow it.
- `npm run start feeds`: To list all feeds.
- `npm run start follow URL`: To follow a feed.
- `npm run start unfollow URL`: To unfollow a feed.
- `npm run start agg`: To start the aggregator to save posts of the created feeds.
- `npm run start browser LIMIT(Optional)`: To see the posts of the feeds that you are following. 
