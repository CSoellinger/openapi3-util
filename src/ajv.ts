import * as Ajv from 'ajv';

export const ajv = new Ajv();
ajv.addMetaSchema(require('./schemas/json-schema-draft-04.json'));

export const validateOpenApi3Schema = ajv.compile(require('./schemas/openapi-v3.json'));
