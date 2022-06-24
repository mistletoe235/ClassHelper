
const app = getApp()

Page({

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
    },
    
    student:[],
    is_save:false

  },
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
  onShow: function (){
    this.setData({
      selected:getApp().globalData.selected
    })
    
    // wx.stopPullDownRefresh()
    var that=this;
    var fn=app.globalData.finishname;
    // setTimeout(() => {
    // }, 300)

    wx.getStorage({
      key: 'stu',
      success (res) {
        that.setData({
          student:res.data
        })
        if(fn){
          console.log("获取并开始比较")
          for(var i=0;i<32;i++){
            if (fn.indexOf(res.data[i].name) != -1) {
              that.switchChange(i.toString());
            }
          }
        }
      }
      })

  },
  sendm(){
    var user = wx.getStorageSync('user')
    wx.cloud.callFunction({
      name:'sendmessage',
      data:{
        name:user.name
      },
      success(res){
        console.log(res.data)
      }
    })
  },



  // onPullDownRefresh: function () {
  //   var that = this;
  //   that.setData({
  //     currentTab: 0 //当前页的一些初始数据，视业务需求而定
  //   })
  //   this.onShow();
  // },
  chooseMessageFile(){
    var that=this
    const files = this.data.files
    wx.chooseMessageFile({
      count: 5,
      success: res => {
        console.log('选择文件之后的res',res)
        let tempF = res.tempFiles[0].path

        wx.cloud.uploadFile({
          cloudPath: 'cloud.xlsx',
          filePath: tempF, // 文件路径
          success: res => {
            console.log(res.fileID)
            

            wx.cloud.callFunction({
              name:"e2j",
              data:{
                file:res.fileID
              }
            }).then(res=>{
              that.setData({
                student:res.result,
                is_save:true
              })
              wx.setStorage({
                key:"stu",
                data:res.result
              })
            });


          },

        })








      }
    })
  },

  cmp:function(){
    var getname=""
    var that=this
    db.collection('class').where({
      _id:that.data.presentaid
    }).get({
      success:res=>{//查询成功执行的函数
        getname=res.data[0].name
        console.log(getname)
        for(var i=0;i<32;i++){
          if (that.data.student[i].name==getname) {
            that.switchChange(i.toString());
          }
        }
      },
      fail:err=>{//失败返回的报错信息
        console.error(err)
      }
    })
  },
  switchChange:function(a){

    var that=this;
    if(a.target!=null)
    var id=a.target.id;
    else var id=a;
    var j="v["+id+"]";
    this.setData({
      [j]:true
    })



    // switch(id){
    //   case '0':{
    //     that.setData({
    //     'v[0]':true
    //   })
    //     break}
    //   case '1':{
    //     that.setData({
    //     'v[1]':true
    //   })
    //     break}
    //   case '2':{
    //     that.setData({
    //     'v[2]':true
    //   }); break}
    //   case '3':{
    //     that.setData({
    //     'v[3]':true
    //   }); break}
    //   case '4':{
    //     that.setData({
    //     'v[4]':true
    //   }); break}
    //   case '5':{
    //     that.setData({
    //     'v[5]':true
    //   }); break}
    //   case '6':{
    //     that.setData({
    //     'v[6]':true
    //   }); break}
    //   case '7':{
    //     that.setData({
    //     'v[7]':true
    //   }); break}
    //   case '8':{
    //     that.setData({
    //     'v[8]':true
    //   }); break}
    //   case '9':{
    //     that.setData({
    //     'v[9]':true
    //   }); break}
    //   case '10':{
    //     that.setData({
    //     'v[10]':true
    //   }); break}
    //   case '11':{
    //     that.setData({
    //     'v[11]':true
    //   }); break}
    //   case '12':{
    //     that.setData({
    //     'v[12]':true
    //   }); break}
    //   case '13':{
    //     that.setData({
    //     'v[13]':true
    //   }); break}
    //   case '14':{
    //     that.setData({
    //     'v[14]':true
    //   }); break}
    //   case '15':{
    //     that.setData({
    //     'v[15]':true
    //   }); break}
    //   case '16':{
    //     that.setData({
    //     'v[16]':true
    //   }); break}
    //   case '17':{
    //     that.setData({
    //     'v[17]':true
    //   }); break}
    //   case '18':{
    //     that.setData({
    //     'v[18]':true
    //   }); break}
    //   case '19':{
    //     that.setData({
    //     'v[19]':true
    //   }); break}
    //   case '20':{
    //     that.setData({
    //     'v[20]':true
    //   }); break}
    //   case '21':{
    //     that.setData({
    //     'v[21]':true
    //   }); break}
    //   case '22':{
    //     that.setData({
    //     'v[22]':true
    //   }); break}
    //   case '23':{
    //     that.setData({
    //     'v[23]':true
    //   }); break}
    //   case '24':{
    //     that.setData({
    //     'v[24]':true
    //   }); break}
    //   case '25':{
    //     that.setData({
    //     'v[25]':true
    //   }); break}
    //   case '26':{
    //     that.setData({
    //     'v[26]':true
    //   }); break}
    //   case '27':{
    //     that.setData({
    //     'v[27]':true
    //   }); break}
    //   case '28':{
    //     that.setData({
    //     'v[28]':true
    //   }); break}
    //   case '29':{
    //     that.setData({
    //     'v[29]':true
    //   }); break}
    //   case '30':{
    //     that.setData({
    //     'v[30]':true
    //   }); break}
    //   case '31':{
    //     that.setData({
    //     'v[31]':true
    //   }); break}
    //   case '32':{
    //     that.setData({
    //     'v[32]':true
    //   }); break}
    //   case '33':{
    //     that.setData({
    //     'v[33]':true
    //   }); break}
    //   case '34':{
    //     that.setData({
    //     'v[34]':true
    //   }); break}
    //   case '35':{
    //     that.setData({
    //     'v[35]':true
    //   }); break}
    //   case '36':{
    //     that.setData({
    //     'v[36]':true
    //   }); break}
    // }
  },

  tel: function(e){
    
    var phonenum=(this.data.student[e.target.id].phonenumber).toString();
    wx.makePhoneCall({
      phoneNumber:phonenum,
    })
},


})

