import { OpenAPI3Spec } from './interface-specification';
export declare class OpenApi3UtilClass {
    specification: OpenAPI3Spec;
    private specificationOrig;
    jsonSchema: any;
    private parseJson(content);
    private parseYaml(content);
    loadFromContent(content: string, allowNoValidSpec?: boolean): Promise<OpenAPI3Spec | undefined>;
    loadFromObject(obj: OpenAPI3Spec, allowNoValidSpec?: boolean): Promise<OpenAPI3Spec | undefined>;
    loadFromFilepath(path: string, allowNoValidSpec?: boolean): Promise<any>;
    isValidSpec(): boolean;
    isValidSpecAsync(): Promise<boolean>;
    dereference(): Promise<OpenAPI3Spec>;
    resolveAllOf(): Promise<OpenAPI3Spec>;
    loadJsonSchema(): Promise<any>;
    removePathFromSpecification(removePaths: string | string[], reverse?: boolean, allPaths?: OpenAPI3Spec.Paths): Promise<OpenAPI3Spec.Paths>;
    getPathOptions(path: string, method: string): Promise<OpenAPI3Spec.MethodOptions>;
    getPathSchema(path: string, method: string): Promise<any>;
    getSecuritySchema(schemaName: string): Promise<any>;
    revertToLastLoaded(): Promise<OpenAPI3Spec>;
    constructor();
}
export declare const OpenApi3Util: OpenApi3UtilClass;
export default OpenApi3Util;
