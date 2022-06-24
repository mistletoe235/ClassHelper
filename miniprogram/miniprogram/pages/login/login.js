// pages/login/login.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ["团支书", "班长", "其他"],
    chosen: "请选择您的身份",
    showp: false,
    name: null,
  },



  nameInput(e) {
    this.data.name = e.detail.value;
  },
  classInput(e) {
    this.data.classid = e.detail.value;
  },
  passInput(e) {
    this.data.password = e.detail.value;
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var array = this.data.array
    this.setData({
      chosen: array[e.detail.value],
      showp: false
    })
    if (e.detail.value == 0 || e.detail.value == 1) {
      this.setData({
        showp: true
      })
    }
  },
  getUserInfo(e) {
    var that = this
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (ures) => {
        this.setData({
          userInfo: ures.userInfo,
          hasUserInfo: true
        })
        console.log(ures.userInfo)
        if (!that.data.password) {
          db.collection('class').doc(that.data.classid).get({
            success(res) {

              if (!res) {
                wx.showToast({
                  title: '班级不存在',
                  icon: 'error'
                })
              }
              else {
                console.log(res.data.students)
                var students = JSON.stringify(res.data.students)
                // console.log(res.data.students[i].name,that.data.name)
                if (students.indexOf(that.data.name) != -1) {
                  console.log('1')
                  wx.setStorageSync('user', that.data)
                  db.collection('user').add({
                    data: {
                      name: that.data.name,
                      classid: that.data.classid,
                      type: 3
                    },
                  })
                    .then(res => {
                      wx.switchTab({
                        url: '../info/info',
                      })
                    })
                }


              }
            }
          })
        }
        else if (that.data.password == 'test') {
          var type
          if (that.data.chosen == '团支书') type = 1
          else type = 2
          wx.setStorageSync('user', that.data)
          db.collection('user').add({
            data: {
              name: that.data.name,
              classid: that.data.classid,
              type
            },
          })
            .then(res => {
              wx.switchTab({
                url: '../info/info',
              })
            })
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (wx.getStorageSync('user')) {

      wx.switchTab({
        url: '../info/info',
      })
    }
  },


})