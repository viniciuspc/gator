import { handlerAgg } from "./commands/aggregator";
import { CommandRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerAddFeed } from "./commands/feeds";
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands/users";


async function main() {

  const registry: CommandRegistry = { commands: {} }

  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", handlerAddFeed);



  const processArgs = process.argv.slice(2);

  if (processArgs.length < 1) {
    console.error("Not enough arguments were provided. Exiting...")
    process.exit(1);
  }

  const [cmdName, ...args] = processArgs;

  try {
    await runCommand(registry, cmdName, ...args);
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error(e);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
