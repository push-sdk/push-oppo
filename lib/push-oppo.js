const axios = require('axios');
const _ = require('lodash');
const querystring = require('querystring');
const crypto = require('crypto');

class Oppo {
  constructor(options = {}) {
    options.getTokenUrl = options.getTokenUrl || 'https://api.push.oppomobile.com/server/v1/auth';
    options.saveMessageUrl = options.saveMessageUrl || 'https://api.push.oppomobile.com/server/v1/message/notification/save_message_content';
    options.pushUrl = options.pushUrl || 'https://api.push.oppomobile.com/server/v1/message/notification/broadcast';
    options.maxLength = options.maxLength || 1000;
    options.timeout = options.timeout || 300000;

    if (!options.appkey) throw new Error('oppo appkey 不能为空');
    if (!options.masterSecret) throw new Error('oppo masterSecret 不能为空');

    this.options = options;
  }

  async sleep(time) {
    return new Promise((reslove) => {
      setTimeout(() => {
        reslove({});
      }, time);
    });
  }

  async saveMessage(data, auth_token) {
    const params = _.merge({
      app_message_id: +new Date()
    }, data);
    return axios({
      url: this.options.saveMessageUrl,
      method: 'POST',
      data: querystring.stringify(params),
      headers: {
        auth_token
      }
    });
  }

  async push(data) {
    let n = 0;
    let success_total = 0;
    let fail_total = 0;
    const tokenData = await this.getToken();
    const auth_token = tokenData.data.auth_token;
    const msgData = await this.saveMessage(data, auth_token);
    const message_id = msgData.data.data.message_id;

    const target_value = _.chunk(data.list, this.options.maxLength);
    data.success = data.success || function () { };
    data.fail = data.fail || function () { };
    data.finish = data.finish || function () { };

    for (const i in target_value) {
      axios({
        url: this.options.pushUrl,
        method: 'POST',
        timeout: this.options.timeout,
        data: querystring.stringify({
          message_id,
          target_type: 2,
          target_value: target_value[i].join(';')
        }),
        headers: {
          auth_token
        },
      }).then(res => {
        data.success(res);
        if (res.data && res.data.code == 0) {
          const len = res.data.data['10000'] ? res.data.data['10000'].length : 0;
          fail_total += len;
          success_total += target_value[i].length - len;
        }
      }).catch((err) => {
        fail_total += target_value[i].length;
        data.fail(err);
      }).then(() => {
        n++;
        if (n >= target_value.length) {
          data.finish({
            status: 'success',
            maxLength: this.options.maxLength,
            group: target_value.length,
            success_total,
            fail_total
          });
        }
      });

      await this.sleep(data.sleep);
    }

  }

  async getToken() {
    const timestamp = Date.now();
    const sign = crypto.createHash('SHA256').update(`${this.options.appkey}${timestamp}${this.options.masterSecret}`).digest('hex');

    const res = await axios({
      url: this.options.getTokenUrl,
      method: 'POST',
      data: querystring.stringify({
        app_key: this.options.appkey,
        sign,
        timestamp
      }),
    });

    return res.data;
  }

}

module.exports = Oppo;