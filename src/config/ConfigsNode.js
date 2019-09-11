const Configs = require('./Configs');
const NodeCache = require('node-cache');

class ConfigsNode extends Configs {
  constructor(configs, businessConfigPath) {
    super(configs, businessConfigPath);
    this.cache = new NodeCache();
  };

  getConfigs(configs, businessConfigPath) {
    const consul = require('consul')(configs);
    consul.kv.keys(businessConfigPath, (err, keys) => {
      if (err) throw err;

      for (let ii = 0; ii < keys.length; ii++) {
        const key = keys[ii];

        if (key.slice(-1) === '/') continue;

        let watch = consul.watch({
          method: consul.kv.get,
          options: { key },
          backoffFactor: 5000,
        });

        watch.on('change', (data, res) => {
          if (data) {
            this.setCache(data.Key, data.Value);
          }
        });

        watch.on('error', function (err) {
          console.log('consul_watch_error:', err);
        });
      }

    });
  }

  /**
   * 
   * @param {String} key
   */
  async getCache(key) {
    let value = this.cache.get(key);
    if (!value) throw new Error("Key not found!");
    return value;
  }

  /**
   * 
   * @param {String} key 
   * @param {*} value 
   */
  async setCache(key, value) {
    return this.cache.set(key, value);
  }

  /**
   * 
   * @param {String} path 
   * @return {Array}
   */
  async getKeys(path) {
    let keys = this.cache.keys();
    if (path) {
      keys = keys.filter(key => (key.indexOf(path) === 0))
    }
    return keys;
  }
}

module.exports = ConfigsNode;