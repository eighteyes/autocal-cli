#! /usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { get, set, select } from 'autocal-core';
import yargs from 'yargs/yargs';
import { log, error } from 'console';

import { readConfig, savePlan } from './io.js';
import { handleList } from './list.js';
import { handleSet } from './set.js';
import { handleSelect } from './select.js';
import { handleAdd } from './add.js';

const usage = '\nUsage: acal [list|get|set|select]';
const options = yargs(process.argv.slice(2))
  .usage(usage)
  .config(readConfig())
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
    'select [value..]',
    'Set context or activity inside context',
    (yargs) => {
      yargs.positional('value', {
        describe: 'Context or Activity to add',
        type: 'string',
      });
    },
    handleSelect
  )
  .command('del', 'delete the thing')
  .middleware([buildVal])
  .help()
  .parse().argv;

function buildVal(argv) {
  if (argv.value) {
    argv.value = argv.value.join(' ');
  }
}
