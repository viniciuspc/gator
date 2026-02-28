# gator
An RSS feed aggregator in TypeScript! We'll call it "Gator", you know, because aggreGATOR 🐊.

## Run the progam.
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
