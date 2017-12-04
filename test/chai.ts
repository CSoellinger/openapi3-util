import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
// import * as chaiJsonSchema from 'chai-json-schema';
import * as path from 'path';

chai.use(chaiAsPromised);

export const expect = chai.expect;
export const assert = chai.assert;

// chai.use(chaiJsonSchema);

// chai.tv4
//   .addSchema('http://json-schema.org/draft-04/schema', require(path.resolve(__dirname, '..', 'schemas', 'json-schema-draft-04.json')));

// export const tv4 = chai.tv4;
