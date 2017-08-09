/* global describe, it, before */

import chai from 'chai';
import Hooki from '../src/index.js';

chai.expect();

const expect = chai.expect;

let lib;

describe('Given an instance of my Cat library', () => {
  before(() => {
    const target = {

    }
    lib = new Hooki(target);
  });
  describe('when I need the name', () => {
    it('should return the name', () => {
      expect(true).to.be.equal(true);
    });
  });
});

describe('Given an instance of my Dog library', () => {
  before(() => {
    if(true) {
      console.log(1)
    } else {
      console.log();
    }
    const target = {

    }
    lib = new Hooki(target);
  });
  describe('when I need the name', () => {
    it('should return the name', () => {
      expect(true).to.be.equal(true);
    });
  });
});
