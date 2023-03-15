import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

import { log, error } from 'console';

const configDir = os.homedir() + '/.config/autocal';
const configFile = 'config.json';
const planFile = 'plan.acr';
const configLoc = path.join(configDir, configFile);
const planLoc = path.join(configDir, planFile);

export function readConfig() {
  // make if none
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (!fs.existsSync(configLoc)) {
    writeConfig({ pattern: '+-+', selectionCount: 3 });
    writePlan('');
  }

  return {
    config: JSON.parse(fs.readFileSync(configLoc).toString()),
    plan: JSON.parse(fs.readFileSync(planLoc).toString()),
  };
}

export function writeConfig(config) {
  fs.writeFileSync(path.join(configDir, configFile), JSON.stringify(config));
}

export function writePlan(plan) {
  fs.writeFileSync(planLoc, JSON.stringify(plan));
}
