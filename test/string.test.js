/*
 * Copyright (c) 2018 by Lưu Hiếu <tronghieu.luu@gmail.com>
 */

let chai = require('chai');
let String = require('./../').String;

describe('Test string.', () => {
  it('normalize() happy case', () => {
    let expect = 'Hello merchant, we are Shippee';
    let result = String.normalize('Hello {0}, we are {1}', [
      'merchant',
      'Shippee'
    ]);
    chai.assert.equal(result, expect);
  });

  it('normalize() over parameters', () => {
    let expect = 'Hello merchant, we are Shippee';
    let result = String.normalize('Hello {0}, we are {1}', [
      'merchant',
      'Shippee',
      'Ha ha ha'
    ]);
    chai.assert.equal(result, expect);
  });
});