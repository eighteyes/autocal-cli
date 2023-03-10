import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

import { log, error } from 'console';

const configDir = os.homedir() + '/.config/autocal';
const configFile = 'config.json';
const configLoc = path.join(configDir, configFile);

export function readConfig() {
  // make if none
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (!fs.existsSync(configLoc)) {
    let config = { plan: '' };
    fs.writeFileSync(configLoc, JSON.stringify(config));
  }

  return JSON.parse(
    fs.readFileSync(path.join(configDir, configFile)).toString()
  );
}

export function writeConfig(config) {
  log('Writing', config);
  fs.writeFileSync(path.join(configDir, configFile), JSON.stringify(config));
}

export function savePlan(plan) {
  let c = readConfig();
  c.plan = plan;
  writeConfig(c);
}
