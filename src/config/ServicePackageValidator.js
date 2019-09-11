const Expression = require('../Expression');
const ObjectUtil = require('../ObjectUtil');
const Enumerable = require('linq');
const _ = require('lodash');

class ServicePackageValidator {
  constructor(order, servicePackages) {
    this._failures = {};
    this._order = ServicePackageValidator.standardizedData(order);
    this._input = {
      order: this._order
    };
    this.servicePackages = servicePackages;
  }

  get failures() {
    return this._failures;
  }

  static standardizedData(order) {
    let orderClone = Object.assign({}, order);
    if (orderClone.services === null) delete orderClone.services;
    return ObjectUtil.unflatten(Object.assign({
      weight: 0,
      cod: 0,
      pickupLocationIdsPath: null,
      deliverLocationIdsPath: null,
      'services.insurance.amount': 0,
    }, ObjectUtil.flatten(orderClone)));
  };

  async validate(propertiesNeedValid) {
    // nếu có propertiesNeedValid sẽ chỉ validate những property trong mảng propertiesNeedValid.
    // nếu không truyền param propertiesNeedValid thì validate tất cả.
    //check order.deliveryPackage is set and exists in database
    if (!this._order.deliveryPackage) {
      this._addFailure('deliveryPackage', 'Missing delivery package!');
      return this.failures;
    }
    //get service package config in database
    let [servicePackage] = Enumerable.from(this.servicePackages).where(servicePackage => servicePackage.code === this._order.deliveryPackage).toArray();
    if (_.isEmpty(servicePackage)) {
      // this._addFailure('deliveryPackage', `Unknown service package ${this._order.deliveryPackage}`);
      this._addFailure('deliveryPackage', 'Unknown service package ' + this._order.deliveryPackage);
      return this.failures;
    }

    //foreach service package validate field, check condition
    for (let field in servicePackage.require) {
      if (propertiesNeedValid && !(propertiesNeedValid.includes(field))) continue;
      this._checkCondition(field, servicePackage.require[field]);
    }

    return this.failures;
  }

  _addFailure(field, mess) {
    if (typeof this._failures[field] === 'undefined') {
      this._failures[field] = [];
    }
    this.failures[field].push(mess);
  }

  //Check input is validate or not
  isValid() {
    for (let field in this._failures) {
      if (this._failures.hasOwnProperty(field))
        return false;
    }

    return true;
  }

  _checkCondition(field, condition) {
    let input = this._input;
    for (let ii = 0; ii < condition.length; ++ii) {
      try {
        let expression = new Expression(condition[ii]['$cond']);
        if (!expression.test(this._input)) {
          this._addFailure(field, eval(condition[ii]["$mess"]))
        }
      } catch (e) {
        this._addFailure(field, e.message);
      }
    }
  }
}
module.exports = ServicePackageValidator;