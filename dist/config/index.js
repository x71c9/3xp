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
exports.weights = void 0;
exports.set = set;
const i0n_1 = __importDefault(require("i0n"));
const w3i_1 = require("w3i");
const index_1 = require("../log/index");
exports.weights = new w3i_1.Weights({
    debug: false,
    spinner: index_1.log.spinner,
});
function set(params) {
    /**
     * Spinner contains methods, therefore cannot be cloned by weights.set,
     * otherwise it is distroyed by JSON.stringify when cloning.
     */
    if (params.spinner) {
        index_1.log.spinner = params.spinner;
    }
    /**
     * It must be also deleted from the params otherwise it is been deleted since
     * it is a reference
     */
    delete params.spinner;
    exports.weights.set(params);
    if (params.debug === true) {
        index_1.log.params.log_level = i0n_1.default.LOG_LEVEL.TRACE;
    }
}
//# sourceMappingURL=index.js.map