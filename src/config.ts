import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string,
  currentUserName?: string,
}

export function setUser(user: string) {
  const currentConfig = readConfig();
  currentConfig.currentUserName = user;
  writeConfig(currentConfig);
}

export function readConfig(): Config {
  const rawConfig = JSON.parse(fs.readFileSync(getConfigFilePath(), {encoding: 'utf-8'}));
  return validateConfig(rawConfig);
}

function getConfigFilePath() {
  return  path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config) {
  const toWrite = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  fs.writeFileSync(getConfigFilePath(), JSON.stringify(toWrite));
}

function validateConfig(rawConfig: any): Config {

  if (typeof rawConfig !== "object" || rawConfig === null) {
    throw new Error("Invalid config: not an object");
  }
  if (typeof rawConfig.db_url !== "string") {
    throw new Error("Invalid config: dbUrl must be a string");
  }
  if (rawConfig.current_user_name && typeof rawConfig.current_user_name !== "string") {
    throw new Error("Invalid config: age must be a number");
  }
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
}
