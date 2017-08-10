/* global describe, it, before */
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Hooki from '../src/index.js';

chai.expect();
chai.use(sinonChai);

const expect = chai.expect;


describe('on construction:', () => {

  it('should throw an error if target is not passed', () => {
    let fn = () => {
      return new Hooki();
    };
    expect(fn).to.throw();
  });

  it('should throw an error if target is not a Class or Object', () => {
    let fn = () => {
      new Hooki([]);
    };
    expect(fn).to.throw();
  });
});

describe('on class target', () => {

  it('should work with Classes', () => {
    let fn = () => {
      class Target {}
      return new Hooki(Target);
    };
    expect(fn).not.to.throw(Error);
  });

  it('target instance should be instance of hooked target too', () => {
    class Target {}
    const hookedTarget = new Hooki(Target);
    let instance = new Target();
    expect(instance instanceof hookedTarget).to.equal(true);
  });

  it('hooked target instance should be instance of target too', () => {
    class Target {}
    const HookedTarget = new Hooki(Target);
    let instance = new HookedTarget();
    expect(instance instanceof Target).to.equal(true);
  });
});

describe('on object target', () => {

  it('should work with objects', () => {
    let fn = () => {
      return new Hooki({});
    };
    expect(fn).not.to.throw(Error);
  });

});

describe('on add hooks:', () => {
  it('should throw an error if bundle hooks is not a object', () => {
    let fn = () => {
      let target = {
        foo() {
          return true;
        }
      };
      return new Hooki(target, []);
    };
    expect(fn).to.throw();
  });

  it('should throw an error if bundle hooks not pass de schema validation', () => {
    let fn = () => {
      const target = {
        foo() {
          return true;
        }
      };
      const beforeHooks = {
        foo: 'string'
      };
      return new Hooki(target, beforeHooks);
    };
    expect(fn).to.throw();
  });

});


describe('on proccess hooks:', () => {
  it('hooks should be called neatly', () => {

    let originalMethodSpy = sinon.spy();
    let beforeHookOneSpy = sinon.spy();
    let beforeHookTwoSpy = sinon.spy();
    let afterHookOneSpy = sinon.spy();
    let afterHookTwoSpy = sinon.spy();

    let target = {
      foo: function () {
        originalMethodSpy();
      }
    };

    let beforeHooks = {
      foo: [
        function (c) { beforeHookOneSpy(); return c; },
        function (c) { beforeHookTwoSpy(); return c; }
      ]
    };

    let afterHooks = {
      foo: [
        function (c) { afterHookOneSpy(); return c; },
        function (c) { afterHookTwoSpy(); return c; }
      ]
    };

    let instance = new Hooki(target, beforeHooks, afterHooks);

    instance.foo();

    expect(beforeHookOneSpy).to.have.been.calledBefore(beforeHookTwoSpy);
    expect(beforeHookTwoSpy).to.have.been.calledBefore(originalMethodSpy);
    expect(originalMethodSpy).to.have.been.calledBefore(afterHookOneSpy);
    expect(afterHookOneSpy).to.have.been.calledAfter(originalMethodSpy);
    expect(afterHookTwoSpy).to.have.been.calledAfter(afterHookOneSpy);
  });
});

/*
  - on contruction
  - on object target
  - on class Hooki
  - on proccess hook
*/
