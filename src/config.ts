/**
 *
 * Config module
 *
 * @packageDocumentation
 *
 */

import ion from 'i0n';
import {log} from './log/index.js';

type ConfigParams = {
  debug: boolean;
};

export function config(params: Partial<ConfigParams>) {
  if (params.debug === true) {
    log.params.log_level = ion.LOG_LEVEL.TRACE;
  }
}
