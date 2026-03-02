import { setUser, readConfig } from "./config"
import { createUser, getUserByName, getUsers, resetUsers } from "./lib/db/queries/users";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type CommandRegistry = {
  commands: Record<string, CommandHandler>
};

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("Login expect 1 argument: the username")
  }
  const username = args[0];
  const dbUser = await getUserByName(username);
  if (dbUser.length > 0) {
    setUser(username);
    console.log(`User ${username} has been set.`);
  } else {
    throw Error(`User ${username} does not exists.`);
  }
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("Register expect 1 argument: the username")
  }
  const username = args[0];
  const usersFromDb = await getUserByName(username);
  if (usersFromDb.length > 0) {
    throw Error(`User ${username} already registered in the database.`)
  }
  const userCreated = await createUser(username);
  setUser(username);
  console.log(`User ${username} was registred to the database.`);
  console.log(`User created user: ${userCreated.id} | ${userCreated.name} | ${userCreated.createdAt} | ${userCreated.updatedAt} `)
}

export async function handlerReset(cmdName: string, ...args: string[]) {
  await resetUsers();
  console.log(`All users deleted.`)
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
  const users = await getUsers();
  for(const user of users){
    console.log(`* ${user.name}${user.name === readConfig().currentUserName ? " (current)" : ""}`);  
  }
}



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
