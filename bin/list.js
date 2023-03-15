import { get } from 'autocal-core';

import { readConfig, writePlan } from './io.js';

import { log } from 'console';

export function handleList(argv) {
  log(argv);

  if (argv.plan.length == 0) {
    return console.log(
      'No plan set. Use `acal add` to create Contexts and Activities.'
    );
  }
  if (argv.context) {
    // show context only
    let opts = {
      type: 'activity',
      format: 'array',
      lookup: 'display',
      filter: 'ctx-index',
      filterVal: argv.context - 1,
    };
    let acts = get(c.plan, opts);
    acts.forEach((act, i) => {
      log(i + 1, act);
    });
  } else {
    let ctxOpts = {
      type: 'context',
      format: 'array',
      lookup: 'display',
    };

    let actOpts = {
      type: 'activity',
      format: 'array',
      lookup: 'display',
      filter: 'ctx-index',
      filterVal: 0,
    };

    let ctxs = get(argv.plan, ctxOpts);

    ctxs.forEach((ctx, i) => {
      log(i + 1, ctx);
      actOpts.filterVal = i;
      let acts = get(argv.plan, actOpts);
      acts.forEach((act, i) => {
        log('  ', i + 1, act);
      });
    });
  }
}
