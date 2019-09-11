const ConfigsNode = require('./index').ConfigsNode;

const configs = new ConfigsNode({
  host: '159.89.197.165',
  port: 8500,
  defaults: {
    token: 'd491ef48-43ff-5a14-2c7e-d0ab1dc8dfd2'
  }
}, 'shippo-config/master/sandbox/business-config/');

let data = {
  "pickupLocationId": 12,
  "deliverLocationId": 13,
  "deliveryPackage": "STC",
  "shift": "EVENING",
  "weight": 4500,
  "cod": 800000,
  "chargeType": "SENDER",
  "services": {
    "insurance": {
      "amount": 0
    }
  }
}

let merchant = {
  "id": 1000089,
  "userId": 1879,
  "username": "citycycle",
  "code": "BUP7339",
  "fullName": "Shop Chân Giò Mẹ Muối",
  "gender": 0,
  "mobile": "0987777777",
  "realBalance": 451000000,
  "avatar": "",
  "affiliateCode": null,
  "birthday": "2000-02-01T17:00:00.000Z",
  "email": "citycycle0515@test.shippo.com",
  "isEmailVerified": false,
  "state": "ACTIVE",
  "banks": [
    {
      "bankName": "aadfn",
      "bankBranch": "andf",
      "bankNumber": "12312312x3123",
      "bankAccount": "Nguyenasf Z"
    },
    {
      "bankName": "Techcombank",
      "bankBranch": "string",
      "bankNumber": "123123",
      "bankAccount": "Nguyen Van Z"
    },
    {
      "bankName": "Techcombank",
      "bankBranch": "string",
      "bankNumber": "12312312x3s123",
      "bankAccount": "Nguyen Van Z"
    },
    {
      "bankName": "Techcombank",
      "bankBranch": "string",
      "bankNumber": "12312312x3s123   ",
      "bankAccount": "Nguyen Van Z"
    },
    {
      "bankName": "Techcombank",
      "bankBranch": "string",
      "bankNumber": "312",
      "bankAccount": "Nguyen Van Z"
    }
  ],
  "firstOrderAt": "2017-10-05T03:22:34.473Z",
  "lastOrderAt": "2017-11-29T13:13:41.000Z",
  "metadata": null,
  "trialPolicyExpiredDate": "2017-10-12T03:22:34.473Z",
  "policyGroupId": 1,
  "version": 322,
  "ordersNo": 48,
  "createdAt": "2017-10-04T13:08:26.951Z",
  "updatedAt": "2019-07-10T09:02:16.258Z",
  "MerchantSpecialPolicyGroup": {
    "id": 1,
    "name": "KH thân thiết",
    "description": "Các khách dùng thử dịch vụ giai đoạn Beta. Ưu đại mức phí 18K giao nội thành",
    "state": "ACTIVE",
    "createdAt": "2019-01-23T10:00:41.062Z",
    "updatedAt": "2019-01-23T10:00:41.062Z"
  }
};

setTimeout(() => {
  configs.estimate(data, merchant).then(res =>{
    console.log(res);
  }
  // configs.getServiceChargeFormulas(res=>{
  //   console.log(res);
    
  // }
  ).catch(err=>{
    console.log(err);
  })
}, 5000);