# Hooki
<a align="center" href="https://github.com/russiann/hooki"><img width="100%" src="https://cdn.pbrd.co/images/GECTIQj.png" alt="Hooki Logo"></a>
> ⚓️  An advanced Javascript hook system.

## Installation

```
npm install hooki --save
```

## Usage

```js
// product.class.js

import Hooki from 'hooki';
import { before, after } from './hooks';

class Product {
  constructor(name, price, stock) {
    this.name = name;
    this.price = price;
    this.stock = stock;
  }

  buy(quantity) {
    console.log(`${this.name} x${quantity}`);
  }

}

export new Hooki(ProductClass, before, after);

```

```js
// hooks.js

export const before = {
  buy: [
    function verifyStock(context) {
      if (context.params.quantity > context.self.quantity) {
        throw Error('Amount exceeds stock!');
      }
      return context;
    }
  ]
};

export const after = {
  buy: [
    function removeFromStock(context) {
      context.self.quantity -= context.params.quantity;
      return context
    }
  ]
};

```

```js
// app.js

import Product from './product.class.js';

const bag = new Product('bag', 10.43, 5);

bag.buy(4); 
// -> bag x4
console.log(bag.stock); 
// -> 1
bag.buy(2); 
// -> Error: Amount exceeds stock!

```

## Roadmap

#### Tests
- [x] tests

#### target types
- [x] object
- [x] class
- [ ] function

#### action types
- [x] function
- [x] get
- [x] set
- [x] getter
- [x] setter
- [x] construct

#### hook types
- [x] after
- [x] before
- [x] errors

#### features
- [ ] plugin system
- [ ] async hooks (promises, callback)
- [ ] extended hooks methods (`target.after([hook])`, `target.before([hooks])`)

#### plugins
- [ ] hooki-events
- [ ] hooki-validator
- [ ] hooki-errors
- [ ] hooki-lifecycle
- [ ] hooki-modules
