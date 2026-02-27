import { readConfig, setUser } from "./config";


function main() {
  

  setUser("Vinicius");

  console.log(readConfig());
  
}

main();
