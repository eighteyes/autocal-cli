import { log } from 'console';
import { writeConfig } from './io.js';

export function handleSetConfig(argv) {
  log(argv);
  let config = argv.config;
  const targetKey = argv._[1];
  const targetVal = argv._[2];

  if (!targetKey) {
    log('No configuration key specified.');
  }

  if (!targetVal) {
    // read
  }

  config[targetKey] = targetVal;
  writeConfig(config);
}
