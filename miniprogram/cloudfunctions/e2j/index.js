// 云函数入口文件
const cloud = require('wx-server-sdk')
var xlsx = require('node-xlsx');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const fileID = event.file
  const res = await cloud.downloadFile({
    fileID: fileID,
  })
  const buffer = res.fileContent

  var list = xlsx.parse(buffer)

  var department
 
  department = list[0].data
 
  var data={}
  var testData,testData2
 
  for(var j = 1;j < department.length;j ++ ){
    //department[行][列]
    testData = department[j][0]
    testData2 = department[j][1]
    data[j]={
        name:testData,
        phonenumber:testData2
    }
}
  return data
}