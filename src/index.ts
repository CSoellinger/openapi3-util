import * as fs from 'fs';
import * as path from 'path';
import * as jsYaml from 'js-yaml';
import * as jsonSchemaRefParser from 'json-schema-ref-parser';
import * as jsonSchemaDerefSync from 'json-schema-deref-sync';
import * as openapi2schema from 'openapi2schema';

import { OpenAPI3Spec } from './interface-specification';
import { validateOpenApi3Schema } from './ajv';
import { resolveAllOf } from './resolve-all-of';

export class OpenApi3UtilSyncClass {

  specification: OpenAPI3Spec;

  protected specificationOrig: OpenAPI3Spec;

  jsonSchema: any;

  protected parseJsonSync(content: string): OpenAPI3Spec {
    let newSpec;
    try {
      newSpec = JSON.parse(content);
    } catch (e) {
    }
    return newSpec;
  }

  protected parseYamlSync(content: string): OpenAPI3Spec {
    let newSpec;
    try {
      newSpec = jsYaml.safeLoad(content);
    } catch (e) {
    }
    return newSpec;
  }

  loadFromContentSync(content: string, allowNoValidSpec = false) {
    let newSpec;

    newSpec = this.parseJsonSync(content);

    if (!newSpec) {
      newSpec = this.parseYamlSync(content);
    }

    this.specification = newSpec;
    this.specificationOrig = Object.assign({}, newSpec);

    if (!this.isValidSpecSync()) {
      console.warn('Your specification is not valid!');
      if (allowNoValidSpec === false) {
        delete this.specification;
        delete this.specificationOrig;
        delete this.jsonSchema;
      }
    }

    return this.specification;
  }

  loadFromObjectSync(obj: OpenAPI3Spec, allowNoValidSpec = false): OpenAPI3Spec | undefined {
    this.specification = obj;
    this.specificationOrig = Object.assign({}, this.specification);

    if (!this.isValidSpecSync()) {
      console.warn('Your specification is not valid!');
      if (allowNoValidSpec === false) {
        delete this.specification;
        delete this.specificationOrig;
        delete this.jsonSchema;
      }
    }

    return this.specification;
  }

  loadFromFilepathSync(path: string, allowNoValidSpec = false): any {
    if (fs.existsSync(path)) {
      return this.loadFromContentSync(fs.readFileSync(path).toString(), allowNoValidSpec);
    } else {
      delete this.specification;
      delete this.specificationOrig;
      delete this.jsonSchema;
    }
    return;
  }

  isValidSpecSync(): boolean {
    if (!validateOpenApi3Schema(this.specification)) {
      return false
    }
    return true;
  }

  resolveAllOfSync(): OpenAPI3Spec {
    this.specification = <OpenAPI3Spec>resolveAllOf(this.specification);
    return this.specification;
  }

  removePathSync(removePaths: string | string[], reverse?: boolean, allPaths?: OpenAPI3Spec.Paths) {
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

  dereferenceSync() {
    this.specification = jsonSchemaDerefSync(this.specification);
    return this.specification;
  }

  getPathOptionsSync(path: string, method: string) {
    return this.specification.paths[path] && this.specification.paths[path][method];
  }

  getPathSchemaSync(path: string, method: string) {
    return this.jsonSchema[path] && this.jsonSchema[path][method];
  }

  getSecuritySchemaSync(schemaName: string) {
    return this.specification.components &&
      this.specification.components.securitySchemes[schemaName];
  }

  revertToLastLoadedSync(): OpenAPI3Spec {
    this.specification = Object.assign({}, this.specificationOrig);
    return this.specification;
  }

}

export const OpenApi3UtilSync = new OpenApi3UtilSyncClass();

export class OpenApi3UtilClass extends OpenApi3UtilSyncClass {

  protected async parseJson(content: string): Promise<OpenAPI3Spec> {
    return super.parseJsonSync(content);
  }

  protected async parseYaml(content: string): Promise<OpenAPI3Spec> {
    return super.parseYamlSync(content);
  }

  async loadFromContent(content: string, allowNoValidSpec = false): Promise<OpenAPI3Spec | undefined> {
    return super.loadFromContentSync(content, allowNoValidSpec);
  }

  async loadFromObject(obj: OpenAPI3Spec, allowNoValidSpec = false): Promise<OpenAPI3Spec | undefined> {
    return super.loadFromObjectSync(obj, allowNoValidSpec);
  }

  async loadFromFilepath(path: string, allowNoValidSpec = false): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.exists(path, (exists: boolean) => {
        if (!exists) {
          delete this.specification;
          delete this.specificationOrig;
          delete this.jsonSchema;
          reject('path do not exist');
        } else {
          fs.readFile(path, (err, data) => {
            // if (err) {
            //   reject(err);
            //   throw Error(err.message);
            // }

            this.loadFromContent(data.toString(), allowNoValidSpec).then((val) => resolve(val));
          });
        }
      });
    });
  }

  async isValidSpec(): Promise<boolean> {
    return this.isValidSpecSync();
  }

  async dereference(): Promise<OpenAPI3Spec> {
    return new jsonSchemaRefParser().dereference(this.specification).then((spec: OpenAPI3Spec) => {
      this.specification = spec;
    });
    // .catch((e: any) => { console.error(e); });
  }

  async resolveAllOf(): Promise<OpenAPI3Spec> {
    return super.resolveAllOfSync();
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

  async removePath(removePaths: string | string[], reverse?: boolean, allPaths?: OpenAPI3Spec.Paths) {
    return super.removePathSync(removePaths, reverse, allPaths);
  }

  async getPathOptions(path: string, method: string) {
    return super.getPathOptionsSync(path, method);
  }

  async getPathSchema(path: string, method: string) {
    return super.getPathSchemaSync(path, method);
  }

  async getSecuritySchema(schemaName: string) {
    return super.getSecuritySchemaSync(schemaName);
  }

  async revertToLastLoaded(): Promise<OpenAPI3Spec> {
    return super.revertToLastLoadedSync();
  }

  constructor() {
    super();
    return this;
  }
}

export const OpenApi3Util = new OpenApi3UtilClass();

export default OpenApi3Util;
