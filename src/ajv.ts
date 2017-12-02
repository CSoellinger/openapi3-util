import * as Ajv from 'ajv';
import * as path from 'path';

export const ajv = new Ajv();
ajv.addMetaSchema(require(path.resolve(__dirname, '..', 'schemas', 'json-schema-draft-04.json')));

export const validateOpenApi3Schema = ajv.compile(require(path.resolve(__dirname, '..', 'schemas', 'openapi-v3.json')));
