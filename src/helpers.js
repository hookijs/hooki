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

export const pick = (obj, ...items) => {
  return Object.keys(obj).reduce((data, key) =>{
    const toPick = items.find(i => i === key);

    if (toPick) {
      data[key] = obj[key];
    }
    return data;
  }, {});
};

export const nameFunctions = (hooks) => {
  return Object
    .keys(hooks)
    .reduce((data, key) => {
      data[key] = hooks[key]
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

export const isClass = (fn) => {
  return (typeof fn === 'function' &&
          (/^class\s/.test(toString.call(fn)) ||
            (/classCallCheck\(/.test(fnBody(fn)))) // babel.js
          );
};

const isObject = (item) => {
  return (typeof item === "object" && !Array.isArray(item) && item !== null);
};

export const is = {
  class: isClass,
  object: isObject
};
