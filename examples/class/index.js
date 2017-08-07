import Hooki from '../../src/index';
// import { before, after } from './hooks';

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

const $Product = new Hooki(Product);

const p = new Product('bag', 22.13, 20);
const p2 = new $Product('bag', 22.13, 20);

console.log(p instanceof Product);
console.log(p instanceof $Product);
console.log(p2 instanceof Product);
console.log(p2 instanceof $Product);

// const p2 = new  $Product('bag', 22.13, 20);
