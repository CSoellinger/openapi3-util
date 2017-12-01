import * as fs from 'fs';
import * as jsYaml from 'js-yaml';
import * as jsonSchemaRefParser from 'json-schema-ref-parser';
import * as openapi2schema from 'openapi2schema';

import { validateOpenApi3Schema } from './ajv';
import { resolveAllOf } from './resolve-all-of';

export class OpenApi3Util {

  loaded: Promise<any>

  specification: OpenAPI3Spec;

  private specificationOrig: OpenAPI3Spec;

  jsonSchema: any;

  constructor(specificationContent?: string | object) {
    if (typeof (specificationContent) === 'object') {
      this.specification = <OpenAPI3Spec>specificationContent;
    } else {
      this.loadFromContent(<string>specificationContent, false);
    }

    this.loaded = Promise.resolve();
  }

  parseJson(content: string): Promise<OpenAPI3Spec> {
    let newSpec;
    try {
      newSpec = JSON.parse(content);
    } catch (error) {
    }
    return newSpec;
  }

  parseYaml(content: string): OpenAPI3Spec {
    let newSpec;
    try {
      newSpec = jsYaml.safeLoad(content);
    } catch (e) {
    }
    return newSpec;
  }

  async loadFromContent(content: string, validateAfterLoad = true): Promise<OpenAPI3Spec> {
    let newSpec;

    newSpec = await this.parseJson(content);

    if (!newSpec) {
      newSpec = await this.parseYaml(content);
    }

    this.specification = newSpec;
    this.specificationOrig = Object.assign({}, newSpec);

    if (!this.validateSpecAsync()) {
      console.error('Your specification is not valid!');
    }

    return this.specification;
  }

  async loadFromObject(obj: OpenAPI3Spec, validateAfterLoad = true): Promise<OpenAPI3Spec> {
    this.specification = obj;

    if (!this.validateSpecAsync()) {
      console.error('Your specification is not valid!');
    }

    this.specificationOrig = Object.assign({}, this.specification);

    return this.specification;
  }

  async loadFromFilepath(path: string): Promise<any> {
    if (fs.existsSync(path)) {
      return this.loadFromContent(fs.readFileSync(path).toString());
    }
    return;
  }

  validSpec(): boolean {
    if (!validateOpenApi3Schema(this.specification)) {
      return false
    }
    return true;
  }

  async validateSpecAsync(): Promise<boolean> {
    return await this.validSpec();
  }

  async revertToLastLoaded(): Promise<OpenAPI3Spec> {
    this.specification = Object.assign({}, this.specificationOrig);
    return this.specification;
  }

  async dereference(): Promise<OpenAPI3Spec> {
    this.specification = await new jsonSchemaRefParser().dereference(this.specification);
    return this.specification;
  }

  async resolveAllOf(): Promise<OpenAPI3Spec> {
    this.specification = <OpenAPI3Spec>resolveAllOf(this.specification);
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

  async removePathFromSpecification(removePaths: string[], reverse?: boolean, allPaths?: OpenAPI3SpecPaths, reloadJsonSchema?: boolean) {
    let paths: OpenAPI3SpecPaths;

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

    if (allPaths) {
      return paths;
    } else {
      this.specification.paths = paths;
    }
  }

  async getPathOptions(path: string, method: string) {
    return this.specification.paths[path] && this.specification.paths[path][method];
  }

  async getPathSchema(path: string, method: string) {
    return this.jsonSchema[path] && this.jsonSchema[path][method];
  }

}

export default new OpenApi3Util();
