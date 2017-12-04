/// <reference path="./../typings/index.d.ts" />
/// <reference path="./../typings/global.d.ts" />

import * as path from 'path';
import * as fs from 'fs';
import 'mocha';

import { expect } from './chai';
import { OpenApi3Util, OpenApi3UtilClass } from '../src/index';

const noFile = path.resolve(__dirname, 'no-uber.yaml');
const specFile = path.resolve(__dirname, 'uber.yaml');
const specContent = fs.readFileSync(specFile).toString();
const invalidSpecFile = path.resolve(__dirname, 'uber.invalid.yaml');
const invalidSpecContent = fs.readFileSync(invalidSpecFile).toString();

describe('openapi3-util', () => {

  let util: any;

  beforeEach((done: Function) => {
    util = new OpenApi3UtilClass();
    util
      .loadFromContent(specContent)
      .then(() => done())
      .catch((err: any) => done(err));
  });

  it('Valid specification should be loaded by filepath and return from validSpec() true', (done: Function) => {
    util
      .loadFromFilepath(specFile)
      .then(() => {
        expect(util.isValidSpec()).to.be.true;
        expect(util).to.have.property('specification');
        done();
      })
      .catch((err: any) => done(err));
  });

  it('Invalid specification should be loaded by filepath and return from validSpec() false', (done: Function) => {
    util
      .loadFromFilepath(invalidSpecFile)
      .then(() => {
        expect(util.isValidSpec()).to.be.false;
        expect(util).not.to.have.property('specification');
        done();
      })
      .catch((err: any) => done(err));
  });

  it('Valid specification should be loaded by content and return from validSpec() true', (done: Function) => {
    expect(util.isValidSpec()).to.be.true;
    expect(util).to.have.property('specification');
    done();
  });

  it('Invalid specification should be loaded by content and return from validSpec() false', (done: Function) => {
    util
      .loadFromContent(invalidSpecContent)
      .then(() => {
        expect(util.isValidSpec()).to.be.false;
        expect(util).not.to.have.property('specification');
        done();
      })
      .catch((err: any) => done(err));
  });

  it('Valid specification should be loaded by object and return from validSpec() true', (done: Function) => {
    util
      .loadFromObject(require('./uber.json'))
      .then(() => {
        expect(util.isValidSpec()).to.be.true;
        expect(util).to.have.property('specification');
        done();
      })
      .catch((err: any) => done(err));
  });

  it('Invalid specification should be loaded by object and return from validSpec() false', (done: Function) => {
    util
      .loadFromObject(require('./uber.invalid.json'))
      .then(() => {
        expect(util.isValidSpec()).to.be.false;
        expect(util).not.to.have.property('specification');
        done();
      })
      .catch((err: any) => done(err));
  });

  it('Invalid specification should be loaded by object and return from validSpec() false. Spec is also set.', (done: Function) => {
    util
      .loadFromObject(require('./uber.invalid.json'), true)
      .then(() => {
        expect(util.isValidSpec()).to.be.false;
        expect(util).to.have.property('specification');
        done();
      })
      .catch((err: any) => done(err));
  });

  it('Invalid specification should be loaded by object and return from validSpec() false. Spec is also set.', (done: Function) => {
    util
      .loadFromObject(require('./uber.invalid.json'), true)
      .then(() => {
        util
          .loadJsonSchema()
          .then((val: any) => {
            done('Json schema should not get loaded');
          }).catch((err: any) => done());
      }).catch((err: any) => done(err));
  });

  it('Not existing file should not get loaded.', (done: Function) => {
    util
      .loadFromFilepath(noFile)
      .then(() => {
        expect(util.isValidSpec()).to.be.false;
        expect(util).not.to.have.property('specification');
        done();
      })
      .catch((err: any) => done(err));
  });

  it('Check dereference', (done: Function) => {
    expect(util.specification.paths['/products'].get.responses['200'].content['application/json'].schema)
      .to.have.property('$ref');

    util
      .dereference()
      .then(() => {
        expect(util.specification.paths['/products'].get.responses['200'].content['application/json'].schema.properties)
          .to.have.property('products');
        done();
      })
      .catch((err: any) => done(err));
  });

  it('Check merging allOf', (done: Function) => {
    expect(util.specification.paths['/products'].get.responses['default'].content['application/json'].schema)
      .to.have.property('allOf');

    util
      .dereference()
      .then(() => {
        util
          .resolveAllOf()
          .then(() => {
            expect(util.specification.paths['/products'].get.responses['200'].content['application/json'].schema)
              .to.have.property('properties');
            done();
          }).catch((err: any) => done(err));
      }).catch((err: any) => done(err));
  });

  it('Check async validate', (done: Function) => {
    util
      .isValidSpecAsync()
      .then((isValid: boolean) => {
        expect(isValid).to.be.true;
        done();
      }).catch((err: any) => done(err));
  });

  it('Check load json schema', (done: Function) => {
    util
      .loadJsonSchema()
      .then((jsonschema: any) => {
        expect(jsonschema).to.have.property('/products');
        done();
      }).catch((err: any) => done(err));
  });

  it('Remove path from schema', (done: Function) => {
    util
      .removePathFromSpecification(['/products'])
      .then((paths: any) => {
        expect(paths).not.to.have.property('/products');
        done();
      }).catch((err: any) => done(err));
  });

  it('Revert to last loaded schema', (done: Function) => {
    util
      .revertToLastLoaded()
      .then(() => {
        expect(util.specification.paths).have.property('/products');
        done();
      }).catch((err: any) => done(err));
  });

  it('Remove path from array', (done: Function) => {
    let paths = util.specification.paths;

    util
      .removePathFromSpecification('/products', false, paths)
      .then((paths: any) => {
        expect(paths).not.to.have.property('/products');
        done();
      }).catch((err: any) => done(err));
  });

  it('Try to remove not existing path from array', (done: Function) => {
    let paths = util.specification.paths;

    util
      .removePathFromSpecification('/productsxy', false, paths)
      .then((paths: any) => {
        expect(paths).to.have.property('/products');
        done();
      }).catch((err: any) => done(err));
  });

  it('Remove all paths except given from array', (done: Function) => {
    let paths = util.specification.paths;

    util
      .removePathFromSpecification('/products', true, paths)
      .then((paths: any) => {
        expect(paths).to.have.property('/products');
        done();
      }).catch((err: any) => done(err));
  });

  it('Get path options', (done: Function) => {
    util
      .getPathOptions('/products', 'get')
      .then((options: any) => {
        expect(options).have.property('summary');
        expect(options.summary).is.equal('Product Types');
        done();
      }).catch((err: any) => done(err));
  });

  it('Get security schema', (done: Function) => {
    util
      .getSecuritySchema('apikey')
      .then((securitySchema: any) => {
        expect(securitySchema).have.property('type');
        expect(securitySchema.type).is.equal('apiKey');
        done();
      }).catch((err: any) => done(err));
  });

  it('Get path schema', (done: Function) => {
    util
      .loadJsonSchema()
      .then((jsonschema: any) => {
        util
          .getPathSchema('/products', 'get')
          .then((pathSchema: any) => {
            expect(pathSchema).have.property('responses');
            done();
          }).catch((err: any) => done(err));
      }).catch((err: any) => done(err));
  });

  it('Invalid specification should be loaded by content and return from validSpec() false. Invalid spec is saved too.', (done: Function) => {
    util
      .loadFromContent(invalidSpecContent, true)
      .then(() => {
        expect(util.isValidSpec()).to.be.false;
        expect(util).to.have.property('specification');
        done();
      })
      .catch((err: any) => done(err));
  });

});
