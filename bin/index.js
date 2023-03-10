#! /usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { get, set, select } from 'autocal-core';
import yargs from 'yargs/yargs';
import { log, error } from 'console';

import { readConfig, savePlan } from './io.js';

const usage = '\nUsage: acal [list|get|set|select]';
const options = yargs(process.argv.slice(2))
  .usage(usage)
  .option('c', {
    alias: 'context',
    describe: 'Context Number',
    type: 'number',
    demandOption: false,
  })
  .option('a', {
    alias: 'activity',
    describe: 'Activity number',
    type: 'number',
    demandOption: false,
  })
  .command(
    ['list'],
    'list plan or context',
    (yargs) =>
      yargs.positional('context', {
        describe: 'Context to list',
        type: 'number',
      }),
    handleList
  )
  .command(
    'add [value..]',
    'Add context or activity to to context',
    (yargs) => {
      yargs.positional('value', {
        describe: 'Context or Activity to add',
        type: 'string',
      });
    },
    handleAdd
  )
  .command('del', 'delete the thing')
  .help()
  .parse().argv;

function handleList(argv) {
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

function handleAdd(argv) {
  log(argv);
  let c = readConfig();
  if (parseInt(argv.value) == argv.value || !argv.value) {
    return console.log('Bad input');
  }
  const value = argv.value.join(' ');

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
  } else {
    newPlan = set(c.plan, {
      type: 'context',
      op: 'add',
      value: value,
    });
  }
  log(newPlan);
  savePlan(newPlan);
}
