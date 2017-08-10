import Hooki from '../../src/index';
import { before, after, error } from './hooks';

let product = {
  name: 'Bag',
  price: 22.31,
  stock: 20,

  buy(quantity) {
    console.log(`${this.name} x${quantity}`);
  }
};

const $product = new Hooki(product, before, after, error);

// $product;
$product.buy(20);
console.log(
  $product
);
