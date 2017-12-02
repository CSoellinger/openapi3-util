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
    static parseJson(content) {
        let newSpec;
        try {
            newSpec = JSON.parse(content);
        }
        catch (e) {
        }
        return newSpec;
    }
    static parseYaml(content) {
        let newSpec;
        try {
            newSpec = jsYaml.safeLoad(content);
        }
        catch (e) {
        }
        return newSpec;
    }
    static loadFromContent(content, validateAfterLoad = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let newSpec;
            newSpec = yield OpenApi3Util.parseJson(content);
            if (!newSpec) {
                newSpec = yield OpenApi3Util.parseYaml(content);
            }
            OpenApi3Util.specification = newSpec;
            OpenApi3Util.specificationOrig = Object.assign({}, newSpec);
            if (!OpenApi3Util.validateSpecAsync()) {
                console.error('Your specification is not valid!');
            }
            else {
                yield OpenApi3Util.loadJsonSchema();
            }
            return OpenApi3Util.specification;
        });
    }
    static loadFromObject(obj, validateAfterLoad = true) {
        return __awaiter(this, void 0, void 0, function* () {
            OpenApi3Util.specification = obj;
            OpenApi3Util.specificationOrig = Object.assign({}, OpenApi3Util.specification);
            if (!OpenApi3Util.validateSpecAsync()) {
                console.error('Your specification is not valid!');
            }
            else {
                yield OpenApi3Util.loadJsonSchema();
            }
            return OpenApi3Util.specification;
        });
    }
    static loadFromFilepath(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fs.existsSync(path)) {
                return OpenApi3Util.loadFromContent(fs.readFileSync(path).toString());
            }
            return;
        });
    }
    static validSpec() {
        if (!ajv_1.validateOpenApi3Schema(OpenApi3Util.specification)) {
            return false;
        }
        return true;
    }
    static validateSpecAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OpenApi3Util.validSpec();
        });
    }
    static revertToLastLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            OpenApi3Util.specification = Object.assign({}, OpenApi3Util.specificationOrig);
            return OpenApi3Util.specification;
        });
    }
    static dereference() {
        return __awaiter(this, void 0, void 0, function* () {
            OpenApi3Util.specification = yield new jsonSchemaRefParser().dereference(OpenApi3Util.specification);
            yield this.loadJsonSchema();
            return OpenApi3Util.specification;
        });
    }
    static resolveAllOf() {
        return __awaiter(this, void 0, void 0, function* () {
            OpenApi3Util.specification = resolve_all_of_1.resolveAllOf(OpenApi3Util.specification);
            yield this.loadJsonSchema();
            return OpenApi3Util.specification;
        });
    }
    static loadJsonSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                openapi2schema(OpenApi3Util.specification, (err, result) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    OpenApi3Util.jsonSchema = result;
                    resolve(OpenApi3Util.jsonSchema);
                });
            });
        });
    }
    static removePathFromSpecification(removePaths, reverse, allPaths, reloadJsonSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            let paths;
            if (allPaths) {
                paths = allPaths;
            }
            else {
                paths = OpenApi3Util.specification.paths;
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
                OpenApi3Util.specification.paths = paths;
            }
        });
    }
    static getPathOptions(path, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return OpenApi3Util.specification.paths[path] && OpenApi3Util.specification.paths[path][method];
        });
    }
    getPathSchema(path, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return OpenApi3Util.jsonSchema[path] && OpenApi3Util.jsonSchema[path][method];
        });
    }
}
exports.OpenApi3Util = OpenApi3Util;
exports.default = OpenApi3Util;
//# sourceMappingURL=index.js.map