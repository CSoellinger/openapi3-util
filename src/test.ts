import * as path from 'path';
import { default as OA3Util } from './index';

OA3Util
  .loadFromFilepath(path.resolve(__dirname, 'openapi.yaml'))
  .then((val) => OA3Util.loadJsonSchema())
  .then((val) => OA3Util.dereference())
  .then((val) => OA3Util.resolveAllOf())
  .then((valPromise: any) => {
    console.log(OA3Util.jsonSchema);
  });
