/*
 * Copyright (c) 2018 by Lưu Hiếu <tronghieu.luu@gmail.com>
 */

let ObjectUtil = require('./ObjectUtil');

class Expression {
  constructor(condition) {
    this.condition = condition;
    this.type = 'AND';
    this.and = [];
    this.or = [];

    for (let index in condition) {
      /*
       * {
       *  $or: [
       *    expression1: value1,
       *    expression2: value2
       *  ]
       * }
       */
      if (index === '$or' && Array.isArray(condition.$or)) {
        for(let ii = 0; ii < condition.$or.length; ++ii) {
          this.or.push(new Expression(condition.$or[ii]));
        }
        this.type = 'OR';
        break; //$or chi cho phép một phần tử đầu tiên
      }
      /*
       * {
       *  $and: [
       *    expression1: value1,
       *    expression2: value2
       *  ]
       * }
       */
      else if (index === '$and' && Array.isArray(condition.$and)) {
        for(let ii = 0; ii < condition.$and.length; ++ii) {
          this.and.push(new Expression(condition.$and[ii]));
        }
        break; //$and giống $or, chúng ta chỉ cho phép một phần tử đầu tiên
      } else if (Expression._isScalar(condition[index])) { //simple expression
        /* các expression cơ bản so sánh điều kiện với một giá trị.
         * exp: {username: 'changiomemuoi', hotline: '0914-819-903', desc: 'Đảm bảo ngon, người nhà ăn suốt'}
         */
        this.and.push([
          index, '$eq', condition[index]
        ]);
      } else { //object
        for (let subIndex in condition[index]) {
          if (subIndex === '$in' && Array.isArray(condition[index][subIndex])) {
            /* điều kiện in có thể coi là một điều kiện or, vì vậy cách giải quyết là chuyển nó thành điều kiện or với một Expression */
            let inCond = Expression._makeOrConditionFromInArray(index, condition[index][subIndex]);
            this.and.push(new Expression(inCond));
          } else if (subIndex === '$nin' && Array.isArray(condition[index][subIndex])) {
            // not in ngược lại với in, nó là một tập hợp các điều kiện and với not equal giá trị trong mảng
            let inCond = Expression._makeOrConditionFromNotInArray(index, condition[index][subIndex]);
            this.and.push(new Expression(inCond));
          } else if (['$neq', '$lt', '$lte', '$gt', '$gte', "$regex"].indexOf(subIndex) !== -1) {
            /* các operator được định nghĩa */
            this.and.push([
              index, subIndex, condition[index][subIndex]
            ]);
          } else {
            /* Xem ra cấu trúc chỗ này là một điều kiện lồng sâu hơn, vì vậy sử dụng Expression cho phần điều kiện lồng bên trong này */
            this.and.push(new Expression(condition[index]))
          }
        }
      }
    }

    /* console.log(this.and) */;
  }

  test(input) {
    input = ObjectUtil.flatten(input);
    if (this.type === 'AND') {
      return this._testAnd(input);
    } else if (this.type === 'OR') {
      return this._testOr(input);
    }

    throw new TypeError('Expression not valid');
  }

  /**
   * Test multiple conditions, return false if one condition false
   *
   * @param input
   * @returns {boolean}
   * @private
   */
  _testAnd(input) {
    for(let ii = 0; ii < this.and.length; ++ii) {
      if (!Expression._compare(this.and[ii], input)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Test require one of conditions, return true if one condition true
   *
   * @param input
   * @returns {boolean}
   * @private
   */
  _testOr(input) {
    for(let ii = 0; ii < this.or.length; ++ii) {
      if (Expression._compare(this.or[ii], input)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check is scalar
   * @param mixVar
   * @returns {boolean}
   * @private
   */
  static _isScalar(mixVar) {
    return (/boolean|number|string/).test(typeof mixVar);
  }

  /**
   *
   * @param condition
   * @param input
   * @returns {*}
   * @private
   */
  static _compare (condition, input) {
    if (condition instanceof Expression) {
      return condition.test(input);
    } else if (Array.isArray(condition) && condition.length === 3) {
      if (condition[1] === '$eq' && input[condition[0]] != condition[2]) {
        return false;
      }
      if (condition[1] === '$neq' && input[condition[0]] == condition[2]) {
        return false;
      }
      if (condition[1] === '$gt' && input[condition[0]] <= condition[2]) {
        return false;
      }
      if (condition[1] === '$gte' && input[condition[0]] < condition[2]) {
        return false;
      }
      if (condition[1] === '$lt' && input[condition[0]] >= condition[2]) {
        return false;
      }
      if (condition[1] === '$lte' && input[condition[0]] > condition[2]) {
        return false;
      }

      if (condition[1] === '$regex') {
        let reg = new RegExp(condition[2], "g");
        return reg.test(input[condition[0]]);
      }

      return true;
    }

    throw new Error('Unknown expression!');
  }

  static _makeOrConditionFromInArray (index, inCondition) {
    let cond = [];
    for (let ii = 0 ; ii < inCondition.length; ++ii) {
      cond.push({[index]: inCondition[ii]});
    }
    return {$or: cond};
  }

  static _makeOrConditionFromNotInArray (index, inCondition) {
    let cond = [];
    for (let ii = 0 ; ii < inCondition.length; ++ii) {
      cond.push({[index]: {$neq: inCondition[ii]}});
    }
    return {$and: cond};
  }
}

module.exports = Expression;