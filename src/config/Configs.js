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

  /**
   * 
   * @param {String} key 
   * @param {*} value 
   */
  async setKey(key, value) {
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
   * @param {Array} key Danh sách các key
   */
  async getManyQuickFilterOrder(keys) {
    let manyQuickFilterOrder = await this.getCache(this.businessConfigPath + "quickFilterOrder");
    if (typeof manyQuickFilterOrder === 'string') {
      manyQuickFilterOrder = JSON.parse(manyQuickFilterOrder);
    }

    if (!keys) return manyQuickFilterOrder;
    return manyQuickFilterOrder.filter(quickFilterOrder => keys.includes(quickFilterOrder.key))
  }

  /**
   * 
   * @param {string} key 
   */
  async getQuickFilterOrderByKey(key) {
    let manyQuickFilterOrder = await this.getCache(this.businessConfigPath + "quickFilterOrder");
    if (typeof manyQuickFilterOrder === 'string') {
      manyQuickFilterOrder = JSON.parse(manyQuickFilterOrder);
    }
    return manyQuickFilterOrder.find(quickFilterOrder => quickFilterOrder.key == key);
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

  async getBestExpressRiderIds() {
    let bestExpressRiderIds = await this.getCache(this.businessConfigPath + "bestExpressRiderIds");
    if (typeof bestExpressRiderIds === 'string') {
      bestExpressRiderIds = JSON.parse(bestExpressRiderIds);
    }

    return bestExpressRiderIds;
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

  async setPopup(value) {
    await this.setKey('popup', value);
  }

  async setAnnouncement(value) {
    await this.setKey('announcement', value);
  }

  async getConfigVersion() {
    let configVersion = await this.getCache(this.businessConfigPath + "ConfigVersion");
    if (typeof configVersion === 'string') {
      configVersion = JSON.parse(configVersion);
    }

    return configVersion;
  }

  async updateConfigVersion() {
    let configVersion = await this.getConfigVersion();
    await this.setKey('ConfigVersion', String(configVersion + 1))
  }

  async getUserAllowUpdateNotification() {
    let userAllowUpdateNotification = await this.getCache(this.businessConfigPath + "userAllowUpdateNotification");
    if (typeof userAllowUpdateNotification === 'string') {
      userAllowUpdateNotification = JSON.parse(userAllowUpdateNotification);
    }

    return userAllowUpdateNotification;
  }

  async getTemplatePrintSticker(username) {
    let configTemplatePrintSticker = await this.getCache(this.businessConfigPath + "configTemplatePrintSticker");
    configTemplatePrintSticker = JSON.parse(configTemplatePrintSticker)

    if (!username) return configTemplatePrintSticker;

    return configTemplatePrintSticker.username;
  }
}

module.exports = Configs;