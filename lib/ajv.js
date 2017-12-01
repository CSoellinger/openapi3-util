"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ajv = require("ajv");
exports.ajv = new Ajv();
exports.ajv.addMetaSchema(require('./schemas/json-schema-draft-04.json'));
exports.validateOpenApi3Schema = exports.ajv.compile(require('./schemas/openapi-v3.json'));
//# sourceMappingURL=ajv.js.map