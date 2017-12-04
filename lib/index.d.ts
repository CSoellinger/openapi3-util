import { OpenAPI3Spec } from './interface-specification';
export declare class OpenApi3UtilSyncClass {
    specification: OpenAPI3Spec;
    protected specificationOrig: OpenAPI3Spec;
    jsonSchema: any;
    protected parseJsonSync(content: string): OpenAPI3Spec;
    protected parseYamlSync(content: string): OpenAPI3Spec;
    loadFromContentSync(content: string, allowNoValidSpec?: boolean): OpenAPI3Spec;
    loadFromObjectSync(obj: OpenAPI3Spec, allowNoValidSpec?: boolean): OpenAPI3Spec | undefined;
    loadFromFilepathSync(path: string, allowNoValidSpec?: boolean): any;
    isValidSpecSync(): boolean;
    resolveAllOfSync(): OpenAPI3Spec;
    removePathSync(removePaths: string | string[], reverse?: boolean, allPaths?: OpenAPI3Spec.Paths): OpenAPI3Spec.Paths;
    dereferenceSync(): OpenAPI3Spec;
    getPathOptionsSync(path: string, method: string): OpenAPI3Spec.MethodOptions;
    getPathSchemaSync(path: string, method: string): any;
    getSecuritySchemaSync(schemaName: string): any;
    revertToLastLoadedSync(): OpenAPI3Spec;
}
export declare const OpenApi3UtilSync: OpenApi3UtilSyncClass;
export declare class OpenApi3UtilClass extends OpenApi3UtilSyncClass {
    protected parseJson(content: string): Promise<OpenAPI3Spec>;
    protected parseYaml(content: string): Promise<OpenAPI3Spec>;
    loadFromContent(content: string, allowNoValidSpec?: boolean): Promise<OpenAPI3Spec | undefined>;
    loadFromObject(obj: OpenAPI3Spec, allowNoValidSpec?: boolean): Promise<OpenAPI3Spec | undefined>;
    loadFromFilepath(path: string, allowNoValidSpec?: boolean): Promise<any>;
    isValidSpec(): Promise<boolean>;
    dereference(): Promise<OpenAPI3Spec>;
    resolveAllOf(): Promise<OpenAPI3Spec>;
    loadJsonSchema(): Promise<any>;
    removePath(removePaths: string | string[], reverse?: boolean, allPaths?: OpenAPI3Spec.Paths): Promise<OpenAPI3Spec.Paths>;
    getPathOptions(path: string, method: string): Promise<OpenAPI3Spec.MethodOptions>;
    getPathSchema(path: string, method: string): Promise<any>;
    getSecuritySchema(schemaName: string): Promise<any>;
    revertToLastLoaded(): Promise<OpenAPI3Spec>;
    constructor();
}
export declare const OpenApi3Util: OpenApi3UtilClass;
export default OpenApi3Util;
