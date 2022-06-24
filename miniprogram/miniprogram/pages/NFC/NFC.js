const app = getApp();
const db=wx.cloud.database();
let NFCAdapter;
var mqtt = require( '../../utils/mqtt.js');
var client=null;


 //格式化得到aid值
const ab2hex = function(buffer) {
	var hexArr = Array.prototype.map.call(
		new Uint8Array(buffer),

		function(bit) {
			return ('00' + bit.toString(16)).slice(-2);
		}
	);
	return hexArr.join('');
};
Page({
  nameInput: function (e) {
    this.setData({ 
      inname: e.detail.value 
    })
    if(e.detail.value&&this.data.aidvalue) this.setData({
      tijiao:0
    });
  },
  doName:function(){
    var that = this
    var classid = '2021211108'
    var name = this.data.inname
    this.setData({
      name
    })
    //console.log(this.data.name)
    if(wx.getStorageSync('stu')){
      var stu = wx.getStorageSync('stu')
      console.log(stu)
      var x
      for(x in stu){
        if(stu[x]['name']==name){
          console.log(stu[x])
          stu[x]['aid'] = that.data.aidvalue
        }
        else {
          stu[x]['aid'] =''
        }
      }
      db.collection("class").doc(classid).update({
        data: {
          students: stu
        }
      })
    }

  },

  data: {
    aidvalue:0,
    inname:"",
    name:"",
    tijiao:1
  },


  onLoad: function (options) {
    var that = this;
    that.connectMqtt()
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
      app.globalData.aid=aid
      //wx.navigateTo({
      //  url: '../index/index'//实际路径要写全
      //})
      that.setData({
        aidvalue:aid
      })
			console.log(aid);
			if (callback.messages) {
        let cordsArray = callback.messages[0].records;
				cordsArray.find(item => {
					this.read.payload = byteToString(new Uint8Array(item.payload));
					this.read.id = byteToString(new Uint8Array(item.id));
					this.read.type = byteToString(new Uint8Array(item.type));
      });
    }
    });


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  closeNFC() {
		NFCAdapter.offDiscovered();
		NFCAdapter.stopDiscovery();
	},
  onHide: function () {
    this.closeNFC();
  },

  connectMqtt:function(){
    var that=this;
    const options={
      connectTimeout:4000,
      cliendtId:'wechat',
      port:443,
      username:'f694n6g/user',
      password:'uZme2dZ4Vb13M2ec'
    }

    client=mqtt.connect('wxs://f694n6g.mqtt.iot.gz.baidubce.com/mqtt',options),
    client.on('connect',(e)=>{
        console.log('服务器连接成功')
        client.subscribe('aid',{qos:0},
        function(err){
          if(!err){
            console.log('订阅成功')

          }
        })
    })
    client.on('message',function(topic,message){
      console.log('收到'+message.toString())
      that.setData({
        aidvalue:message.toString()
      })
      console.log(that.data.aidvalue)
    })
    client.on('reconnect',(error)=>{
      console.log('正在重连')
  })
  client.on('error',(error)=>{
    console.log('连接失败')
})

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