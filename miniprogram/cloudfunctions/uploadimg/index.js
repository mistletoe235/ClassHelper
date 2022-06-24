// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  request({
    url: 'http://api.heclouds.com/bindata/944624437_1652778270242_photo',
    headers:{
      'api-key':'uHW5G5LTUfdaMWFehqE5BIVyJCs='
    },
    success(res){
      console.log(res)
    }
  })
  // wx.request({
  //   url: 'http://api.heclouds.com/bindata/944624437_1652778270242_photo',
  //   header:{
  //     'api-key':'uHW5G5LTUfdaMWFehqE5BIVyJCs='
  //   },
  //   responseType: 'arraybuffer', 
  //   success: function (res) {
  //     console.log(res)
  //     if(res.statusCode === 200){
  //         var imgSrc =  wx.arrayBufferToBase64(res.data);//二进制流转为base64编码
  //         await cloud.uploadFile({
  //           cloudPath: 'test/' + 'photo'  + '.jpg', //这里如果可以重复就用openId，如果不可能重复就用 
  //           fileContent: imgSrc, //处理buffer 二进制数据
  //           success: res => {
  //               // 文件地址
  //               console.log(res.fileID)
  //           },
  //           fail: err =>{
  //               console.log(err)
  //           }
  //       })
          

  //     }
  // },
  // })

  return {

  }
}