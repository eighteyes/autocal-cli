import { get, set, select } from 'autocal-core';

import { readConfig, writePlan } from './io.js';
import { log } from 'console';

import chalk from 'chalk';

export function handleAdd(argv) {
  let c = readConfig();
  if (parseInt(argv.value) == argv.value || !argv.value) {
    return console.log('Bad input');
  }
  const value = argv.value;

  let newPlan;
  if (argv.context) {
    // ctx set, add activity
    let opts = {
      type: 'activity',
      op: 'add',
      // 0 index = 1 for user
      targetContextIndex: argv.context - 1,
      value: value,
    };
    newPlan = set(c.plan, opts);
    log('New Activity:', chalk.green(value));
  } else {
    newPlan = set(c.plan, {
      type: 'context',
      op: 'add',
      value: value,
    });
    log('New Context:', chalk.green(value));
  }

  writePlan(newPlan);
}
