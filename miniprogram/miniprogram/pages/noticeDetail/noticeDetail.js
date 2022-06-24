// pages/noticeDetail/noticeDetail.js
Page({
  data: {
    title: '',
    date: '',
    detail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取前面的页面传递来的参数
    console.log(options)
    var title = options.title
    var date = options.date
    var detail = options.detail

    this.setData({
      title: title,
      date: date,
      detail:detail
    })
  },

})