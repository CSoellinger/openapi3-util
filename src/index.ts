import * as fs from 'fs';
import * as jsYaml from 'js-yaml';
import * as jsonSchemaRefParser from 'json-schema-ref-parser';
import * as openapi2schema from 'openapi2schema';

import { OpenAPI3Spec } from './interface-specification';
import { validateOpenApi3Schema } from './ajv';
import { resolveAllOf } from './resolve-all-of';

export class OpenApi3UtilClass {

  specification: OpenAPI3Spec;

  private specificationOrig: OpenAPI3Spec;

  jsonSchema: any;

  private parseJson(content: string): OpenAPI3Spec {
    let newSpec;
    try {
      newSpec = JSON.parse(content);
    } catch (e) {
    }
    return newSpec;
  }

  private parseYaml(content: string): OpenAPI3Spec {
    let newSpec;
    try {
      newSpec = jsYaml.safeLoad(content);
    } catch (e) {
    }
    return newSpec;
  }

  async loadFromContent(content: string, allowNoValidSpec = false): Promise<OpenAPI3Spec | undefined> {
    let newSpec;

    newSpec = await this.parseJson(content);

    if (!newSpec) {
      newSpec = await this.parseYaml(content);
    }

    this.specification = newSpec;
    this.specificationOrig = Object.assign({}, newSpec);

    if (!await this.isValidSpecAsync()) {
      console.warn('Your specification is not valid!');
      if (allowNoValidSpec === false) {
        delete this.specification;
        delete this.specificationOrig;
        delete this.jsonSchema;
      }
    }

    return this.specification;
  }

  async loadFromObject(obj: OpenAPI3Spec, allowNoValidSpec = false): Promise<OpenAPI3Spec | undefined> {
    this.specification = obj;
    this.specificationOrig = Object.assign({}, this.specification);

    if (!await this.isValidSpecAsync()) {
      console.warn('Your specification is not valid!');
      if (allowNoValidSpec === false) {
        delete this.specification;
        delete this.specificationOrig;
        delete this.jsonSchema;
      }
    }

    return this.specification;
  }

  async loadFromFilepath(path: string, allowNoValidSpec = false): Promise<any> {
    if (fs.existsSync(path)) {
      return this.loadFromContent(fs.readFileSync(path).toString(), allowNoValidSpec);
    } else {
      delete this.specification;
      delete this.specificationOrig;
      delete this.jsonSchema;
    }
    return;
  }

  isValidSpec(): boolean {
    if (!validateOpenApi3Schema(this.specification)) {
      return false
    }
    return true;
  }

  async isValidSpecAsync(): Promise<boolean> {
    return await this.isValidSpec();
  }

  async dereference(): Promise<OpenAPI3Spec> {
    this.specification = await new jsonSchemaRefParser().dereference(this.specification);
    await this.loadJsonSchema();
    return this.specification;
  }

  async resolveAllOf(): Promise<OpenAPI3Spec> {
    this.specification = <OpenAPI3Spec>resolveAllOf(this.specification);
    await this.loadJsonSchema();
    return this.specification;
  }

  async loadJsonSchema(): Promise<any> {
    return new Promise((resolve, reject) => {
      openapi2schema(this.specification, (err: any, result: any) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        this.jsonSchema = result;

        resolve(this.jsonSchema);
      })
    });
  }

  async removePathFromSpecification(removePaths: string | string[], reverse?: boolean, allPaths?: OpenAPI3Spec.Paths) {
    if (!Array.isArray(removePaths)) {
      removePaths = [removePaths];
    }

    let paths: OpenAPI3Spec.Paths;

    if (allPaths) {
      paths = allPaths;
    } else {
      paths = this.specification.paths;
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

    if (!allPaths) {
      this.specification.paths = paths;
    }

    return paths;
  }

  async getPathOptions(path: string, method: string) {
    return this.specification.paths[path] && this.specification.paths[path][method];
  }

  async getPathSchema(path: string, method: string) {
    return this.jsonSchema[path] && this.jsonSchema[path][method];
  }

  async getSecuritySchema(schemaName: string) {
    return this.specification.components &&
      this.specification.components.securitySchemes[schemaName];
  }

  async revertToLastLoaded(): Promise<OpenAPI3Spec> {
    this.specification = Object.assign({}, this.specificationOrig);
    return this.specification;
  }

  constructor() {
    return this;
  }
}

export const OpenApi3Util = new OpenApi3UtilClass();

export default OpenApi3Util;
