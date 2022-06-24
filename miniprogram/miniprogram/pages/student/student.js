const app = getApp()
const db = wx.cloud.database()

let NFCAdapter;
//格式化得到aid值
const ab2hex = function (buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),

    function (bit) {
      return ('00' + bit.toString(16)).slice(-2);
    }
  );
  return hexArr.join('');
};

//配置mqtt
var mqtt = require('../../utils/mqtt.js');
var client = null;

Page({

  data: {
    list: [],
    allList: {
      //团支书
      list1: [{
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
      list2: [{
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
      list3: [{
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
    },

    student: [],
    is_save: false

  },
  switchTab(e) {
    const data = e.currentTarget.dataset
    var url = data.path
    url = '../../' + url
    getApp().globalData.selected = data.index
    wx.switchTab({
      url: url
    })
    this.setData({
      selected: data.index
    })

  },
  onLoad: function () {
    var classid = '2021211108'
    var that = this
    //获取学生名单
    wx.getStorage({
      key: 'stu',
      success(res) {
        console.log(res.data)
        that.setData({
          student: res.data
        })
        db.collection("class").doc(classid).update({
          data: {
            students: res.data
          }
        })
      }
    })

    //判断身份
    var userinfo = wx.getStorageSync('user')
    console.log(userinfo)
    if (userinfo.chosen == '团支书') {
      that.setData({
        list: that.data.allList.list1,

      })
    } else if (userinfo.chosen == '班长') {
      that.setData({
        list: that.data.allList.list2,
      })
    } else {
      that.setData({
        list: that.data.allList.list3,

      })
      console.log(that.data)
    }

    //开启NFC
    NFCAdapter = wx.getNFCAdapter();
    //启动监听NFC标签
    NFCAdapter.startDiscovery({
      success: res => {
        this.title = '请将设备放入识别区NFC';
        console.log(res);
      },
      fail: error => {
        this.title = '刷新重试';
        console.error(error);
      },
      complete: res => {
        console.log(res);
      }
    });
    //初始化监听回调事件
    NFCAdapter.onDiscovered(callback => {
      console.log('onDiscovered callback=>', callback);
      let aid = parseInt(ab2hex(callback.id), 16);
      app.globalData.aid = aid

      that.setData({
        presentaid: aid
      })

      that.cmp();
    });

    //设置mqtt
    this.connectMqtt();
  },

  onShow: function () {
    var that = this
    var classid = '2021211108'
    this.setData({
      selected: getApp().globalData.selected
    })
    db.collection('class').doc(classid).get({
      success(res) {
        that.setData({
          student: res.data.students
        })
        console.log(res.data.students)
      }
    })
  },


  chooseMessageFile() {
    var that = this
    const files = this.data.files
    wx.chooseMessageFile({
      count: 5,
      success: res => {
        console.log('选择文件之后的res', res)
        let tempF = res.tempFiles[0].path

        wx.cloud.uploadFile({
          cloudPath: 'cloud.xlsx',
          filePath: tempF, // 文件路径
          success: res => {
            console.log(res.fileID)


            wx.cloud.callFunction({
              name: "e2j",
              data: {
                file: res.fileID
              }
            }).then(res => {
              that.setData({
                student: res.result,
                is_save: true
              })
              wx.setStorage({
                key: "stu",
                data: res.result
              })
            });


          },

        })

      }
    })
  },

  cmp: function () {

    var that = this
    var aid = that.data.presentaid
    var stu = that.data.student

    for (var i = 0; i < Object.keys(stu).length; i++) {
      if (that.data.student[i].aid) {
        if (that.data.student[i].aid == aid) {
          that.switchChange(i.toString());
          wx.showToast({
            title: '勾选 ' + that.data.student[i].name,
          })
        }
      }
    }

  },

  switchChange: function (a) {

    var that = this;
    if (a.target != null)
      var id = a.target.id;
    else var id = a;
    var j = "v[" + id + "]";
    this.setData({
      [j]: true
    })



  },

  tel: function (e) {

    var phonenum = (this.data.student[e.target.id].phonenumber).toString();
    wx.makePhoneCall({
      phoneNumber: phonenum,
    })
  },



  connectMqtt: function () {
    var that = this;
    const options = {
      connectTimeout: 4000,
      cliendtId: 'wechat',
      port: 443,
      username: 'f694n6g/user',
      password: 'uZme2dZ4Vb13M2ec'
    }

    client = mqtt.connect('wxs://f694n6g.mqtt.iot.gz.baidubce.com/mqtt', options),
      client.on('connect', (e) => {
        console.log('服务器连接成功')
        client.subscribe('aid', { qos: 0 },
          function (err) {
            if (!err) {
              console.log('订阅成功')

            }
          })
      })
    client.on('message', function (topic, message) {
      console.log('收到' + message.toString())
      that.setData({
        presentaid: message.toString()
      })
      console.log(that.data.presentaid)
      that.cmp();

    })
    client.on('reconnect', (error) => {
      console.log('正在重连')
    })
    client.on('error', (error) => {
      console.log('连接失败')
    })

  },

})