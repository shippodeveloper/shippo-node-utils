const ConfigsNode = require('./index').ConfigsNode;

const configs = new ConfigsNode({
  host: '159.89.197.165',
  port: 8500,
  defaults: {
    token: 'd491ef48-43ff-5a14-2c7e-d0ab1dc8dfd2'
  }
}, 'shippo-config/master/sandbox/business-config/');

configs.setPopup('asdasd').then(res=>{
  console.log(res);
  
}).catch(err=>{
  console.log(err);
})