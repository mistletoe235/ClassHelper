const app = getApp()
Page({

  data: {
    username: '',
    password: '',
    login_btn:'登录',
    is_s : false,
  },

  onLoad: function () {
    var that=this
    wx.getStorage({
      key: 's_username',
      success (res) {
        console.log(res.data)
        that.setData({
          username: res.data,
          is_s: true,
          login_btn:'获取未完成名单'
        })
      }
    })
    wx.getStorage({
      key: 's_password',
      success (res) {
        that.setData({
          password: res.data
        })
      }
    })
  },
 
 
  // 获取输入账号 
  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
 
  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
 
  // 登录处理
  login: function () {
    var that = this;
    console.log('username',that.data.username)
    this.getlist()

   

  },


  getlist:function(){
    var that=this;
    var temp="";
    var picName=""
    wx.cloud.callContainer({
      "config": {
        "env": ""//填入环境
      },
      "path": `/get/?username=${that.data.username}&password=${that.data.password}`,
      "header": {
        "X-WX-SERVICE": ""//填入名称
      },
      "method": "GET",
      "data": "",
      success(res){
        console.log('success')
        console.log(res.data)
        var p = res.data
        that.setData({
          cookie:'PHPSESSID='+p
        })
        wx.request({
          url: 'https://www.bjyouth.net/statistics/dxx-mine',
          method:"GET",
          header:{
            'cookie':'PHPSESSID='+p
          },
          success(res){
            temp=res.data
          }
        })
  
        wx.request({
          url: 'https://www.bjyouth.net/statistics/dxx-mine?page=2',
          method:"GET",
          header:{
            'cookie':'PHPSESSID='+p
          },
          success(res){
            temp+=res.data
            picName = temp.replace(/[^\u4e00-\u9fa5]/gi, "");
            console.log(picName)
              if (picName[0]=='已'){
                wx.setStorageSync('s_username', that.data.username)
                wx.setStorageSync('s_password', that.data.password)
                that.allinfo()
                app.globalData.finishname=picName.toString()
                wx.showToast({
                  title: "获取成功", // 提示的内容
                  icon: "success", // 图标，默认success
                  duration: 700, // 提示的延迟时间，默认1500
                  mask: false, // 是否显示透明蒙层，防止触摸穿透
            })
              }
              else{
                wx.showToast({
                  title: '登录失败',
                  icon:'error'
                })
              }
            
          }
        })
      }
    })
  },

  allinfo:function(){
    var that=this


      wx.cloud.callFunction({
        name:"get_all_info",
        data:{
          cookie:that.data.cookie
        }
      }).then(res=>{
        console.log(res.result)
        wx.setStorage({
          key:"stu",
          data:res.result,
          success(){
            wx.navigateBack({
              delta: 0,
            })
          }
        })

      })
  
            
  },
  
})