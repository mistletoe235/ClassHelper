// pages/file/file.js
const db = wx.cloud.database()
var fs = wx.getFileSystemManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected:1,
    list:[
      
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
    currentSubject:['数学分析','数据结构与算法','科目3','科目4'],
    subjectNumber:0,
    currentSubjectMaterial:[]
  },

//选择科目
  selectSubject:function(e){
    var index=e.detail.value;
    var materialName=this.data.currentSubject[index];
    var that=this;
    db.collection('materials').where({
      subject:materialName
    }).get({
      success:function(res){
        // console.log("获取到的对象",res);
        that.setData({
          currentSubjectMaterial:res.data
        })
        console.log(that.data.currentSubjectMaterial);
      }
    })
    console.log("当前科目资料",this.data.currentSubjectMaterial)
  },
//上传文件
  uploadMat:function(){
    var timestamp=(new Date()).valueOf();
    var that =this;
    var materialName=this.data.currentSubject[this.data.subjectNumber];
    wx.chooseMessageFile({
      count: 1,
      type:'file',
      success(res){
        console.log("上传成功",res)
        var arr=res.tempFiles[0].name.split('.');
        var fileType=arr[1];
        wx.cloud.uploadFile({
          
          cloudPath:materialName+"资料"+timestamp+'.'+fileType,
          filePath:res.tempFiles[0].path,
          success:res=>{
            console.log("上传到云存储成功",res)
            
            db.collection('materials').add({
              data:{
                subject:materialName,
                name:materialName+"资料"+timestamp,
                fileID:res.fileID
              },
              success(){
                that.onShow()
              }
            })
          }
        })

      },
      fail(err){
        console.log("上传文件错误",err)
      }

    })
  },
//下载文件
  downloadFile:function(e){
    console.log("按钮信息",e)
    var buttonId=e.currentTarget.id;
    console.log(buttonId)
    var currentFildId=this.data.currentSubjectMaterial[buttonId].fileID;
    wx.cloud.downloadFile({
      fileID:currentFildId,
      success:res=>{
        console.log("下载成功",res)
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          showMenu:true,
          success: function (res) {
            console.log('打开文档成功',res)
          }
        })
      },
      fail:err=>{
        console.log("下载失败",err)
      }
    })
  },
//删除文件
  deleteFile:function(e){
    var that = this
    console.log("删除文件信息",e)
    var currentFild=e.currentTarget.id;
    var currentFildId=this.data.currentSubjectMaterial[currentFild].fileID;
    wx.showModal({
      content:"是否删除文件",
      success(res){
        console.log("询问返回值",res)
        if(res.confirm){
          wx.cloud.deleteFile({
            fileList: [currentFildId], // 文件唯一标识符 cloudID, 可通过上传文件接口获取
            success(res){
              console.log("删除成功",res)
            },
            fail(err){
              console.log("删除失败",err)
            }
          })
          db.collection('materials').where({
            fileID:currentFildId
          }).get({
            success(res){
              console.log("待删除的数据",res)
              var id=res.data[0]._id;
              db.collection('materials').doc(id).remove({
                success(res){
                  console.log("数据库删除成功",res)
                  that.onShow()
                }
              })
            }
          })
        }
      }
    })
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


  },
  switchTab(e) {
    const data = e.currentTarget.dataset
    var url = data.path
    url = '../../'+url
    //console.log(data.index)
    getApp().globalData.selected = data.index
    wx.switchTab({
       url:url
      })
    this.setData({
      selected: data.index
    })

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      selected:getApp().globalData.selected
    })
    var materialName=this.data.currentSubject[this.data.subjectNumber];
    var that=this;
    db.collection('materials').where({
      subject:materialName
    }).get({
      success:function(res){
        console.log("获取到的对象",res);
        that.setData({
          currentSubjectMaterial:res.data
        })
        console.log(that.data.currentSubjectMaterial);
      }
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