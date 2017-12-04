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
const jsonSchemaDerefSync = require("json-schema-deref-sync");
const openapi2schema = require("openapi2schema");
const ajv_1 = require("./ajv");
const resolve_all_of_1 = require("./resolve-all-of");
class OpenApi3UtilSyncClass {
    parseJsonSync(content) {
        let newSpec;
        try {
            newSpec = JSON.parse(content);
        }
        catch (e) {
        }
        return newSpec;
    }
    parseYamlSync(content) {
        let newSpec;
        try {
            newSpec = jsYaml.safeLoad(content);
        }
        catch (e) {
        }
        return newSpec;
    }
    loadFromContentSync(content, allowNoValidSpec = false) {
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
    loadFromObjectSync(obj, allowNoValidSpec = false) {
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
    loadFromFilepathSync(path, allowNoValidSpec = false) {
        if (fs.existsSync(path)) {
            return this.loadFromContentSync(fs.readFileSync(path).toString(), allowNoValidSpec);
        }
        else {
            delete this.specification;
            delete this.specificationOrig;
            delete this.jsonSchema;
        }
        return;
    }
    isValidSpecSync() {
        if (!ajv_1.validateOpenApi3Schema(this.specification)) {
            return false;
        }
        return true;
    }
    resolveAllOfSync() {
        this.specification = resolve_all_of_1.resolveAllOf(this.specification);
        return this.specification;
    }
    removePathSync(removePaths, reverse, allPaths) {
        if (!Array.isArray(removePaths)) {
            removePaths = [removePaths];
        }
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
        if (!allPaths) {
            this.specification.paths = paths;
        }
        return paths;
    }
    dereferenceSync() {
        this.specification = jsonSchemaDerefSync(this.specification);
        return this.specification;
    }
    getPathOptionsSync(path, method) {
        return this.specification.paths[path] && this.specification.paths[path][method];
    }
    getPathSchemaSync(path, method) {
        return this.jsonSchema[path] && this.jsonSchema[path][method];
    }
    getSecuritySchemaSync(schemaName) {
        return this.specification.components &&
            this.specification.components.securitySchemes[schemaName];
    }
    revertToLastLoadedSync() {
        this.specification = Object.assign({}, this.specificationOrig);
        return this.specification;
    }
}
exports.OpenApi3UtilSyncClass = OpenApi3UtilSyncClass;
exports.OpenApi3UtilSync = new OpenApi3UtilSyncClass();
class OpenApi3UtilClass extends OpenApi3UtilSyncClass {
    parseJson(content) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("parseJsonSync").call(this, content);
        });
    }
    parseYaml(content) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("parseYamlSync").call(this, content);
        });
    }
    loadFromContent(content, allowNoValidSpec = false) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("loadFromContentSync").call(this, content, allowNoValidSpec);
        });
    }
    loadFromObject(obj, allowNoValidSpec = false) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("loadFromObjectSync").call(this, obj, allowNoValidSpec);
        });
    }
    isValidSpec() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.isValidSpecSync();
        });
    }
    dereference() {
        return __awaiter(this, void 0, void 0, function* () {
            return new jsonSchemaRefParser().dereference(this.specification).then((spec) => {
                this.specification = spec;
            }).catch((e) => { console.error(e); });
        });
    }
    resolveAllOf() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("resolveAllOfSync").call(this);
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
    removePath(removePaths, reverse, allPaths) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("removePathSync").call(this, removePaths, reverse, allPaths);
        });
    }
    getPathOptions(path, method) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("getPathOptionsSync").call(this, path, method);
        });
    }
    getPathSchema(path, method) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("getPathSchemaSync").call(this, path, method);
        });
    }
    getSecuritySchema(schemaName) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("getSecuritySchemaSync").call(this, schemaName);
        });
    }
    revertToLastLoaded() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("revertToLastLoadedSync").call(this);
        });
    }
    constructor() {
        super();
        return this;
    }
}
exports.OpenApi3UtilClass = OpenApi3UtilClass;
exports.OpenApi3Util = new OpenApi3UtilClass();
exports.default = exports.OpenApi3Util;
//# sourceMappingURL=index.js.map