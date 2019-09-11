const StringUtil = require('../StringUtil');
const Expression = require('../Expression');
const NumberUtil = require('../NumberUtil');
const ObjectUtil = require('../ObjectUtil');
const ServicePackageValidator = require('./ServicePackageValidator');
const Enumerable = require('linq');
const _ = require('lodash');


class Configs {
  constructor(configs, businessConfigPath = '') {
    this.businessConfigPath = businessConfigPath;
    this.getConfigs(configs, businessConfigPath);
  }

  getConfigs(configs) {
    throw new Error("This function must be implement")
  }

  /**
   * 
   * @param {String} key 
   */
  async getCache(key) {
    throw new Error("This function must be implement")
  }

  /**
   * 
   * @param {String} key 
   * @param {*} value 
   */
  async setCache(key, value) {
    throw new Error("This function must be implement")
  }

  /**
   * 
   * @param {String} path 
   * @return {Array}
   */
  async getKeys(path) {
    throw new Error("This function must be implement")
  }

  async getAnnouncements(posKey) {
    let cacheConfigs = await this.getCache(this.businessConfigPath + "announcements");
    if (typeof cacheConfigs === 'string') {
      cacheConfigs = JSON.parse(cacheConfigs);
    }
    for (let ii = 0; ii < cacheConfig.length; ii++) {
      if (cacheConfigs[ii].posKey === posKey) {
        return cacheConfigs[ii];
      }
    }
  }

  /**
   * 
   * @param {Array} configKeys Danh sách các config key
   */
  async getBusinessConfigs(configKeys) {
    let cacheConfigs = await this.getCache(this.businessConfigPath + "businessConfigs");
    if (typeof cacheConfigs === 'string') {
      cacheConfigs = JSON.parse(cacheConfigs);
    }

    if (!configKeys) return cacheConfigs;
    return cacheConfigs.filter(config => configKeys.includes(config.configKey))
  }

  /**
   * 
   * @param {string} configKey Danh sách các config key
   */
  async getBusinessConfigByKey(configKey) {
    let cacheConfigs = await this.getCache(this.businessConfigPath + "businessConfigs");
    if (typeof cacheConfigs === 'string') {
      cacheConfigs = JSON.parse(cacheConfigs);
    }
    return cacheConfigs.find(config => config.configKey == configKey);
  }
  /**
   * 
   * @param {string} name
   * @param {string} level
   * @param {number} parent_id
   */
  async getLocationByName(name, level, parent_id = null) {
    if (!name || !level) return null;
    let locations = await this.getCache(this.businessConfigPath + "locations");
    if (typeof locations === 'string') {
      locations = JSON.parse(locations);
    }

    let nameNormalize = StringUtil.keepOnlyCharacter(StringUtil.normalize(name), false);

    let location = locations.find(location => (StringUtil.keepOnlyCharacter(StringUtil.normalize(location.name), false) == nameNormalize && location.level == level && (parent_id === null || location.parent_id == parent_id)));
    if (location) return location;

    //db chỉ lưu name location mà không lưu tiền tố tỉnh/tp, quận/huyện, thị xã (ngoại trừ mấy quận HCM)
    //name được truyền lên hoàn toàn có thể chứa các tiền tố trên. Nếu có thì bỏ đi, sau đấy get lại theo name
    let prefixes = ['tinh', 'thanhpho', 'tp', 'quan', 'huyen', 'thixa'];
    for (let pre of prefixes) {
      if (nameNormalize.indexOf(pre) === 0) {
        nameNormalize = nameNormalize.replace(pre, '');
        let location = locations.find(location => (StringUtil.keepOnlyCharacter(StringUtil.normalize(location.name), false) == nameNormalize && location.level == level && (parent_id === null || location.parent_id == parent_id)));
        if (location) return location;
      }
    }
  }

  /**
   * 
   * @param {Number} phone Số điện thoại cần kiểm tra
   */
  async validateMobile(mobile) {
    let result = { status: false, message: 'The first phone number is not support' };
    let cacheConfigs = await this.getCache(this.businessConfigPath + "businessConfigs")

    if (typeof cacheConfigs === 'string') {
      cacheConfigs = JSON.parse(cacheConfigs);
    }

    mobile = mobile ? mobile.replace(/\D/g, '').replace(/^84|^\+84/, 0) : mobile;

    if (!mobile) return result
    if (isNaN(mobile)) {
      return result
    }

    let mobile_prefix;
    cacheConfigs.map(config => {
      if (config.configKey === `VALID_MOBILE`) {
        mobile_prefix = config;
      }
    })

    mobile_prefix = JSON.parse(mobile_prefix.configValue);
    let regexString = '^' + Object.keys(mobile_prefix).join("|^");
    let regex = new RegExp(regexString);
    let resultRegex = regex.exec(mobile);
    if (resultRegex) {
      if (mobile.length >= Number(mobile_prefix[resultRegex].min) && mobile.length <= Number(mobile_prefix[resultRegex].max)) {
        result.message = '';
        result.status = true;
        return result;
      }
      result.message = 'The length of phone number is invalid';
    }
    return result
  }

  /**
   * 
   * @param {Number} id
   */
  async getLocationById(id) {
    let locations = await this.getCache(this.businessConfigPath + "locations");
    if (typeof locations === 'string') {
      locations = JSON.parse(locations);
    }
    return locations.find(location => (location.id == id && location.is_deleted == 0))
  }

  async getLocations() {
    let locations = await this.getCache(this.businessConfigPath + "locations");
    if (typeof locations === 'string') {
      locations = JSON.parse(locations);
    }

    return locations;
  }

  /**
   * 
   * @param {Number} parentId 
   */
  async getLocationsByParentId(parentId) {
    let locations = await this.getCache(this.businessConfigPath + "locations");
    if (typeof locations === 'string') {
      locations = JSON.parse(locations);
    }
    return locations.filter(location => location.parent_id == parentId)
  }

  /**
   * 
   * @param {String} parentPath exp: "8.9"
   */
  async getLocationsByParentPath(parentPath) {
    let locations = await this.getCache(this.businessConfigPath + "locations");
    if (typeof locations === 'string') {
      locations = JSON.parse(locations);
    }
    let regParentPath = new RegExp(parentPath + ".*");
    return locations.filter(location => {
      return location.lineage && location.lineage.match(regParentPath)
    })
  }

  async getAppState() {
    let appState = await this.getCache(this.businessConfigPath + "appState");
    if (typeof appState === 'string') {
      appState = JSON.parse(appState);
    }

    return appState;
  }

  async getServicePackages() {
    let servicePackages = await this.getCache(this.businessConfigPath + "servicePackages");
    if (typeof servicePackages === 'string') {
      servicePackages = JSON.parse(servicePackages);
    }

    return servicePackages;
  }

  async getAutoPromotions() {
    let autoPromotions = await this.getCache(this.businessConfigPath + "autoPromotions");
    if (typeof autoPromotions === 'string') {
      autoPromotions = JSON.parse(autoPromotions);
    }

    return autoPromotions;
  }

  async getPromotions() {
    let promotions = await this.getCache(this.businessConfigPath + "promotions");
    if (typeof promotions === 'string') {
      promotions = JSON.parse(promotions);
    }

    return promotions;
  }

  async getServiceCharges() {
    let serviceCharges = await this.getCache(this.businessConfigPath + "serviceCharges");
    if (typeof serviceCharges === 'string') {
      serviceCharges = JSON.parse(serviceCharges);
    }

    return serviceCharges;
  }

  async getServiceChargePolicies() {
    let serviceChargePolicies = await this.getCache(this.businessConfigPath + "serviceChargePolicies");
    if (typeof serviceChargePolicies === 'string') {
      serviceChargePolicies = JSON.parse(serviceChargePolicies);
    }

    return serviceChargePolicies;
  }

  async getServiceChargeFormulas() {
    let keys = await this.getKeys(this.businessConfigPath + "service-charge-formulas");

    let fns = [], serviceChargeFormulas = [];
    keys.forEach(key => {
      fns.push(this.getCache(key))
    });

    let results = await Promise.all(fns);

    results.forEach(serviceChargeFormula => {
      serviceChargeFormula = JSON.parse(serviceChargeFormula);
      serviceChargeFormulas = serviceChargeFormulas.concat(serviceChargeFormula);
    });

    return serviceChargeFormulas;
  }

  async getActiveAutoCampaign(servicePackageCode) {
    let autoPromotions = await this.getAutoPromotions();

    return Enumerable.from(autoPromotions)
      .where(autoPromotion => autoPromotion.servicePackageCode === servicePackageCode)
      .where(autoPromotion => autoPromotion.state === 'ACTIVE')
      .where(autoPromotion => new Date(autoPromotion.applyFrom) <= new Date() || autoPromotion.applyFrom == null)
      .where(autoPromotion => new Date(autoPromotion.applyTo) > new Date() || autoPromotion.applyTo == null)
      .toArray();
  }

  async clearAutoPromotion(order) {
    if (!order.promotionCode) return;

    let autoPromotions = await this.getActiveAutoCampaign(order.deliveryPackage);

    for (let ii = 0; ii < autoPromotions.length; ++ii) {
      if (autoPromotions[ii].code === order.promotionCode) {
        order.promotionCode = null;
      }
    }
  }

  async detectAutoPromotion(order, merchant) {
    let input = { order, merchant };

    if (!order.deliveryPackage) {
      throw new ReferenceError('Missing order delivery package!');
    }

    let autoPromotions = await this.getActiveAutoCampaign(order.deliveryPackage);

    if (!autoPromotions) {
      return undefined;
    }

    for (let ii = 0; ii < autoPromotions.length; ++ii) {
      if (autoPromotions[ii].condition) {
        let expression = new Expression(autoPromotions[ii].condition);
        if (expression.test(input)) {
          return autoPromotions[ii];
        }
      }
    }

    return undefined;
  };

  makeDeliveryPackage(order) {
    if (!order['services']) {
      order.services = {};
    }

    //remove null or zero service's amount
    for (let serviceCode in order.services) {
      if (serviceCode === 'delivery_package') continue;
      if (order.services[serviceCode]['amount'] === undefined
        || order.services[serviceCode]['amount'] === null
        || (typeof order.services[serviceCode]['amount'] === 'string' && order.services[serviceCode]['amount'].trim() === '')) {
        delete order.services[serviceCode];
      }
    }

    if (order.chargeType) {
      order.services.delivery_package = { chargeType: order.chargeType || 'SENDER' };
    }

    if (order.cod) {
      order.services.cod = { amount: order.cod };
    }
  };

  async getSCByCodes(codes) {
    codes = codes.map((x) => { return x.toUpperCase() });

    let serviceCharges = await this.getServiceCharges();
    return Enumerable.from(serviceCharges).where(serviceCharge => codes.includes(serviceCharge.code)).toArray();
  };

  async getSCFromOrder(order) {
    this.makeDeliveryPackage(order);

    if (!order.services || typeof (order.services) !== 'object') {
      throw new ReferenceError('order.service is required a object')
    }

    let serviceCharges = [];
    serviceCharges = await this.getSCByCodes(Object.keys(order.services));

    if (serviceCharges) {
      //assign chargeType
      serviceCharges = serviceCharges.map((ii) => {
        let refCode = ii.code.toLowerCase();//cus order services use lower case
        if (order.services[refCode]
          && order.services[refCode]['chargeType']
          && ['SENDER', 'RECEIVER'].includes(order.services[refCode].chargeType)) {
          //nếu service chọn chargeType là Sender hoặc receiver thì gán
          ii.chargeType = order.services[refCode].chargeType;
        } else {
          //nếu không gán chargeType bằng mặc định
          ii.chargeType = ii.defaultChargeType;
        }

        return ii;
      });
    }

    return serviceCharges;
  };

  async validateServicePackage(order, propertiesNeedValid) {
    // nếu có propertiesNeedValid sẽ chỉ validate những property trong mảng propertiesNeedValid.
    // nếu không truyền param propertiesNeedValid thì validate tất cả.
    let servicePackages = await this.getServicePackages();
    let validator = new ServicePackageValidator(order, servicePackages);
    await validator.validate(propertiesNeedValid);
    return validator;
  }

  /**
  *
  * @param groupId
  * @return {Promise<Model|*>}
  */
  async findActivePolicy(groupId) {
    let policies = await this.getServiceChargePolicies();

    policies = Enumerable.from(policies)
      .where(policy => new Date(policy.applyFrom) <= new Date())
      .where(policy => new Date(policy.applyTo) > new Date())
      .toArray();

    if (groupId) {
      policies = Enumerable.from(policies).where(policy => (policy.mpsId == groupId || policy.mpsId == null)).toArray();
    } else {
      policies = Enumerable.from(policies).where(policy => policy.mpsId == null).toArray();
    }

    policies = Enumerable.from(policies).orderBy("policy=>policy.mpsId").thenByDescending("policy=>policy.applyFrom").toArray();

    if (!policies || policies.length === 0) {
      throw new ReferenceError('Not found any policy setting');
    }

    //do sort asc của sql null là cuối, nhưng của linq null là đầu. nên phải thêm đoạn code này!
    if (policies.length > 1 && policies[0].mpsId === null) {
      policies.push(policies[0]);
      policies.shift();
    }
    //end-region

    return policies[0]; //first policy found
  };

  /**
  * Detect order policy
  * @param order
  */
  async getOrderActivePolicy(order, merchant) {
    let policy;
    if (order.policyId) {
      //Old order, we dont care about status and active time
      let serviceChargePolicies = await this.getServiceChargePolicies();
      policy = serviceChargePolicies.find(serviceChargePolicy => serviceChargePolicy.id == order.policyId);
    } else {
      policy = await this.findActivePolicy(merchant.policyGroupId);
    }

    if (!policy) {
      throw new ReferenceError('Not found any policy setting');
    }

    return policy;
  };

  async calSCFee(order, merchant, serviceCharge) {
    //region detect ServiceChargeFormulas
    if (!order['policyId']) {
      throw new ReferenceError('order policy id undefined!')
    }
    if (!order['deliveryPackage']) {//serviceChargeCode
      throw new ReferenceError('missing package undefined!')
    }
    //get list of ServiceChargeFormulas follow policyId, servicePackCode, serviceChargeCode
    let matchFormula = await this.detectMatchingFormula(order, merchant, serviceCharge.code);
    //endregion

    //form return value
    let fee = {
      feeCode: serviceCharge.code,
      feeGroup: serviceCharge.group,
      feeName: serviceCharge.name,
      servicePackageCode: order.deliveryPackage,
      formulaId: (matchFormula && matchFormula.id) ? matchFormula.id : null,
      chargeType: (serviceCharge['chargeType']) ? serviceCharge['chargeType'] : 'SENDER',
      rawAmount: null,
      realAmount: null,
      quantity: null,
      unitPrice: null,
    };

    if (matchFormula) {
      fee.rawAmount = this._calRawAmount(order, merchant, matchFormula);
      if (matchFormula.calculationMethod === 'UNITxQUANTITY') {
        fee.quantity = this.getSCQuantity(order, merchant, matchFormula);
        fee.unitPrice = matchFormula.unitPrice;
      }
      fee.realAmount = fee.rawAmount;

      //apply promotion if exist;
      await this.applyPromotion(fee, order);

      if (matchFormula.minValue && fee.realAmount < Number.parseFloat(matchFormula.minValue)) {
        fee.realAmount = Number.parseFloat(matchFormula.minValue);
      } else if (matchFormula.maxValue && fee.realAmount > Number.parseFloat(matchFormula.maxValue)) {
        fee.realAmount = Number.parseFloat(matchFormula.maxValue);
      }
    }

    return fee;
  }


  _calRawAmount(order, merchant, scFormula) {
    if (scFormula.calculationMethod === 'UNITxQUANTITY') {
      //formula using unit multi with quantity, common case
      let quantity = this.getSCQuantity(order, merchant, scFormula);
      return (scFormula.unitPrice * quantity);
    } else if (scFormula.calculationMethod === 'FORMULA' && scFormula.formula) {
      return eval(scFormula.formula)
    } else {
      throw new ReferenceError('Unknown service charge calculation method');
    }
  };


  /**
   * Get Service Charge's quantity
   * The service charge for using UNITxQUANTIY calculation we need to determine the specific quantity.
   * There are 2 ways to specify this follow sc formula's quantity field:
   *  1. This field with the value is a number, this mean the value is exactly what do we want
   *  2. This field with the value is string, the quantity will be a value of a reference
   *    exp: "input.order[weight]" it mean using value of order[weight]
   *
   * @param order
   * @param merchant
   * @param matchFormula
   * @return {number}
   */
  getSCQuantity(order, merchant, matchFormula) {
    if (!matchFormula['quantity']) {
      throw new ReferenceError('ServiceChargeFormulas quantity undefined!');
    }

    if (NumberUtil.isNumeric(matchFormula.quantity)) {//value is number
      return Number.parseFloat(matchFormula.quantity);
    }

    let cond = ObjectUtil.flatten({ order, merchant });
    if (typeof cond[matchFormula.quantity] !== 'undefined') {//value is reference key of object
      return Number.parseFloat(cond[matchFormula.quantity]);
    }

    throw new ReferenceError('Quantity field not found!')
  };


  /**
   * Apply promotion
   *
   * @param fee
   * @param order
   */
  async applyPromotion(fee, order) {
    if (order.promotionCode) {
      let promotion = await this.getActivePromotion(order.promotionCode, fee.feeCode, order.deliveryPackage);
      if (promotion) {
        this.approvePromotion(promotion, fee, order);
      }
    }
  };


  approvePromotion(promotion, fee, order) {
    if (!promotion || !fee || !order) return;

    let discountValue = Number.parseFloat(promotion.discountValue);
    switch (promotion.discountType) {
      case 'FIX':
        fee.realAmount = discountValue;
        break;
      case 'DECREASE':
        fee.realAmount = Math.abs(fee.realAmount - discountValue);
        break;
      case 'PERCENT':
        fee.realAmount = fee.realAmount * (100 - discountValue) / 100;
        break;
      case 'FORMULA':
        fee.realAmount = eval(promotion.formula);
        break;
      default:
        throw new ReferenceError('Unsupported promotion discount type with ' + promotion.discountValue);
    }

    fee.promotionCode = order.promotionCode;
    fee.promotionId = promotion.id;
  }


  async detectMatchingFormula(order, merchant, scCode) {
    let formulas = await this.getFormulasByPolicyPackageAndServiceCharge(order.policyId, order.deliveryPackage, scCode);
    if (!formulas) {
      return undefined;
    }

    let input = { order, merchant };

    for (let ii = 0; ii < formulas.length; ++ii) {
      let formula = formulas[ii];
      let expression = new Expression(formula.condition);
      if (expression.test(input)) {
        return formula;
      }
    }

    return undefined;
  };


  async getActivePromotion(code, serviceChargeCode, servicePackageCode) {
    let promotions = await this.getPromotions();
    promotions = Enumerable.from(promotions)
      .where(promotion => promotion.code == code)
      .where(promotion => promotion.serviceChargeCode == serviceChargeCode)
      .where(promotion => promotion.servicePackageCode == servicePackageCode)
      .toArray();

    return promotions[0];
  }


  async getFormulasByPolicyPackageAndServiceCharge(policyId, servicePackageCode, serviceChargeCode) {
    let serviceChargeFormulas = await this.getServiceChargeFormulas();
    return Enumerable.from(serviceChargeFormulas)
      .where(formula => formula.policyId == policyId)
      .where(formula => formula.servicePackageCode == servicePackageCode)
      .where(formula => formula.serviceChargeCode == serviceChargeCode)
      .where(formula => formula.state == 'ACTIVE')
      .orderByDescending("formula=>formula.priority")
      .toArray();
  }


  async calculateOrderFee(merchant, order, serviceCharges) {
    //make valid object parameter
    order.weight = typeof order.weight !== 'undefined' ? order.weight : 0;
    order.cod = typeof order.cod !== 'undefined' ? order.cod : 0;
    order.realCod = typeof order.realCod !== 'undefined' ? order.realCod : null;
    order.pickupLocationIdsPath = typeof order.pickupLocationIdsPath !== 'undefined' ? order.pickupLocationIdsPath : null;
    order.deliverLocationIdsPath = typeof order.deliverLocationIdsPath !== 'undefined' ? order.deliverLocationIdsPath : null;
    order.merchantId = merchant.id;

    if (!order.policyId) {
      let policy = await this.getOrderActivePolicy(order, merchant);
      if (policy) {
        order.policyId = policy.id;
      }
    }
    let calPromise = [];
    if (serviceCharges || serviceCharges.length > 0) {
      for (let ii = 0; ii < serviceCharges.length; ++ii) {
        calPromise.push(this.calSCFee(order, merchant, serviceCharges[ii]));
      }
      return Promise.all(calPromise);
    }

    return [];
  };


  /**
   * Tính tổng phí và phí áp cho Shop theo danh sách các phí
   *
   * @param order
   * @param fees
   */
  calculateOrderTotalFee(order, fees = []) {
    order.totalFee = 0;
    order.totalMerchantFee = 0;

    fees.forEach((fee) => {
      let realAmount = (fee.realAmount) ? Number(fee.realAmount) : 0;

      order.totalFee += realAmount;

      if (!fee['chargeType'] || fee.chargeType !== 'RECEIVER') {
        order.totalMerchantFee += realAmount;
      }
    });
  };


  async estimate(data, merchant) {
    if (_.isEmpty(data)) {
      throw new Error('Missing data')
    }

    let order = Object.assign({
      pickupLocationIdsPath: null,
      deliverLocationIdsPath: null
    }, data);

    //get pickupLocationPath
    if (data['pickupLocationId']) {
      let pickupLocation = await this.getLocationById(data.pickupLocationId);
      if (pickupLocation) {
        order.pickupLocationIdsPath = `${pickupLocation.lineage}.${order.pickupLocationId}`;
      }
    }

    //get deliverLocationPath
    if (data['deliverLocationId']) {
      let deliverLocation = await this.getLocationById(data.deliverLocationId);
      if (deliverLocation) {
        order.deliverLocationIdsPath = `${deliverLocation.lineage}.${order.deliverLocationId}`;
      }
    }

    let validator = await this.validateServicePackage(order); //validate
    if (!validator.isValid()) {
      return { failures: validator.failures };
    }


    //không được phép truyền trước các promotion code là auto
    //clear auto promotion
    await this.clearAutoPromotion(order);
    if (!order.promotionCode) {
      let autoPromotion = await this.detectAutoPromotion(order, merchant);
      if (autoPromotion) {
        order.promotionCode = autoPromotion.code;
      }
    }


    //lấy các service charges mà đơn hàng sử dụng (theo trường services)
    let serviceCharges = await this.getSCFromOrder(order);

    /*
     * Tính các phí apply trên đơn hàng, trả về một mảng dữ liệu theo cấu trúc delivery_order_fee.
     * @see ServiceChargeService@calSCFee
     */
    let fees = await this.calculateOrderFee(merchant, order, serviceCharges);

    //Tổng hợp total fee lưu trên order
    this.calculateOrderTotalFee(order, fees);
    return Object.assign(order, { fees: fee });
  }
}

module.exports = Configs;