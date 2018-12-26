/*
 * Copyright (c) 2018 by Lưu Hiếu <tronghieu.luu@gmail.com>
 */

let assert = require('chai').assert;
let NumberUtil = require('./../').NumberUtil;

describe('NumberUtil', () => {
  describe('true case', () => {
    it('common usage', () => {
      assert.equal(NumberUtil.isNumeric(10), true, '10 is number');
      assert.equal(NumberUtil.isNumeric(10.1), true, '10.1 is number');
      assert.equal(NumberUtil.isNumeric(-1.1), true, '-1.1 is number');
      assert.equal(NumberUtil.isNumeric(0), true, '0 is number');
      assert.equal(NumberUtil.isNumeric("10"), true, '"10" value is number');
      assert.equal(NumberUtil.isNumeric("10.1"), true, '"10.1" value is number');
      assert.equal(NumberUtil.isNumeric("-1.1"), true, '"-1.1" value is number');
      assert.equal(NumberUtil.isNumeric("0"), true, '"0" value is number');
      assert.equal(NumberUtil.isNumeric("013"), true, '"013" value is number');
      assert.equal(NumberUtil.isNumeric(parseInt('012')), true, '"012" value is number');
      assert.equal(NumberUtil.isNumeric(parseFloat('012')), true, '"012" value is number');
    });

    it('special computer value', () => {
      assert.equal(NumberUtil.isNumeric(5e3), true, '5e3 is number');
      assert.equal(NumberUtil.isNumeric("5e3"), true, '"5e3" value is number');
      assert.equal(NumberUtil.isNumeric("0xff"), true, '"0xff" value is number');
    })
  });

  it('false case', () => {
    assert.equal(NumberUtil.isNumeric(Infinity), false, 'Infinity not is number');
    assert.equal(NumberUtil.isNumeric(NaN), false, 'NaN not is number');
    assert.equal(NumberUtil.isNumeric(undefined), false, 'undefined not is number');
    assert.equal(NumberUtil.isNumeric(null), false, 'null not is number');
    assert.equal(NumberUtil.isNumeric(''), false, 'empty string not is number');
    assert.equal(NumberUtil.isNumeric('     '), false, 'string with space not is number');
    assert.equal(NumberUtil.isNumeric('foo'), false, 'string not is number');
    assert.equal(NumberUtil.isNumeric([]), false, 'empty array not is number');
    assert.equal(NumberUtil.isNumeric([1]), false, 'array not is number');
    assert.equal(NumberUtil.isNumeric({}), false, 'object not is number');
    assert.equal(NumberUtil.isNumeric(() => {}), false, 'function not is number');
  });
});