import { createParams, omit, nameFunctions, isClass } from './helpers';

export default class Hooki {

  constructor(target, before = {}, after = {}) {
    if (isClass(target)) {
      this.Class = target;
    } else {
      this.target = target;
    }
    this.handler = {};
    this.current = {};
    this.hooks = {
      before: nameFunctions(before),
      after: nameFunctions(after)
    };

    if (this.Class) return this.decorateClass();
    return this.invokeFunction();
  }

  setCurrent(name, type, action) {
    this.current = { name, type, action };
  }

  createContextData(func) {
    return (args) => {
      const params = createParams(func, args);
      const action = this.current.action;
      const name = this.current.name;

      switch (action) {
        case 'function':
          return {
            name, action, params,
            stash: { args, params },
            self: this.target,
            get args() {
              return Object.values(this.params);
            }
          };
        case 'set':
          return {
            name, action,
            value: params.value,
            stash: { value: params.value },
            self: this.target
          };
        case 'setter':
          return {
            name, action, params,
            stash: { args, params },
            self: this.target,
            get args() {
              return Object.values(this.params);
            }
          };
        case 'get':
          return {
            name, action,
            value: params.value,
            stash: { value: params.value },
            self: this.target
          };
        case 'getter':
          return { name, action };
        default:
          throw new Error(`Action ${action} do not exists!`);
      }
    };
  }

  applyHook(contextData, hook) {
    contextData.hookName = hook.name;
    const result = hook(contextData);
    const keysToOmit = ['args', 'stash', 'value', 'action', 'hookName', 'type'];

    if (result === undefined || result === null) throw Error(`'${hook.name}' hook must return context data`);

    return Object.assign(contextData, omit(result, ...keysToOmit));
  }

  processHooks(type) {
    return (data) => {
      const contextData = Object.assign(data, { type });
      const currentName = this.current.name;
      const hooks = this.hooks[type][currentName] || [];

      return hooks.reduce(this.applyHook, contextData);
    };
  }

  applyOriginalFunction(func) {
    return (data) => {
      let args;

      if (this.current.action === 'function') {
        args = data.args;
      }
      if (this.current.action === 'get' || this.current.action === 'set') {
        args = [data.value];
      }
      const result = func.apply(this.target, args);

      if (result === undefined || result === null) {
        return data;
      }

      return Object.assign({}, data, { result });
    };
  }

  decorateFunction(func) {
    const self = this;

    return function (...args) {
      const [contextData] = [args]
        .map(self.createContextData(func))
        .map(self.processHooks('before'))
        .map(self.applyOriginalFunction(func))
        .map(self.processHooks('after'));

      return contextData.result;
    };
  }

  traceCalls() {
    const self = this;

    this.handler = {
      get(target, propKey) {

        const descriptor = Reflect.getOwnPropertyDescriptor(target, propKey);

        if (descriptor === undefined || descriptor === null) return undefined;

        if (descriptor.get) {
          const func = (value) => { return value(); };

          self.setCurrent(propKey, 'get', 'getter');
          return self.decorateFunction(descriptor.get)(func);
        }

        if (typeof descriptor.value === 'function') {
          self.setCurrent(propKey, 'get', 'function');
          const func = target[propKey];

          return self.decorateFunction(func);
        }

        self.setCurrent(propKey, 'get', 'get');
        function func(value) { return value; } // TODO: change to arrow function

        return self.decorateFunction(func)(target[propKey]);

      },
      set(target, propKey, _value) {
        self.setCurrent(propKey, 'set');
        const descriptor = Reflect.getOwnPropertyDescriptor(target, propKey);

        if (descriptor.set) {
          self.setCurrent(propKey, 'set', 'setter');
          self.decorateFunction(descriptor.set)(_value);
          return true;
        }

        self.setCurrent(propKey, 'set', 'set');
        function func(value) {
          target[propKey] = value;
          return true;
        };
        self.decorateFunction(func)(_value);
        return true;

      }
    };
  }

  invokeFunction() {
    this.traceCalls();
    this.proxy = new Proxy(this.target, this.handler);
    return this.proxy;
  }

  decorateClass() {
    const self = this;

    return class {

      constructor(...args) {
        self.target = new self.Class(...args);
        self.traceCalls();
        self.proxy = new Proxy(self.target, self.handler);
        return self.proxy;
      }

      static [Symbol.hasInstance](operand) {
        if (operand.toString) {
          const test = /Decorator/.test(operand.toString());

          if (test) return true;
        }
        return operand instanceof self.Class;
      }

      get [Symbol.toStringTag]() {
        return 'Decorator';
      }

    };
  }

};
