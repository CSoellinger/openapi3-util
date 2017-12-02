"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ajv = require("ajv");
const path = require("path");
exports.ajv = new Ajv();
exports.ajv.addMetaSchema(require(path.resolve(__dirname, '..', 'schemas', 'json-schema-draft-04.json')));
exports.validateOpenApi3Schema = exports.ajv.compile(require(path.resolve(__dirname, '..', 'schemas', 'openapi-v3.json')));
//# sourceMappingURL=ajv.js.map