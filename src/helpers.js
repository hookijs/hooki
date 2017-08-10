const $args = (func) =>
  (func + '')
    .replace(/[/][/].*$/mg, '')
    .replace(/\s+/g, '')
    .replace(/[/][*][^/*]*[*][/]/g, '')
    .split(/\)[\{=]/, 1)[0]
    .replace(/^[^(]*[(]/, '')
    .replace(/=[^,]+/g, '')
    .split(',')
    .filter(Boolean);

export const createParams = (func, args) => {
  const keys = $args(func);

  return keys.reduce((obj, key, index) => {
    obj[key] = args[index];
    return obj;
  }, {});
};

export const omit = (obj, ...items) => {
  return Object.keys(obj).reduce((data, key) =>{
    const toOmit = items.find(i => i === key);

    if (!toOmit) {
      data[key] = obj[key];
    }
    return data;
  }, {});
};

export const nameFunctions = (hooks) => {
  const flatFuncs = (obj) => {
    if (typeof obj === 'object' && !Array.isArray(obj)) {
      return Object.keys(obj).map(key => obj[key]);
    }
    return obj;
  };
  return Object
    .keys(hooks)
    .reduce((data, key) => {
      data[key] = flatFuncs(hooks[key])
        .map((fn, index) => {
          if (fn && !fn.name) {
            Object.defineProperty(fn, 'name', { value: `hook-${ index + 1 }` });
          }
          return fn;
        });
      return data;
    }, {});
};

// Type Check

const toString = Function.prototype.toString;

const fnBody = (fn) => {
  return toString.call(fn).replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
};

const isClass = (fn) => {
  return (typeof fn === 'function' &&
          (/^class\s/.test(toString.call(fn)) ||
            (/classCallCheck\(/.test(fnBody(fn)))) // babel.js
          );
};

const isObject = (item) => {
  return (typeof item === 'object' && !Array.isArray(item) && item !== null);
};

export const is = {
  class: isClass,
  object: isObject
};

// hook validation

export const validateHooks = (...bundle) => {
  bundle.forEach(hooks => {
    if (!is.object(hooks)) {
      throw new Error('Hooki: bundle hooks must be an object');
    }

    for (const key of Object.keys(hooks)) {
      const property = hooks[key];
      if (is.object(property)) {
        return true;
      } else if (Array.isArray(property)) {
        property.forEach(item => {
          if (!typeof item === 'function') {
            throw new Error('Hooki: hook must be a function!');
          }
        });
        return true;
      }

      throw new Error('Hooki: invalid schema for bundle hooks!');
    }
    return true;
  });
};
