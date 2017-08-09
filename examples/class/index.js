import Hooki from '../../src/index';
// import { before, after } from './hooks';

const beforeConstruct = (context) => {
  context.params.name = 'bbag';
  context.data = {foo:1}
  return context; /*? $.args*/
};

const beforeBeforeConstruct = (context) => {
  context.params.name = 'bbbag';
  return context; /*? $.args*/
};

const beforeBeforeBeforeConstruct = (context) => {
  return context; /*? $.args*/
};

const afterConstruct = (context) => {
  // context.instance.name = 'bbag';

  console.log(context.params);
  return context; /*? $.stash */
};

const afterAfterConstruct = (context) => {
  return context;
};

class Product {

  constructor(name, price, stock) {
    this.name = name;
    this.price = price;
    this.stock = stock;
  }

  buy(quantity) {
    console.log(`${this.name} x${quantity}`);
  }
};

const $Product = new Hooki(Product, { construct: [beforeConstruct, beforeBeforeConstruct, beforeBeforeBeforeConstruct] },{ construct: [afterConstruct, afterAfterConstruct] });

const p = new Product('bag', 22.13, 20);
const p2 = new $Product('bag', 22.13, 20);

// const p2 = new  $Product('bag', 22.13, 20);
