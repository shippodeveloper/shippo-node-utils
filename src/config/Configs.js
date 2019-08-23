class Configs {
  constructor(configs) {
    this.getConfigs(configs);
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

  async getAnnouncements(posKey) {
    let cacheConfigs = await this.getCache("announcements");
    if(typeof cacheConfigs === 'string') {
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
    let cacheConfigs = await this.getCache("businessConfigs");
    if(typeof cacheConfigs === 'string') {
      cacheConfigs = JSON.parse(cacheConfigs);
    }
    return cacheConfigs.filter(config => configKeys.includes(config.config_key))
  }

  /**
   * 
   * @param {Number} phone Số điện thoại cần kiểm tra
   * @param {String} location Tên quốc gia để kiểm tra số điện thoại
   */
  async validateMobile(mobile, location) {
    let result = { status: false, message: 'Đầu số chưa được hỗ trợ' };
    let cacheConfigs = await this.getCache("businessConfigs")

    if(typeof cacheConfigs === 'string') {
      cacheConfigs = JSON.parse(cacheConfigs);
    }

    mobile = mobile ? mobile.replace(/\D/g, '').replace(/^84|^\+84/, 0) : mobile;
    location = location ? location.replace(/\ /gm, "").toUpperCase() : location;

    if (!mobile) return result
    if (isNaN(mobile)) {
      return result
    }

    let mobile_prefix;
    cacheConfigs.map(config => {
      if (config.config_key === `${location}_VALID_MOBILE`) {
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
      result.message = 'Độ dài số điện thoại không hợp lệ';
    }
    return result
  }

  /**
   * 
   * @param {Number} id
   */
  async getLocationsById(id) {
    let locations = await this.getCache("locations");
    if(typeof locations === 'string') {
      locations = JSON.parse(locations);
    }
    return locations.find(location => (location.id == id && location.is_deleted == 0))
  }

  /**
   * 
   * @param {Number} parentId 
   */
  async getLocationsByParentId(parentId) {
    let locations = await this.getCache("locations");
    if(typeof locations === 'string') {
      locations = JSON.parse(locations);
    }
    return locations.filter(location => location.parent_id == parentId)
  }

  /**
   * 
   * @param {String} parentPath exp: "8.9"
   */
  async getLocationsByParentPath(parentPath) {
    let locations = await this.getCache("locations");
    if(typeof locations === 'string') {
      locations = JSON.parse(locations);
    }
    let regParentPath = new RegExp(parentPath + ".*");
    return locations.filter(location => {
      return location.lineage && location.lineage.match(regParentPath)
    })
  }
}

module.exports = Configs;