import { CommandRegistry, handlerLogin, runCommand } from "./command";
import { readConfig, setUser } from "./config";


function main() {
  
  const registry: CommandRegistry = {
    commands: {"login": handlerLogin}
  };

  const processArgs = process.argv.slice(2);
  
  if(processArgs.length < 1){
    console.error("Not enough arguments were provided. Exiting...")
    process.exit(1);
  }

  const [cmdName, ...args] = processArgs;
  
  try{
    runCommand(registry, cmdName, ...args); 
  } catch(e){
    if(e instanceof Error){
      console.error(e.message);
    } else {
      console.error(e);
    }
    process.exit(1);
  }
  console.log(readConfig());
  
}

main();
