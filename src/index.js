import { createParams, omit, nameFunctions, is } from './helpers';

export const HookTypes = {
  class: Symbol('classHook'),
  object: Symbol('objectHook'),
  func: Symbol('functionHook')
};

export const ActionTypes = {
  Func: Symbol('funcAction'),
  Get: Symbol('getAction'),
  Set: Symbol('setAction'),
  Getter: Symbol('getterAction'),
  Setter: Symbol('setterAction'),
  Construct: Symbol('constructAction')
};

export default class Hooki {

  constructor(target, before = {}, after = {}) {
    this.hooks = {
      before: nameFunctions(before),
      after: nameFunctions(after)
    };
    this.current = {};

    if (is.class(target)) {
      this.Class = target;
      this.type = HookTypes.class;
      return this.invokeClass();
    }

    if (is.object(target)) {
      this.target = target;
      this.type = HookTypes.object;
      return this.invokeFunction();
    }

    throw new Error('Hooki: target must be object, function or class');
  }



  setCurrent(name, type, action) {
    this.current = { name, type, action };
  }



  createContextData(func) {
    return (args) => {
      const params = createParams(func, args);
      const action = this.current.action;
      const name = this.current.name;

      let contextData;

      switch (action) {
        case ActionTypes.Func:
          contextData = {
            name, action, params,
            stash: { args, params },
            self: this.target,
            get args() {
              return Object.values(this.params);
            }
          };
          break;
        case ActionTypes.Set:
          contextData = {
            name, action,
            value: params.value,
            stash: { value: params.value },
            self: this.target
          };
          break;
        case ActionTypes.Setter:
          contextData = {
            name, action, params,
            stash: { args, params },
            self: this.target,
            get args() {
              return Object.values(this.params);
            }
          };
          break;
        case ActionTypes.Get:
          contextData = {
            name, action,
            value: params.value,
            stash: { value: params.value },
            self: this.target
          };
          break;
        case ActionTypes.Getter:
          contextData = { name, action };
          break;
        case ActionTypes.Construct:
          const constructorParams = createParams(this.Class, args);
          contextData = {
            name, action, params: constructorParams,
            stash: { args, params: constructorParams },
            self: this.Class,
            get args() {
              return Object.values(this.params);
            }
          };
          break;
        default:
          throw new Error(`Action ${action} do not exists!`);

      }

      return contextData;
    };
  }



  applyHook(contextData, hook) {
    contextData.hookName = hook.name;
    const result = hook(contextData);
    const keysToOmit = ['args', 'stash', 'value', 'action', 'hookName', 'type', 'instance'];

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

      if (this.current.action === ActionTypes.Func) {
        args = data.args;
      }

      if (this.current.action === ActionTypes.Construct) {
        args = [data.args];
      }

      if (this.current.action === ActionTypes.Get || this.current.action === ActionTypes.Set) {
        args = [data.value];
      }
      const result = func.apply(this.target, args);

      if (result === undefined || result === null) {
        return data;
      }

      if (this.current.action === ActionTypes.Construct) {
        return Object.assign({}, omit(data, 'args'), { instance: this.target });
      }

      return Object.assign({}, omit(data, 'args'), { result });
    };
  }



  decorateFunction(func) {
    const self = this;

    return (...args) => {
      const [contextData] = [args]
        .map(self.createContextData(func))
        .map(self.processHooks('before'))
        .map(self.applyOriginalFunction(func))
        .map(self.processHooks('after'));

      return contextData.result;
    };
  }



  createTraps() {
    return {

      get: (target, propKey) => {
        const descriptor = Reflect.getOwnPropertyDescriptor(target, propKey);

        if (descriptor === undefined || descriptor === null) return undefined;

        if (descriptor.get) {
          const func = (value) => { return value(); };
          this.setCurrent(propKey, 'get', ActionTypes.Getter);
          return this.decorateFunction(descriptor.get)(func);
        }

        if (typeof descriptor.value === 'function') {
          this.setCurrent(propKey, 'get', ActionTypes.Func);
          const func = target[propKey];
          return this.decorateFunction(func);
        }

        this.setCurrent(propKey, 'get', ActionTypes.Get);
        function func(value) { return value; } // TODO: change to arrow function

        return this.decorateFunction(func)(target[propKey]);

      },



      set: (target, propKey, _value) => {
        this.setCurrent(propKey, 'set');
        const descriptor = Reflect.getOwnPropertyDescriptor(target, propKey);

        if (descriptor.set) {
          this.setCurrent(propKey, 'set', ActionTypes.Setter);
          this.decorateFunction(descriptor.set)(_value);
          return true;
        }

        this.setCurrent(propKey, 'set', ActionTypes.Set);
        function func(value) {
          target[propKey] = value;
          return true;
        };
        this.decorateFunction(func)(_value);
        return true;

      },


      construct(target, argumentsList, newTarget) {
        console.log(target, argumentsList, newTarget);
      }
    };
  }



  createProxy(target) {
    this.proxy = new Proxy(this.target, this.createTraps());
    return this.proxy;
  }



  invokeFunction() {
    return this.createProxy(this.target);
  }



  invokeClass() {
    return new Proxy(this.Class, {
      construct: (target, argumentsList, newTarget) => {
        this.setCurrent('construct', 'get', ActionTypes.Construct);
        const func = (args) => {
          this.target = new this.Class(...args);
          return args;
        };

        this.decorateFunction(func)(...argumentsList);

        return this.createProxy(this.target);
      }
    })
  }

};
