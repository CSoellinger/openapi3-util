import * as fs from 'fs';
import * as jsYaml from 'js-yaml';
import * as jsonSchemaRefParser from 'json-schema-ref-parser';
import * as openapi2schema from 'openapi2schema';

import { OpenAPI3Spec, OpenAPI3SpecPaths, OpenAPI3SpecMethodOptions } from './../typings/index.d';
import { validateOpenApi3Schema } from './ajv';
import { resolveAllOf } from './resolve-all-of';

export class OpenApi3Util {

  static specification: OpenAPI3Spec;

  private static specificationOrig: OpenAPI3Spec;

  static jsonSchema: any;

  static parseJson(content: string): OpenAPI3Spec {
    let newSpec;
    try {
      newSpec = JSON.parse(content);
    } catch (e) {
      // console.error(e);
    }
    return newSpec;
  }
  
  static parseYaml(content: string): OpenAPI3Spec {
    let newSpec;
    try {
      newSpec = jsYaml.safeLoad(content);
    } catch (e) {
      // console.error(e);
    }
    return newSpec;
  }

  static async loadFromContent(content: string, validateAfterLoad = true): Promise<OpenAPI3Spec> {
    let newSpec;

    newSpec = await OpenApi3Util.parseJson(content);

    if (!newSpec) {
      newSpec = await OpenApi3Util.parseYaml(content);
    }

    OpenApi3Util.specification = newSpec;
    OpenApi3Util.specificationOrig = Object.assign({}, newSpec);

    if (!OpenApi3Util.validateSpecAsync()) {
      console.error('Your specification is not valid!');
    } else {
      await OpenApi3Util.loadJsonSchema();
    }

    return OpenApi3Util.specification;
  }

  static async loadFromObject(obj: OpenAPI3Spec, validateAfterLoad = true): Promise<OpenAPI3Spec> {
    OpenApi3Util.specification = obj;
    OpenApi3Util.specificationOrig = Object.assign({}, OpenApi3Util.specification);

    if (!OpenApi3Util.validateSpecAsync()) {
      console.error('Your specification is not valid!');
    } else {
      await OpenApi3Util.loadJsonSchema();
    }

    return OpenApi3Util.specification;
  }

  static async loadFromFilepath(path: string): Promise<any> {
    if (fs.existsSync(path)) {
      return OpenApi3Util.loadFromContent(fs.readFileSync(path).toString());
    }
    return;
  }

  static validSpec(): boolean {
    if (!validateOpenApi3Schema(OpenApi3Util.specification)) {
      return false
    }
    return true;
  }

  static async validateSpecAsync(): Promise<boolean> {
    return await OpenApi3Util.validSpec();
  }

  static async revertToLastLoaded(): Promise<OpenAPI3Spec> {
    OpenApi3Util.specification = Object.assign({}, OpenApi3Util.specificationOrig);
    return OpenApi3Util.specification;
  }

  static async dereference(): Promise<OpenAPI3Spec> {
    OpenApi3Util.specification = await new jsonSchemaRefParser().dereference(OpenApi3Util.specification);
    await this.loadJsonSchema();
    return OpenApi3Util.specification;
  }
  
  static async resolveAllOf(): Promise<OpenAPI3Spec> {
    OpenApi3Util.specification = <OpenAPI3Spec>resolveAllOf(OpenApi3Util.specification);
    await this.loadJsonSchema();
    return OpenApi3Util.specification;
  }

  static async loadJsonSchema(): Promise<any> {
    return new Promise((resolve, reject) => {
      openapi2schema(OpenApi3Util.specification, (err: any, result: any) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        OpenApi3Util.jsonSchema = result;

        resolve(OpenApi3Util.jsonSchema);
      })
    });
  }

  static async removePathFromSpecification(
    removePaths: string[], reverse?: boolean, allPaths?: OpenAPI3SpecPaths, reloadJsonSchema?: boolean
  ) {
    let paths: OpenAPI3SpecPaths;

    if (allPaths) {
      paths = allPaths;
    } else {
      paths = OpenApi3Util.specification.paths;
    }

    if (!reverse) {
      removePaths.map((removePath: string) => {
        if (paths[removePath]) {
          delete paths[removePath];
        }
      });
    } else {
      Object.keys(paths).map((pathKey: string) => {
        if (removePaths.indexOf(pathKey) === -1) {
          delete paths[pathKey];
        }
      });
    }

    if (allPaths) {
      return paths;
    } else {
      OpenApi3Util.specification.paths = paths;
    }
  }

  static async getPathOptions(path: string, method: string) {
    return OpenApi3Util.specification.paths[path] && OpenApi3Util.specification.paths[path][method];
  }

  static async getPathSchema(path: string, method: string) {
    return OpenApi3Util.jsonSchema[path] && OpenApi3Util.jsonSchema[path][method];
  }
  
  static async getSecuritySchema(schemaName: string) {
    return OpenApi3Util.specification.components.securitySchemes[schemaName];
  }

}

export default OpenApi3Util;
