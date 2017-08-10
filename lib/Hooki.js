(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Hooki", [], factory);
	else if(typeof exports === 'object')
		exports["Hooki"] = factory();
	else
		root["Hooki"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionTypes = exports.HookTypes = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(1);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HookTypes = exports.HookTypes = {
  class: Symbol('classHook'),
  object: Symbol('objectHook'),
  func: Symbol('functionHook')
};

var ActionTypes = exports.ActionTypes = {
  Func: Symbol('funcAction'),
  Get: Symbol('getAction'),
  Set: Symbol('setAction'),
  Getter: Symbol('getterAction'),
  Setter: Symbol('setterAction'),
  Construct: Symbol('constructAction')
};

var Hooki = function () {
  function Hooki(target) {
    var before = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var after = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var error = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, Hooki);

    if (!target) throw new Error('Hooki: target param is required');
    (0, _helpers.validateHooks)(before, after, error);
    this.hooks = {
      before: (0, _helpers.nameFunctions)(before),
      after: (0, _helpers.nameFunctions)(after),
      error: (0, _helpers.nameFunctions)(error)
    };
    this.current = {};

    if (_helpers.is.class(target)) {
      this.Class = target;
      this.type = HookTypes.class;
      return this.invokeClass();
    }

    if (_helpers.is.object(target)) {
      this.target = target;
      this.type = HookTypes.object;
      return this.invokeObject();
    }

    throw new Error('Hooki: target must be object, function or class');
  }

  _createClass(Hooki, [{
    key: 'setCurrent',
    value: function setCurrent(name, type, action) {
      this.current = { name: name, type: type, action: action };
    }
  }, {
    key: 'createContextData',
    value: function createContextData(func) {
      var _this = this;

      return function (args) {
        var params = (0, _helpers.createParams)(func, args);
        var action = _this.current.action;
        var name = _this.current.name;

        var contextData = void 0;

        switch (action) {
          case ActionTypes.Func:
            contextData = {
              name: name, action: action, params: params,
              stash: { args: args, params: params },
              self: _this.target,
              get args() {
                return Object.values(this.params);
              }
            };
            break;
          case ActionTypes.Set:
            contextData = {
              name: name, action: action,
              value: params.value,
              stash: { value: params.value },
              self: _this.target
            };
            break;
          case ActionTypes.Setter:
            contextData = {
              name: name, action: action, params: params,
              stash: { args: args, params: params },
              self: _this.target,
              get args() {
                return Object.values(this.params);
              }
            };
            break;
          case ActionTypes.Get:
            contextData = {
              name: name, action: action,
              value: params.value,
              stash: { value: params.value },
              self: _this.target
            };
            break;
          case ActionTypes.Getter:
            contextData = { name: name, action: action };
            break;
          case ActionTypes.Construct:
            var constructorParams = (0, _helpers.createParams)(_this.Class, args);
            contextData = {
              name: name, action: action, params: constructorParams,
              stash: { args: args, params: constructorParams },
              self: _this.Class,
              get args() {
                return Object.values(this.params);
              }
            };
            break;
          default:
            throw new Error('Action ' + action + ' do not exists!');

        }

        return contextData;
      };
    }
  }, {
    key: 'applyHook',
    value: function applyHook(contextData, hook) {

      if (contextData.error && contextData.type !== 'error') return contextData;

      contextData.hookName = hook.name;
      var result = void 0;

      try {
        result = hook(contextData);
      } catch (error) {
        var data = Object.assign(contextData, { error: error });
        return this.processHooks('error')(data);
      }

      var keysToOmit = ['args', 'stash', 'value', 'action', 'hookName', 'type', 'instance', 'error'];

      if (result === undefined || result === null) throw Error('\'' + hook.name + '\' hook must return context data');

      return Object.assign(contextData, _helpers.omit.apply(undefined, [result].concat(keysToOmit)));
    }
  }, {
    key: 'processHooks',
    value: function processHooks(type) {
      var _this2 = this;

      return function (data) {
        var contextData = Object.assign(data, { type: type });
        var currentName = _this2.current.name;
        var hooks = _this2.hooks[type][currentName] || [];
        return hooks.reduce(_this2.applyHook.bind(_this2), contextData);
      };
    }
  }, {
    key: 'applyOriginalFunction',
    value: function applyOriginalFunction(func) {
      var _this3 = this;

      return function (data) {
        var args = void 0;

        if (_this3.current.action === ActionTypes.Func) {
          args = data.args;
        }

        if (_this3.current.action === ActionTypes.Construct) {
          args = [data.args];
        }

        if (_this3.current.action === ActionTypes.Get || _this3.current.action === ActionTypes.Set) {
          args = [data.value];
        }
        var result = func.apply(_this3.target, args);

        if (result === undefined || result === null) {
          return data;
        }

        if (_this3.current.action === ActionTypes.Construct) {
          return Object.assign({}, (0, _helpers.omit)(data, 'args'), { instance: _this3.target });
        }

        return Object.assign({}, (0, _helpers.omit)(data, 'args'), { result: result });
      };
    }
  }, {
    key: 'decorateFunction',
    value: function decorateFunction(func) {
      var self = this;

      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _map$map$map$map = [args].map(self.createContextData(func)).map(self.processHooks('before')).map(self.applyOriginalFunction(func)).map(self.processHooks('after')),
            _map$map$map$map2 = _slicedToArray(_map$map$map$map, 1),
            contextData = _map$map$map$map2[0];

        return contextData.result;
      };
    }
  }, {
    key: 'createTraps',
    value: function createTraps() {
      var _this4 = this;

      return {

        get: function get(target, propKey) {
          var descriptor = Reflect.getOwnPropertyDescriptor(target, propKey);

          if (descriptor === undefined || descriptor === null) return undefined;

          if (descriptor.get) {
            var _func = function _func(value) {
              return value();
            };
            _this4.setCurrent(propKey, 'get', ActionTypes.Getter);
            return _this4.decorateFunction(descriptor.get)(_func);
          }

          if (typeof descriptor.value === 'function') {
            _this4.setCurrent(propKey, 'get', ActionTypes.Func);
            var _func2 = target[propKey];
            return _this4.decorateFunction(_func2);
          }

          _this4.setCurrent(propKey, 'get', ActionTypes.Get);
          function func(value) {
            return value;
          } // TODO: change to arrow function

          return _this4.decorateFunction(func)(target[propKey]);
        },

        set: function set(target, propKey, _value) {
          _this4.setCurrent(propKey, 'set');
          var descriptor = Reflect.getOwnPropertyDescriptor(target, propKey);

          if (descriptor.set) {
            _this4.setCurrent(propKey, 'set', ActionTypes.Setter);
            _this4.decorateFunction(descriptor.set)(_value);
            return true;
          }

          _this4.setCurrent(propKey, 'set', ActionTypes.Set);
          function func(value) {
            target[propKey] = value;
            return true;
          };
          _this4.decorateFunction(func)(_value);
          return true;
        },

        construct: function construct(target, argumentsList, newTarget) {
          console.log(target, argumentsList, newTarget);
        }
      };
    }
  }, {
    key: 'createProxy',
    value: function createProxy(target) {
      this.proxy = new Proxy(this.target, this.createTraps());
      return this.proxy;
    }
  }, {
    key: 'invokeObject',
    value: function invokeObject() {
      return this.createProxy(this.target);
    }
  }, {
    key: 'invokeClass',
    value: function invokeClass() {
      var _this5 = this;

      return new Proxy(this.Class, {
        construct: function construct(target, argumentsList, newTarget) {
          _this5.setCurrent('construct', 'get', ActionTypes.Construct);
          var func = function func(args) {
            _this5.target = new (Function.prototype.bind.apply(_this5.Class, [null].concat(_toConsumableArray(args))))();
            return args;
          };

          _this5.decorateFunction(func).apply(undefined, _toConsumableArray(argumentsList));

          return _this5.createProxy(_this5.target);
        }
      });
    }
  }]);

  return Hooki;
}();

exports.default = Hooki;
;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var $args = function $args(func) {
  return (func + '').replace(/[/][/].*$/mg, '').replace(/\s+/g, '').replace(/[/][*][^/*]*[*][/]/g, '').split(/\)[\{=]/, 1)[0].replace(/^[^(]*[(]/, '').replace(/=[^,]+/g, '').split(',').filter(Boolean);
};

var createParams = exports.createParams = function createParams(func, args) {
  var keys = $args(func);

  return keys.reduce(function (obj, key, index) {
    obj[key] = args[index];
    return obj;
  }, {});
};

var omit = exports.omit = function omit(obj) {
  for (var _len = arguments.length, items = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    items[_key - 1] = arguments[_key];
  }

  return Object.keys(obj).reduce(function (data, key) {
    var toOmit = items.find(function (i) {
      return i === key;
    });

    if (!toOmit) {
      data[key] = obj[key];
    }
    return data;
  }, {});
};

var nameFunctions = exports.nameFunctions = function nameFunctions(hooks) {
  var flatFuncs = function flatFuncs(obj) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Array.isArray(obj)) {
      return Object.keys(obj).map(function (key) {
        return obj[key];
      });
    }
    return obj;
  };
  return Object.keys(hooks).reduce(function (data, key) {
    data[key] = flatFuncs(hooks[key]).map(function (fn, index) {
      if (fn && !fn.name) {
        Object.defineProperty(fn, 'name', { value: 'hook-' + (index + 1) });
      }
      return fn;
    });
    return data;
  }, {});
};

// Type Check

var toString = Function.prototype.toString;

var fnBody = function fnBody(fn) {
  return toString.call(fn).replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
};

var isClass = function isClass(fn) {
  return typeof fn === 'function' && (/^class\s/.test(toString.call(fn)) || /classCallCheck\(/.test(fnBody(fn))) // babel.js
  ;
};

var isObject = function isObject(item) {
  return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item) && item !== null;
};

var is = exports.is = {
  class: isClass,
  object: isObject
};

// hook validation

var validateHooks = exports.validateHooks = function validateHooks() {
  for (var _len2 = arguments.length, bundle = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    bundle[_key2] = arguments[_key2];
  }

  bundle.forEach(function (hooks) {
    if (!is.object(hooks)) {
      throw new Error('Hooki: bundle hooks must be an object');
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(hooks)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        var property = hooks[key];
        if (is.object(property)) {
          return true;
        } else if (Array.isArray(property)) {
          property.forEach(function (item) {
            if (!(typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'function') {
              throw new Error('Hooki: hook must be a function!');
            }
          });
          return true;
        }

        throw new Error('Hooki: invalid schema for bundle hooks!');
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return true;
  });
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=Hooki.js.map