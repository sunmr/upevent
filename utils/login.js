let wxLogin = {
   getUser:function(){
     let userInfo = wx.getStorageSync('userInfo');
     if(userInfo){
       return userInfo;
     }else{
       return null;
     }
   },
   getOpenId:function(){
     let openId = wx.getStorageSync('openid');
     if(openId){
       return openId;
     }else{
       return null;
     }
   },
   getPhone:function(){
     let phone = wx.getStorageSync('phone');
     if(phone){
       return phone;
     }else{
       return null;
     }
   },
   getRealName:function(){
     let realname = wx.getStorageSync('realname');
     if(realname){
       return realname;
     }else{
       return null;
     }
   },
   getJob:function(){
     let job = wx.getStorageSync('job');
     if(job){
       return job;
     }else{
       return null;
     }
   }
}
module.exports = wxLogin;