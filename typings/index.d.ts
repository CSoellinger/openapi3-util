export interface OpenAPI3Spec {
  openapi: string;
  info?: OpenAPI3SpecInfo;
  externalDocs?: OpenAPI3SpecExternalDocs | OpenAPI3SpecExternalDocs[];
  servers: OpenAPI3SpecServers | OpenAPI3SpecServers[];
  tags?: OpenAPI3SpecTags | OpenAPI3SpecTags[];
  components: OpenAPI3SpecComponents;
  paths: OpenAPI3SpecPaths;
  // 'x-openapi-mongoose'?: OpenAPI3MongooseGlobalOptions;
}

export interface OpenAPI3SpecInfo {
  title: string;
  description: string;
  version: string;
  contact: any;
}

export interface OpenAPI3SpecExternalDocs {
  url: string;
  description: string;
}

export interface OpenAPI3SpecServers {
  url: string;
  description: string;
}

export interface OpenAPI3SpecTags {
  name: string;
  description: string;
}

export interface OpenAPI3SpecComponents {
  // schemas: OpenAPI3SpecComponentSchemas;
  schemas: any;
  securitySchemes: any;
  parameters: any;
  responses: any;
  requestBodies: any;
}

export interface OpenAPI3SpecPaths {
  [index: string]: OpenAPI3SpecMethods;
}

export interface OpenAPI3SpecMethods {
  [index: string]: OpenAPI3SpecMethodOptions;
}

export interface OpenAPI3SpecMethodOptions {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: any;
  requestBody?: any;
  responses: any;
  security?: any;
  // 'x-handle-mongoose-model'?: string;
  // 'x-middleware-handle-request'?: string;
  // 'x-middleware-send-response'?: string;
}

// export interface OpenAPI3MongooseGlobalOptions {
//   'schema-options': {
//     'exclude-schemas': any[];
//   };
// }
