#! /usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { get, set, select } from 'autocal-core';
import yargs from 'yargs/yargs';
import { log, error } from 'console';

import { readConfig, writePlan, loadPlan } from './io.js';
import { handleList, handleListAll } from './list.js';
import { handleSet } from './set.js';
import { handleSelect } from './select.js';
import { handleAdd } from './add.js';

import chalk from 'chalk';
import { handleSetConfig } from './config.js';
import { handleMakePlan } from './gpt.js';

const usage = '\nUsage: acal [list|get|set|select]';
const options = yargs(process.argv.slice(2))
  .usage(usage)
  .config(readConfig())
  .option('p', {
    alias: 'plan',
    describe: 'Plan number',
    type: 'number',
    demandOption: false,
  })
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
  .option('n', {
    alias: 'count',
    default: 3,
    describe: 'How many activities to select',
  })
  .option('f', {
    alias: 'file',
    describe: 'File Input',
    type: 'string',
    demandOption: false,
  })
  .option('g', {
    alias: 'global',
    describe: 'Target Global Contexts',
    type: 'boolean',
    default: true,
    demandOption: false,
  })
  .command('list-all', 'list all plans', () => {}, handleListAll)
  .command(
    'list [context]',
    'list plan or context',
    (yargs) => {
      return yargs.positional('context', {
        describe: 'Context to list',
        type: 'number',
      });
    },
    handleList
  )
  .command(
    'add [value..]',
    'Add context or activity to context',
    (yargs) => {
      yargs.positional('value', {
        describe: 'Context or Activity to add',
        type: 'string',
      });
    },
    handleAdd
  )
  .command(
    'set [value..]',
    'Set context or activity inside context',
    (yargs) => {
      yargs.positional('value', {
        describe: 'Context or Activity to add',
        type: 'string',
      });
    },
    handleSet
  )
  .command(
    ['select <pattern|ordered|random>', '$0'],
    'Select activities to accomplish',
    (yargs) => {
      yargs.positional('value', {
        describe: 'Context or Activity to add',
        type: 'string',
      });
    },
    handleSelect
  )
  .command('config', 'Configure AutoCal CLI', () => {}, handleSetConfig)
  .command(
    'plan [value..]',
    'Configure AutoCal CLI',
    (yargs) => {
      yargs.positional('value', {
        describe: 'Brief description of the plan',
        type: 'string',
      });
    },
    handleMakePlan
  )
  .command('del', 'delete the thing')
  .middleware([loadPlan, buildVal, setCtx])
  .example([
    ['$0 add -c 1 A new Task ! #tag', 'Add a new task to context 1'],
    ['$0 set -c 1 -a 1 Renamed task', 'Swap out one for another'],
  ])
  .help()
  .parse().argv;

function buildVal(argv) {
  if (argv.value) {
    argv.value = argv.value.join(' ');
  }
}
function setCtx(argv) {
  if (
    argv.plan.length == 0 ||
    ['list', 'plan', 'list-all', 'config'].includes(argv._[0])
  ) {
    return;
  }
  if (argv.plan) {
    argv.config.selectedPlan = argv.planText;
  }
  if (argv.context) {
    argv.config.selectedContext = argv.context;
  }
  const opts = {
    type: 'context',
    format: 'array',
    lookup: 'display',
    filterVal: argv.config.selectedContext,
  };
  const ctxName = get(argv.planText, opts)[0];
  console.log(`Selected Context: %s`, chalk.green(ctxName));
}
