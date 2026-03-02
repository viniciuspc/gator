import { setUser } from "./config"

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => void;

export type CommandRegistry = {
  commands: Record<string, CommandHandler>
};

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("Login expect 1 argument: the username")
  }
  const username = args[0];
  setUser(username);
  console.log(`User ${username} has been set.`);

}

export function registerCommand(resgistry: CommandRegistry, cmdName: string, handler: CommandHandler) {
  resgistry.commands[cmdName] = handler;
}

export function runCommand(resgistry: CommandRegistry, cmdName: string, ...args: string[]) {
  const commandHandler = resgistry.commands[cmdName];
  if (commandHandler) {
    commandHandler(cmdName, ...args);
  }
}
