"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepmerge = require("deepmerge");
exports.resolveAllOf = (obj) => {
    if (Array.isArray(obj)) {
        obj.map((allOf) => allOf = exports.resolveAllOf(allOf));
    }
    else {
        for (let key in obj) {
            if (obj[key]) {
                if (typeof (obj[key]) === 'object' && Array.isArray(obj[key]) === false || key === 'allOf') {
                    obj[key] = exports.resolveAllOf(obj[key]);
                }
                if (key === 'allOf') {
                    obj = deepmerge.all([obj, ...obj[key]]);
                    delete obj[key];
                }
            }
        }
    }
    return obj;
};
exports.default = exports.resolveAllOf;
//# sourceMappingURL=resolve-all-of.js.map