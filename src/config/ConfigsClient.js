const Configs = require('./Configs');

class ConfigsClient extends Configs {
  constructor(configs) {
    super(configs);
  };

  getConfigs(configs) {
    const consul = require('consul')(configs);

    setInterval(() => {
      this.checkVersion(consul);
    }, 5000);
  }

  checkVersion(consul) {
    consul.kv.get("ConfigVersion", (errorGetVersion, result) => {
      if (errorGetVersion) throw errorGetVersion;
      if (result.Value !== localStorage.getItem("ConfigVersion")) {
        this.fetchKeys(consul)
      }
    })
  }

  fetchKeys(consul) {
    consul.kv.keys('', (errorGetKey, keys) => {
      if (errorGetKey) throw errorGetKey;
      keys.forEach(key => {
        this.fetchConfigs(consul, key);
      });
    });
  }

  fetchConfigs(consul, key) {
    consul.kv.get(key, (errorGetConfig, configs) => {
      if (errorGetConfig) throw errorGetConfig;
      localStorage.setItem(configs.Key, configs.Value)
    })
  }

  /**
   * 
   * @param {String} key
   */
  async getCache(key) {
    let value = localStorage.getItem(key);
    if (!value) throw new Error("Key not found!");
    return value;
  }

  /**
   * 
   * @param {String} key 
   * @param {Object || String} value 
   */
  async setCache(key, value) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    return localStorage.setItem(key, value);
  }
}

module.exports = ConfigsClient