/*
 * Copyright (c) 2018 by Lưu Hiếu <tronghieu.luu@gmail.com>
 */

let chai = require('chai');
let String = require('./../').StringUtil;

describe('Test string.', () => {
  it('formatWithArray() happy case', () => {
    let expect = 'Hello merchant, we are Shippee';
    let result = String.formatWithArray('Hello {0}, we are {1}', [
      'merchant',
      'Shippee'
    ]);
    chai.assert.equal(result, expect);
  });

  it('formatWithArray() over parameters', () => {
    let expect = 'Hello merchant, we are Shippee';
    let result = String.formatWithArray('Hello {0}, we are {1}', [
      'merchant',
      'Shippee',
      'Ha ha ha'
    ]);
    chai.assert.equal(result, expect);
  });

  it('normalize() will converts all of capitalize cases to normal cases', () => {
    let expect = 'hello world, we are coming';
    let actual = String.normalize('Hello world, we are coming');

    chai.assert.equal(actual, expect);
  });

  it('unsign() will converts Vietnamese to unsign', () => {
      let expect = 'Hello world, we are den day';
      let actual = String.unsign('Hello world, we are đến đây');

      chai.assert.equal(actual, expect);
  });

  it('trimDoubleSpace() will converts double spaces to a space', () => {
      let expect = 'Hello world, we are coming';
      let actual = String.trimDoubleSpace('Hello  world,  we  are  coming');

      chai.assert.equal(actual, expect);
  });

  it('keepOnlyCharacter() without keep space: remove all of non-letter', () => {
      let expect = 'helloworldwearecoming';
      let actual = String.keepOnlyCharacter('hello  world,  we  are  coming!', false);

      chai.assert.equal(actual, expect);
  });

  it('keepOnlyCharacter() with keep space: remove all of non-letter except space', () => {
      let expect = 'hello world we are coming';
      let actual = String.keepOnlyCharacter('hello world, we are coming!');

      chai.assert.equal(actual, expect);
  });

  it('combine keepOnlyCharacter() with normalize() happy case with keep space', () => {
      let expect = 'hello world we are coming';
      let actual = String.keepOnlyCharacter(String.normalize('Hello world, we are coming!'));

      chai.assert.equal(actual, expect);
  });

  it('combine keepOnlyCharacter() with normalize() happy case without keep space', () => {
      let expect = 'helloworldwearecoming';
      let actual = String.keepOnlyCharacter(String.normalize('Hello world, we are coming!'), false);

      chai.assert.equal(actual, expect);
  });
});