// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    allList:{
      //团支书
      list1:[
        {
          "pagePath": "pages/info/info",
          "text": "通知",
          "iconPath": "/image/tabbar/info.png",
          "selectedIconPath": "/image/tabbar/info_full.png"
        },
        {
          "pagePath": "pages/student/student",
          "text": "名单",
          "iconPath": "/image/tabbar/student.png",
          "selectedIconPath": "/image/tabbar/student_full.png"
        },
        {
          "pagePath": "pages/table/table",
          "text": "团课",
          "iconPath": "/image/tabbar/table.png",
          "selectedIconPath": "/image/tabbar/table_full.png"
        },
        {
          "pagePath": "pages/file/file",
          "text": "文件",
          "iconPath": "/image/tabbar/file.png",
          "selectedIconPath": "/image/tabbar/file_full.png"
        },
        {
          "pagePath": "pages/user/user",
          "text": "我的",
          "iconPath": "/image/tabbar/user.png",
          "selectedIconPath": "/image/tabbar/user_full.png"
        }
      ],
      //班长
      list2:[
        {
          "pagePath": "pages/info/info",
          "text": "通知",
          "iconPath": "/image/tabbar/info.png",
          "selectedIconPath": "/image/tabbar/info_full.png"
        },
        {
          "pagePath": "pages/student/student",
          "text": "名单",
          "iconPath": "/image/tabbar/student.png",
          "selectedIconPath": "/image/tabbar/student_full.png"
        },
        {
          "pagePath": "pages/file/file",
          "text": "文件",
          "iconPath": "/image/tabbar/file.png",
          "selectedIconPath": "/image/tabbar/file_full.png"
        },
        {
          "pagePath": "pages/user/user",
          "text": "我的",
          "iconPath": "/image/tabbar/user.png",
          "selectedIconPath": "/image/tabbar/user_full.png"
        }
      ],
      //同学
      list3:[
        {
          "pagePath": "pages/info/info",
          "text": "通知",
          "iconPath": "/image/tabbar/info.png",
          "selectedIconPath": "/image/tabbar/info_full.png"
        },
        {
          "pagePath": "pages/file/file",
          "text": "文件",
          "iconPath": "/image/tabbar/file.png",
          "selectedIconPath": "/image/tabbar/file_full.png"
        },
        {
          "pagePath": "pages/user/user",
          "text": "我的",
          "iconPath": "/image/tabbar/user.png",
          "selectedIconPath": "/image/tabbar/user_full.png"
        }
      ],
    }
  },

  onLoad: function (options) {
    var that = this
    var userinfo = wx.getStorageSync('user')
    this.setData({
      userinfo
    })
    console.log(userinfo)
    if( userinfo.chosen == '团支书' ){
      that.setData({
        list:that.data.allList.list1,
        
      })
    }
    else if( userinfo.chosen == '班长' ){
      that.setData({
        list:that.data.allList.list2,
      })
    }
    else{
      that.setData({
        list:that.data.allList.list3,
        
      })
      console.log(that.data)
    }
  },
  switchTab(e) {
    const data = e.currentTarget.dataset
    var url = data.path
    url = '../../'+url
    getApp().globalData.selected = data.index
    wx.switchTab({
       url:url
      })
    this.setData({
      selected: data.index
    })
  },


  quit(){
    wx.clearStorageSync()
    wx.navigateTo({
      url: '../login/login',
    })
  },
  go(e) {

    wx.navigateTo({
          url: e.currentTarget.dataset.go
    })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      selected:getApp().globalData.selected
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})