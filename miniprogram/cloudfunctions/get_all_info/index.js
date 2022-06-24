// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require('cheerio')
const request = require('request')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  

return new Promise((resolve, reject) =>{
  var options1 = {
    'method': 'GET',
    'url': 'https://www.bjyouth.net/org/my-league-members',
    'headers': {
      'cookie': event.cookie
    }
  };
  var options2 = {
      'method': 'GET',
      'url': 'https://www.bjyouth.net/org/my-league-members?page=2',
      'headers': {
        'cookie': event.cookie
      }
  };
  var name={}
  var phonenumber={}
  var data={}
  var p1_num
  var total_num
  request(options1, function (error, response,body) {
    if (error) throw new Error(error);
    var $ = cheerio.load(body)
      $('[target=_blank][data-pjax]', 'table').each(function (i, element) {
          name[i] = $(element).text() 
          phonenumber[i] = $(element).parent().next().next().next().text()
          p1_num=i
      })
      console.log(p1_num)
  
          request(options2, function (error, response,body) {
              if (error) throw new Error(error);
              var $ = cheerio.load(body)
                $('[target=_blank][data-pjax]', 'table').each(function (i, element) {
                    name[p1_num+1+i] = $(element).text() 
                    phonenumber[p1_num+1+i] = $(element).parent().next().next().next().text()
                    total_num=p1_num+1+i
                })
                console.log(total_num)
  
                for(var i=0;i<=total_num;i++){
                    data[i]={
                        name:name[i],
                        phonenumber:phonenumber[i]
                    }
                }
                console.log(name[29])
                return resolve(data)
          })
  });
  })
  
}

