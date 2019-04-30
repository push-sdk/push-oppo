# push-oppo

> oppo推送Node服务

根据oppo提供的推送服务实现的 Node 版SDK。支持魅族通知栏推送功能，欢迎大家使用。

[华为推送](https://www.npmjs.com/package/push-huawei)

[小米推送](https://www.npmjs.com/package/push-xiaomi)

[友盟推送](https://www.npmjs.com/package/push-umeng)

[魅族推送](https://www.npmjs.com/package/push-meizu)

[IOS推送](https://www.npmjs.com/package/push-ios)

## 安装
```
npm install push-oppo --save-dev
```

## 实例
```javascript
const Oppo = require('push-oppo');
const oppo = new Oppo({
  appkey: 'appkey',
  masterSecret: 'masterSecret'
});

oppo.push({
  title: '标题',
  content: '内容',
  list: ['pushId'], 
  sleep: 0, // 请求间隔时间/毫秒
  success(res){}, // 成功回调
	error(err){}, // 失败回调
	finish(res){} // 所有请求完成回调
});
```

> 因为oppo api最多支持1000台机器推送，如果 list 长度超过1000，则内部会发起 Math.ceil(n / 1000) 条请求, 同时也会有 Math.ceil(n / 1000) 条回调。

## 参数

| key | value |
|:----|:----|
|appId|appID|
|appSecret|appSecret|
|appKey|appKey|
|masterSecret|masterSecret|
|getTokenUrl|获取token URL 默认 https://api.push.oppomobile.com/server/v1/auth|
|saveMessageUrl|推送URL 默认 https://api.push.oppomobile.com/server/v1/message/notification/save_message_content|
|pushUrl|推送URL 默认 https://api.push.oppomobile.com/server/v1/message/notification/broadcast|
|maxLength|oppo推送限制长度 默认1000|


[oppo官方文档](http://storepic.oppomobile.com/openplat/resource/201904/03/OPPO%E6%8E%A8%E9%80%81%E5%B9%B3%E5%8F%B0%E6%9C%8D%E5%8A%A1%E7%AB%AFAPI-V1.6.pdf)