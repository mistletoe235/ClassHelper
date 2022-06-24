// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList: [],
    selected:0,
    list:[],
    allList:{
      //团支书
      list1:[
        {
          pagePath: "pages/info/info",
          text: "通知",
          iconPath: "/image/tabbar/info.png",
          selectedIconPath: "/image/tabbar/info_full.png"
        },
        {
          pagePath: "pages/student/student",
          text: "名单",
          iconPath: "/image/tabbar/student.png",
          selectedIconPath: "/image/tabbar/student_full.png"
        },
        {
          pagePath: "pages/table/table",
          text: "团课",
          iconPath: "/image/tabbar/table.png",
          selectedIconPath: "/image/tabbar/table_full.png"
        },
        {
          pagePath: "pages/file/file",
          text: "文件",
          iconPath: "/image/tabbar/file.png",
          selectedIconPath: "/image/tabbar/file_full.png"
        },
        {
          pagePath: "pages/user/user",
          text: "我的",
          iconPath: "/image/tabbar/user.png",
          selectedIconPath: "/image/tabbar/user_full.png"
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
          pagePath: "pages/info/info",
          text: "通知",
          iconPath: "/image/tabbar/info.png",
          selectedIconPath: "/image/tabbar/info_full.png"
        },
        {
          pagePath: "pages/file/file",
          text: "文件",
          iconPath: "/image/tabbar/file.png",
          selectedIconPath: "/image/tabbar/file_full.png"
        },
        {
          pagePath: "pages/user/user",
          text: "我的",
          iconPath: "/image/tabbar/user.png",
          selectedIconPath: "/image/tabbar/user_full.png"
        }
      ],
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userinfo = wx.getStorageSync('user')
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

    wx.showLoading({
      title: '加载中',
    })

    var that = this
    wx.cloud.callContainer({
      "config": {
        "env": "prod-9ghk716g03af657a"
      },
      "path": "/list",
      "header": {
        "X-WX-SERVICE": "fastapi",
        "content-type": "application/json"
      },
      "method": "GET",
      "data": "",
      success(list){

        that.setData({
          noticeList:list.data
        })
        console.log(list.data[0])
        wx.hideLoading()
      }
    })

  },

  getDetail: function(e){
   
    //id=e.currentTarget.dataset.id
    var id = e.currentTarget.id
    var notice = this.data.noticeList[id]



    wx.navigateTo({
      url: '../noticeDetail/noticeDetail?title='+ notice[0]  + '&date='+notice[1]+'&detail='+ notice[2]
    })
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


})