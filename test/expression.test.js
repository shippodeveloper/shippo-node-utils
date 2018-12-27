/*
 * Copyright (c) 2018 by Lưu Hiếu <tronghieu.luu@gmail.com>
 */

const chai = require('chai');
const Expression = require('./../').Expression;

describe('Test expression:', () => {
  describe('single condition:', () => {
    it ('equal $eq', () => {
      let cond = { 'order.weight': 5000};

      let validInput = {
        order: {
          weight: 5000,
        }
      };

      let invalidInput = {
        order: {
          weight: 4999,
        }
      };

      let expression = new Expression(cond);
      chai.assert.equal(expression.test(validInput), true);
      chai.assert.equal(expression.test(invalidInput), false)
    });

    it('not equal $neq', () => {
      let cond = { 'order.weight': {'$neq': 5000}};

      let invalidInput = {
        order: {
          weight: 5000,
        }
      };

      let validInput = {
        order: {
          weight: 4999,
        }
      };

      let expression = new Expression(cond);
      chai.assert.equal(expression.test(validInput), true);
      chai.assert.equal(expression.test(invalidInput), false)
    });

    it('greater than $gt', () => {
      let cond = {'order.weight': {'$gt': 4999 }};
      let input = { order: { weight: 5000}};
      let expression = new Expression(cond);
      chai.assert.equal(expression.test(input), true);
      input.order.weight = 50023;
      chai.assert.equal(expression.test(input), true);
      input.order.weight = 4999;
      chai.assert.equal(expression.test(input), false);
      input.order.weight = 4988;
      chai.assert.equal(expression.test(input), false);
    });

    it('greater than or equal $gte', () => {
      let cond = {'order.weight': {'$gte': 4999 }};
      let input = { order: { weight: 4999}};
      let expression = new Expression(cond);
      chai.assert.equal(expression.test(input), true);
      input.order.weight = 5000;
      chai.assert.equal(expression.test(input), true);
      input.order.weight = 4998;
      chai.assert.equal(expression.test(input), false);
      input.order.weight = 4988;
      chai.assert.equal(expression.test(input), false);
    });

    it('less than $lt', () => {
      let cond = {'order.weight': {'$lt': 4999 }};
      let input = { order: { weight: 4998}};
      let expression = new Expression(cond);
      chai.assert.equal(expression.test(input), true);
      input.order.weight = 4900;
      chai.assert.equal(expression.test(input), true);
      input.order.weight = 4999;
      chai.assert.equal(expression.test(input), false);
      input.order.weight = 50001;
      chai.assert.equal(expression.test(input), false);
    });

    it('less than or equal $lte', () => {
      let cond = {'order.weight': {'$lte': 4999 }};
      let input = { order: { weight: 4999}};
      let expression = new Expression(cond);
      chai.assert.equal(expression.test(input), true);
      input.order.weight = 4988;
      chai.assert.equal(expression.test(input), true);
      input.order.weight = 5000;
      chai.assert.equal(expression.test(input), false);
      input.order.weight = 5900;
      chai.assert.equal(expression.test(input), false);
    });

    it('regex $regex', () => {
      let cond = {'order.locationPath': {'$regex': "8.9.*" }};
      let input = { order: { locationPath: "8.9.30"}};
      let expression = new Expression(cond);
      chai.assert.equal(expression.test(input), true, 'matching');
      input.order.locationPath = "8.10.30";
      chai.assert.equal(expression.test(input), false, 'correct not matching');
    });

    it('in a collection $in', () => {
      let cond = {'order.id': {$in: [11,22,33,44,55,66,77,88,99,100]}};
      let input = { order: { id: 11}};
      let expression = new Expression(cond);
      chai.assert.equal(expression.test(input), true);
      input.order.id = 55;
      chai.assert.equal(expression.test(input), true);
      input.order.id = 12;
      chai.assert.equal(expression.test(input), false);
      input.order.id = 5900;
      chai.assert.equal(expression.test(input), false);
    });

    it('and condition $and', () => {
      let cond = {
        $and: [
          {'order.locationId': {$in: [1,2,3,4,5,6,7,8,9,10]}},
          {'order.weight': {$lte: 5000}},
          {'order.package': 'STC'}
        ]};

      let input = {
        order: {
          locationId: 1,
          weight: 5000,
          package: 'STC'
        },
        merchant: {
          groupId: 12
        }
      };

      let expression = new Expression(cond);
      chai.assert.equal(expression.test(input), true);
      input.order.locationId = 9;
      chai.assert.equal(expression.test(input), true);
      input.order.weight = 4500;
      chai.assert.equal(expression.test(input), true);
      //false
      input.order.package = 'SCN';
      chai.assert.equal(expression.test(input), false);
      input.order.weight = 5500;
      chai.assert.equal(expression.test(input), false);
    });

    it('or condition $or', () => {
      let cond = {
        $or: [
          {'order.locationId': {$in: [1,2,3,4,5,6,7,8,9,10]}},
          {'order.weight': {$lte: 5000}},
          {'order.package': 'STC'}
        ]};

      let input = {
        order: {
          locationId: 1,
          weight: 5000,
          package: 'STC'
        },
        merchant: {
          groupId: 12
        }
      };

      let expression = new Expression(cond);
      chai.assert.equal(expression.test(input), true);
      input.order.locationId = 12;
      chai.assert.equal(expression.test(input), true);
      input.order.weight = 5500;
      chai.assert.equal(expression.test(input), true);
      //false
      input.order.package = 'SCN';
      chai.assert.equal(expression.test(input), false);
    });
  });

  describe('combine conditions:', () => {
    it('multiple single expression', () => {
      let cond = {
        'order.weight': 1234,
        'order.locationId': 567,
        'order.value1': 'Ok, im value1, what do u thing about a better name?',
        'merchant.username': 'tronghieu'
      };

      let input = {
        order: {
          weight: 1234,
          locationId: 567,
          value1: 'Ok, im value1, what do u thing about a better name?'
        },
        merchant: {
          username: 'tronghieu'
        }
      };

      let expression = new Expression(cond);
      //true
      chai.assert.equal(expression.test(input), true);
      input.order.weight = 12345;
      chai.assert.equal(expression.test(input), false);
    });

    it('combine $or expressions', () => {
      let cond = {
        'order.package': 'STC',
        'order.weight': {
          '$or': [
            {'order.weight': 1000},
            {'order.weight': 2000},
            {'order.weight': 3000},
          ]
        },
        'merchant.username': 'tronghieu'
      };

      let input = {
        order: {
          weight: 1000,
          locationId: 567,
          package: 'STC',
          value1: 'Ok, im value1, what do u thing about a better name?'
        },
        merchant: {
          username: 'tronghieu'
        }
      };

      let expression = new Expression(cond);
      //true
      chai.assert.equal(expression.test(input), true);
      input.order.weight = 12345;
      chai.assert.equal(expression.test(input), false);
    });

    it('combine $and expression', () => {
      let cond = {
        'order.package': 'SCN',
        'order.weight': {
          '$and': [
            {'order.weight': {'$gt': 500 }},
            {'order.weight': {'$lte': 1500}},
            //Weight from 500g to 1500g
          ]
        },
        'merchant.username': 'tronghieu'
      };

      let input = {
        order: {
          weight: 1000,
          locationId: 567,
          package: 'SCN',
          value1: 'Ok, im value1, what do u thing about a better name?'
        },
        merchant: {
          username: 'tronghieu'
        }
      };

      let expression = new Expression(cond);
      //true
      chai.assert.equal(expression.test(input), true);
      input.order.weight = 12345;
      chai.assert.equal(expression.test(input), false);
    });
  });
});