export declare class OpenApi3Util {
    loaded: Promise<any>;
    specification: OpenAPI3Spec;
    private specificationOrig;
    jsonSchema: any;
    constructor(specificationContent?: string | object);
    parseJson(content: string): Promise<OpenAPI3Spec>;
    parseYaml(content: string): OpenAPI3Spec;
    loadFromContent(content: string, validateAfterLoad?: boolean): Promise<OpenAPI3Spec>;
    loadFromObject(obj: OpenAPI3Spec, validateAfterLoad?: boolean): Promise<OpenAPI3Spec>;
    loadFromFilepath(path: string): Promise<any>;
    validSpec(): boolean;
    validateSpecAsync(): Promise<boolean>;
    revertToLastLoaded(): Promise<OpenAPI3Spec>;
    dereference(): Promise<OpenAPI3Spec>;
    resolveAllOf(): Promise<OpenAPI3Spec>;
    loadJsonSchema(): Promise<any>;
    removePathFromSpecification(removePaths: string[], reverse?: boolean, allPaths?: OpenAPI3SpecPaths, reloadJsonSchema?: boolean): Promise<OpenAPI3SpecPaths | undefined>;
    getPathOptions(path: string, method: string): Promise<OpenAPI3SpecMethodOptions>;
    getPathSchema(path: string, method: string): Promise<any>;
}
declare const _default: OpenApi3Util;
export default _default;
