"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const jsYaml = require("js-yaml");
const jsonSchemaRefParser = require("json-schema-ref-parser");
const openapi2schema = require("openapi2schema");
const ajv_1 = require("./ajv");
const resolve_all_of_1 = require("./resolve-all-of");
class OpenApi3Util {
    constructor(specificationContent) {
        if (typeof (specificationContent) === 'object') {
            this.specification = specificationContent;
        }
        else {
            this.loadFromContent(specificationContent, false);
        }
        this.loaded = Promise.resolve();
    }
    parseJson(content) {
        let newSpec;
        try {
            newSpec = JSON.parse(content);
        }
        catch (error) {
        }
        return newSpec;
    }
    parseYaml(content) {
        let newSpec;
        try {
            newSpec = jsYaml.safeLoad(content);
        }
        catch (e) {
        }
        return newSpec;
    }
    loadFromContent(content, validateAfterLoad = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let newSpec;
            newSpec = yield this.parseJson(content);
            if (!newSpec) {
                newSpec = yield this.parseYaml(content);
            }
            this.specification = newSpec;
            this.specificationOrig = Object.assign({}, newSpec);
            if (!this.validateSpecAsync()) {
                console.error('Your specification is not valid!');
            }
            return this.specification;
        });
    }
    loadFromObject(obj, validateAfterLoad = true) {
        return __awaiter(this, void 0, void 0, function* () {
            this.specification = obj;
            if (!this.validateSpecAsync()) {
                console.error('Your specification is not valid!');
            }
            this.specificationOrig = Object.assign({}, this.specification);
            return this.specification;
        });
    }
    loadFromFilepath(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fs.existsSync(path)) {
                return this.loadFromContent(fs.readFileSync(path).toString());
            }
            return;
        });
    }
    validSpec() {
        if (!ajv_1.validateOpenApi3Schema(this.specification)) {
            return false;
        }
        return true;
    }
    validateSpecAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.validSpec();
        });
    }
    revertToLastLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            this.specification = Object.assign({}, this.specificationOrig);
            return this.specification;
        });
    }
    dereference() {
        return __awaiter(this, void 0, void 0, function* () {
            this.specification = yield new jsonSchemaRefParser().dereference(this.specification);
            return this.specification;
        });
    }
    resolveAllOf() {
        return __awaiter(this, void 0, void 0, function* () {
            this.specification = resolve_all_of_1.resolveAllOf(this.specification);
            return this.specification;
        });
    }
    loadJsonSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                openapi2schema(this.specification, (err, result) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    this.jsonSchema = result;
                    resolve(this.jsonSchema);
                });
            });
        });
    }
    removePathFromSpecification(removePaths, reverse, allPaths, reloadJsonSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            let paths;
            if (allPaths) {
                paths = allPaths;
            }
            else {
                paths = this.specification.paths;
            }
            if (!reverse) {
                removePaths.map((removePath) => {
                    if (paths[removePath]) {
                        delete paths[removePath];
                    }
                });
            }
            else {
                Object.keys(paths).map((pathKey) => {
                    if (removePaths.indexOf(pathKey) === -1) {
                        delete paths[pathKey];
                    }
                });
            }
            if (allPaths) {
                return paths;
            }
            else {
                this.specification.paths = paths;
            }
        });
    }
    getPathOptions(path, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.specification.paths[path] && this.specification.paths[path][method];
        });
    }
    getPathSchema(path, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.jsonSchema[path] && this.jsonSchema[path][method];
        });
    }
}
exports.OpenApi3Util = OpenApi3Util;
exports.default = new OpenApi3Util();
//# sourceMappingURL=index.js.map