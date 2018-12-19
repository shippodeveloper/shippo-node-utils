/*
 * Copyright (c) 2018 by Lưu Hiếu <tronghieu.luu@gmail.com>
 */

let expect = require('chai').expect;
let ObjectUtil = require('./../').ObjectUtil;

describe('ObjectUtil Util', () => {
  it('flatten', () => {
    let input = {
      a: {
        a1: {
          a11: 'value of a11',
          a12: 'value of a12',
          a13: 'value of a13',
        },
        a2: {
          a21: 'value of a21',
          a22: 'value of a22',
        },
        a3: 'value of a3',
      },
      b: 'value of b',
      c: {
        c1: 'value of c1',
        c2: 'value of c2',
      }
    };

    let output = ObjectUtil.flatten(input);

    expect(output).to.have.deep.property('a.a1.a12', 'value of a12');
    expect(output).to.have.deep.property('a.a2.a21', 'value of a21');
    expect(output).to.have.deep.property('a.a3', 'value of a3');
    expect(output).to.have.deep.property('b', 'value of b');
    expect(output).to.have.deep.property('c.c1', 'value of c1');
  });
});