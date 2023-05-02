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
    planText: JSON.parse(fs.readFileSync(planLoc).toString()),
  };
}

export function loadPlan(index) {
  return JSON.parse(fs.readFileSync(planLoc).toString());
}
export function writeConfig(config) {
  fs.writeFileSync(path.join(configDir, configFile), JSON.stringify(config));
}

export function writePlan(plan) {
  fs.writeFileSync(planLoc, plan);
}

export function writeNewPlan(filename, plan) {
  fs.writeFileSync(configDir + '/' + filename, JSON.stringify(plan));
}

export function readPlans() {
  let files = fs.readdirSync(configDir);
  files.forEach((file) => {
    // Check if the file is a regular file and not a directory
    const filePath = path.join(configDir, file);
    const lines = [];
    if (fs.statSync(filePath).isFile() && file.endsWith('.acr')) {
      const snakeCase = file
        .slice(0, file.lastIndexOf('.'))
        .toLowerCase()
        .replace(/_/g, ' ');
      const normalCase = snakeCase
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const newFileName = `${normalCase}`;
      //ty gpt
      fileNames.push(`${newFileName}`);
    }
  });
  return fileNames;
}

export function displayPlans() {
  let lines = readPlans();
  lines.forEach((fileName, i) => {
    console.log(`${i}: ${fileName}`);
  });
}
