import { get } from 'autocal-core';

import { readConfig, savePlan } from './io.js';

import { log } from 'console';

export function handleList(argv) {
  log(argv);
  let c = readConfig();

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

    let ctxs = get(c.plan, ctxOpts);

    ctxs.forEach((ctx, i) => {
      log(i + 1, ctx);
      actOpts.filterVal = i;
      let acts = get(c.plan, actOpts);
      acts.forEach((act, i) => {
        log('  ', i + 1, act);
      });
    });
  }
}
