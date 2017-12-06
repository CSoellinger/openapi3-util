export interface OpenAPI3Spec {
    openapi: string;
    info?: OpenAPI3Spec.Info;
    externalDocs?: OpenAPI3Spec.ExternalDocs | OpenAPI3Spec.ExternalDocs[];
    servers: OpenAPI3Spec.Servers | OpenAPI3Spec.Servers[];
    tags?: OpenAPI3Spec.Tags | OpenAPI3Spec.Tags[];
    components?: OpenAPI3Spec.Components;
    paths: OpenAPI3Spec.Paths;
}
export declare namespace OpenAPI3Spec {
    interface Info {
        title: string;
        description?: string;
        version: string;
        contact?: any;
    }
    interface ExternalDocs {
        url: string;
        description?: string;
    }
    interface Servers {
        url: string;
        description?: string;
    }
    interface Tags {
        name: string;
        description?: string;
    }
    interface Components {
        schemas?: Components.Schemas;
        securitySchemes?: any;
        parameters?: any;
        responses?: any;
        requestBodies?: any;
    }
    namespace Components {
        interface Schemas {
            [index: string]: Schema;
        }
        interface Schema {
            required?: string[];
            properties: Schema.Properties;
        }
        namespace Schema {
            interface Properties {
                [index: string]: Property;
            }
            interface Property {
                type: string;
                format?: string;
                description?: string;
                default?: any;
                oneOf?: any[];
                allOf?: any[];
                anyOf?: any[];
                nullable?: boolean;
                items?: any;
                enum?: any[];
                minimum?: number;
                maximum?: number;
                multipleOf?: number;
                exclusiveMinimum?: boolean;
                exclusiveMaximum?: boolean;
                additionalProperties?: any;
                minLength?: number;
                maxLength?: number;
                properties?: any;
            }
        }
    }
    interface Paths {
        [index: string]: Methods;
    }
    interface Methods {
        [index: string]: MethodOptions;
    }
    interface MethodOptions {
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
