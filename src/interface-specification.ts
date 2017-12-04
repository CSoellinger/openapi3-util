export interface OpenAPI3Spec {
  openapi: string;
  info?: OpenAPI3Spec.Info;
  externalDocs?: OpenAPI3Spec.ExternalDocs | OpenAPI3Spec.ExternalDocs[];
  servers: OpenAPI3Spec.Servers | OpenAPI3Spec.Servers[];
  tags?: OpenAPI3Spec.Tags | OpenAPI3Spec.Tags[];
  components?: OpenAPI3Spec.Components;
  paths: OpenAPI3Spec.Paths;
}

export namespace OpenAPI3Spec {
  export interface Info {
    title: string;
    description?: string;
    version: string;
    contact?: any;
  }

  export interface ExternalDocs {
    url: string;
    description?: string;
  }

  export interface Servers {
    url: string;
    description?: string;
  }

  export interface Tags {
    name: string;
    description?: string;
  }

  export interface Components {
    schemas?: any;
    securitySchemes?: any;
    parameters?: any;
    responses?: any;
    requestBodies?: any;
  }

  export interface Paths {
    [index: string]: Methods;
  }

  export interface Methods {
    [index: string]: MethodOptions;
  }

  export interface MethodOptions {
    tags?: string[];
    summary?: string;
    description?: string;
    operationId?: string;
    parameters?: any[];
    requestBody?: any;
    responses: any;
    security?: any;
  }
}
