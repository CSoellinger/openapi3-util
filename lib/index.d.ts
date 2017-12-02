export declare class OpenApi3Util {
    static specification: OpenAPI3Spec;
    private static specificationOrig;
    static jsonSchema: any;
    static parseJson(content: string): OpenAPI3Spec;
    static parseYaml(content: string): OpenAPI3Spec;
    static loadFromContent(content: string, validateAfterLoad?: boolean): Promise<OpenAPI3Spec>;
    static loadFromObject(obj: OpenAPI3Spec, validateAfterLoad?: boolean): Promise<OpenAPI3Spec>;
    static loadFromFilepath(path: string): Promise<any>;
    static validSpec(): boolean;
    static validateSpecAsync(): Promise<boolean>;
    static revertToLastLoaded(): Promise<OpenAPI3Spec>;
    static dereference(): Promise<OpenAPI3Spec>;
    static resolveAllOf(): Promise<OpenAPI3Spec>;
    static loadJsonSchema(): Promise<any>;
    static removePathFromSpecification(removePaths: string[], reverse?: boolean, allPaths?: OpenAPI3SpecPaths, reloadJsonSchema?: boolean): Promise<OpenAPI3SpecPaths | undefined>;
    static getPathOptions(path: string, method: string): Promise<OpenAPI3SpecMethodOptions>;
    getPathSchema(path: string, method: string): Promise<any>;
}
export default OpenApi3Util;
