"use strict";
/**
 *
 * Config module
 *
 * @packageDocumentation
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const i0n_1 = __importDefault(require("i0n"));
const index_js_1 = require("./log/index.js");
function config(params) {
    if (params.debug === true) {
        index_js_1.log.params.log_level = i0n_1.default.LOG_LEVEL.TRACE;
    }
}
exports.config = config;
//# sourceMappingURL=config.js.map