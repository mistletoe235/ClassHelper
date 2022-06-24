
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const receiveid = ["ownze5c2lh67mOp147ympugSefYQ"]
  for(var i = 0 ;i <receiveid.length;i++){
    console.log(event)
  await cloud.openapi.subscribeMessage.send({
    touser: receiveid[i],
    page: "",
    data: {
      "thing1":{"value":"请尽快完成青年大学习"},

      "thing4":{"value":`${event.name}`}
    },
    templateId: 'Fs7uyC-3Vyd2QyiZUB5NCfY4Ld9nuHwAI6yHGvuzzDg',
    //miniprogramState: 'trial'
  });
}
  return {
    event
  }
}