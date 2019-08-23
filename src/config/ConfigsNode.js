const Configs = require('./Configs');
const NodeCache = require('node-cache');

class ConfigsNode extends Configs {
  constructor(configs) {
    super(configs);
    this.cache = new NodeCache();
  };

  getConfigs(configs) {
    const consul = require('consul')(configs);
    consul.kv.keys('', (err, keys) => {
      if (err) throw err;
      keys.forEach(key => {
        let watch = consul.watch({
          method: consul.kv.get,
          options: { key },
          backoffFactor: 5000,
        });

        watch.on('change', (data, res) => {
          this.setCache(data.Key, data.Value);
        });

        watch.on('error', function (err) {
          console.log('consul_watch_error:', err);
        });
      });
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
}

module.exports = ConfigsNode;