import { readConfig } from "src/config";
import { getUserByName, User } from "src/lib/db/queries/users";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type CommandRegistry = {
  commands: Record<string, CommandHandler>;
};

export function middlewareLoggedIn(
  handler: UserCommandHandler,
): CommandHandler {
  const fn: CommandHandler = async (cmdName: string, ...args: string[]) => {
    const currentUsername = readConfig().currentUserName;
    if (!currentUsername) {
      throw "There are no user logged in.";
    }

    const [user] = await getUserByName(currentUsername);

    if (!user) {
      throw `Can´t get user ${currentUsername} from the database.`;
    }
    return handler(cmdName, user, ...args);
  };

  return fn;
}

export function registerCommand(
  resgistry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  resgistry.commands[cmdName] = handler;
}

export async function runCommand(
  resgistry: CommandRegistry,
  cmdName: string,
  ...args: string[]
) {
  const commandHandler = resgistry.commands[cmdName];
  if (commandHandler) {
    await commandHandler(cmdName, ...args);
  } else {
    throw Error(
      `Handler for command ${cmdName} not found in registry: ${resgistry}`,
    );
  }
}
