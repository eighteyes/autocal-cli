import { get, set, select } from 'autocal-core';
import { log } from 'console';

import { writePlan } from './io.js';

export function handleSet(argv) {
  log(argv);

  let newPlan;
  if (argv.activity) {
    const opts = {
      type: 'activity',
      op: 'replace',
      targetContextIndex: argv.context - 1,
      targetActivityIndex: argv.activity - 1,
      value: argv.value,
    };

    newPlan = set(argv.plan, opts);
  } else {
    const opts = {
      type: 'context',
      op: 'replace',
      targetContextIndex: argv.context - 1,
      value: argv.value,
    };

    newPlan = set(argv.plan, opts);
  }
  writePlan(newPlan);
}
