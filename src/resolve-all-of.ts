import * as deepmerge from 'deepmerge';

export const resolveAllOf = (obj: any) => {
  if (Array.isArray(obj)) {
    obj.map((allOf: any) => allOf = resolveAllOf(allOf));
  } else {
    for (let key in obj) {
      if (obj[key]) {
        if (typeof (obj[key]) === 'object' && Array.isArray(obj[key]) === false || key === 'allOf') {
          obj[key] = resolveAllOf(obj[key]);
        }

        if (key === 'allOf') {
          obj = deepmerge.all([obj, ...obj[key]]);
          delete obj[key];
        }
      }
    }
  }
  return obj;
};

export default resolveAllOf;
