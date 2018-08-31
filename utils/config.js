
// 数据请求地址
const host = "s.uplism.com"
const viphost = "www.upcoll.com"
var config = {
  // 下面的地址配合云端 Server 工作
  host: `https://${host}/`,
  viphost: `https://${viphost}/`,
  // 短信验证接口地址
  smsUrl: `https://${host}/sendSms/`,
  // 数据请求接口地址
  requestUrl: `https://${host}/Huod/`,
 // 官方活动数据接口地址
  vipUrl:`https://${host}/sunmr` ,
  // token请求地址
  tokenUrl: `https://${host}/sunmr/sendMessage`,
  // 百度AK填写，用于获取地理位置
  baiduAk: 'ITQsH2Oc9f7FlBZcqHxjok9pH8ZhmNGt'
  
};

module.exports = config