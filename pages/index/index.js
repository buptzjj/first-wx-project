//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    topTabItems: ['出口', '机房', '档案'],
    currentTopItem: 0,
    envList: [],
    idcList: [],
    cardList: [],
    swiperHeight: "0",
    currentProject: "北京移动",
    actionSheetHidden: true,
    projectList: [],
    modalHidden: true,
    scanResult: '',
    serialNumber: ''
  },
  //切换顶部标签
  switchTab: function (e) {
    console.log(e);
    this.setData({
      currentTopItem: e.currentTarget.dataset.idx
    });
  },
  //点击切换项目组
  switchProject: function () {
    var that = this;
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    })
  },
  //选择新的项目组
  chooseProject: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      currentProject: e.currentTarget.dataset.project,
      actionSheetHidden: !that.data.actionSheetHidden
    });
    that.refreshPageData(e.currentTarget.dataset.project);

  },
  //左右滑动切换出口-机房
  bindChange: function (e) {
    var that = this;
    console.log(e);
    that.setData({
      currentTopItem: e.detail.current
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    }),
      that.getProjectList();
    that.setData({
      envList: [{
        id: 0,
        name: '省网出口',
        attr: '服务器：15台，探针：10台，交换机：3台',
        avator: '../../img/signal.png'
      }, {
        id: 1,
        name: '缓存出口',
        attr: '服务器：15台，探针：10台，交换机：3台',
        avator: '../../img/signal.png',
        alarmNum: 7
      }, {
        id: 2,
        name: 'IDC出口',
        attr: '服务器：15台，探针：10台，交换机：3台',
        avator: '../../img/signal.png',
        alarmNum: 13
      }, {
        id: 3,
        name: '省内出口',
        attr: '服务器：15台，探针：10台，交换机：3台',
        avator: '../../img/signal.png',
        alarmNum: '...'
      },
      {
        id: 4,
        name: '城域网出口',
        attr: '服务器：15台，探针：10台，交换机：3台',
        avator: '../../img/signal.png',
        alarmNum: 12
      }],
      idcList: [{
        id: 0,
        name: '望京机房',
        attr: '服务器：15台，探针：10台，交换机：3台',
        avator: '../../img/idc.png',
        alarmNum: 3
      }],
      cardList: [{
        id: 0,
        name: 'a',
        attr: '合同1',
        avator: '../../img/server2.jpg'
      },
      {
        id: 1,
        name: 'ab',
        attr: '合同2',
        avator: '../../img/server2.jpg'
      }, {
        id: 2,
        name: 'abc',
        attr: '合同3',
        avator: '../../img/server2.jpg'
      }]
    })
  },
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      transformOrigin: "50% 50% 0",
      timingFunction: "ease-in"
    });
    this.animation = animation;
    animation.scale(1.5, 1.5).step();
    this.setData({
      animationData: animation.export()
    })
  },
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          swiperHeight: (res.windowHeight - 37)
        });
      }
    })
  },
  getProjectList: function () {
    var that = this;
    that.setData({
      projectList: [
        "北京移动",
        "北京联通",
        "北京电信",
        "广东移动",
        "广东联通",
        "辽宁移动",
        "辽宁联通"
      ]
    })
  },
  //下拉选择项目中的取消按钮功能
  actionSheetChange: function (e) {
    var that = this;
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    })
  },

  //根据选择项目组刷新页面数据
  refreshPageData: function (projectName) {
    console.log(projectName);
  },

  //扫描二维码或条形码
  scan: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        that.dealScanResult(res.result);
      },
      fail: function (res) {
        that.setData({
          modalHidden: false,
          scanResult: '扫码失败'
        })
      },
      complete: function (res) { },
    })
  },
  //确认扫码结果
  confirm: function () {
    var that = this;
    that.setData({
      modalHidden: true
    });
  },
  cancelScan: function () {
    var that = this;
    that.setData({
      modalHidden: true
    })
  },

  dealScanResult: function (result) {
    var that = this;
    if (that.judgeSerialNumberExist(result)) {
      that.setData({
        modalHidden: true
      });
      wx.navigateTo({
        url: '/pages/equipment/server?serial_number=' + result,
      })
    } else {
      that.setData({
        modalHidden: false,
        scanResult: "设备序列号：" + result + "不存在，请联系发货管理员进行添加",
        serialNumber: result
      })
    }
  },
  //判断扫描到设备序列号是否存在
  judgeSerialNumberExist: function (result) {
    return true;
  }

})
