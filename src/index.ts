import { CommandRegistry, handlerAgg, handlerLogin, handlerRegister, handlerReset, handlerUsers, runCommand } from "./command";


async function main() {

  const registry: CommandRegistry = {
    commands: {
      "login": handlerLogin , 
      "register": handlerRegister,
      "reset": handlerReset,
      "users": handlerUsers,
      "agg": handlerAgg
    }
  };

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
