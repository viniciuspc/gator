export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type CommandRegistry = {
  commands: Record<string, CommandHandler>
};



export function registerCommand(resgistry: CommandRegistry, cmdName: string, handler: CommandHandler) {
  resgistry.commands[cmdName] = handler;
}

export async function runCommand(resgistry: CommandRegistry, cmdName: string, ...args: string[]) {
  const commandHandler = resgistry.commands[cmdName];
  if (commandHandler) {
    await commandHandler(cmdName, ...args);
  } else {
    throw Error(`Handler for command ${cmdName} not found in registry: ${resgistry}`)
  }
}
