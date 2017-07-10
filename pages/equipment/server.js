// server.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serialNumber: '',
    ipAddr: '',
    attrList: [],
    modalHidden: true,
    statusList: [],
    idcList: [],
    rackList: [],
    envList: [],
    envnamelist: [],
    envNameList: [],
    roleList: [],
    modalTitle: '',
    curServerItem: {},
    text: '',
    h: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var serialNumber = options.serial_number || '';
    var serverItem = this.getServerInfo(serialNumber);

    var attrList = this.refreshAttrList(serverItem);
    var envNameList = this.refreshAttrList2(serverItem);
    var statusList = [{
      id: 301,
      name: '在用'
    }, {
      id: 302,
      name: '待用'
    }, {
      id: 303,
      name: '下线'
    }];
    statusList.map(function (d) {
      d.checked = serverItem.status === d.name ? true : false;
    })

    var idcList = [{
      id: 101,
      name: '芳村机房'
    }, {
      id: 102,
      name: '三水机房'
    }];
    idcList.map(function (d) {
      d.checked = serverItem.idcName === d.name ? true : false;
    })

    var rackList = [{
      id: 201,
      name: '1号机架'
    }, {
      id: 202,
      name: '2号机架'
    }];
    rackList.map(function (d) {
      d.checked = serverItem.rack === d.name ? true : false;
    })

    var envList = [{
      id: 0,
      name: '省网'
    }, {
      id: 1,
      name: 'IDC'
    }, {
      id: 2,
      name: '缓存出口'
    }];
    envList.map(function (d) {
      d.checked2 = 0;
      if (serverItem.envNameList.length != 0) {
        for (var i = 0, len = serverItem.envNameList.length; i < len; i++) {
          if (d.id === Number(serverItem.envNameList[i])) {
            d.checked2 = d.checked2 + 1;
          }
        }
      }

      if (d.checked2 == 1) {
        d.checked = true;
      } else {
        d.checked = false;
      }

    })
    that.data.h = 0;

    var roleList = [{
      id: 401,
      name: '采集服务器'
    }, {
      id: 402,
      name: 'NameNode'
    }, {
      id: 403,
      name: 'DataNode'
    }];
    roleList.map(function (d) {
      d.checked = serverItem.role === d.name ? true : false;
    })
    this.setData({
      serialNumber: serialNumber,
      ipAddr: serverItem.ipAddr,
      attrList: attrList,
      envNameList: envNameList,
      statusList: statusList,
      idcList: idcList,
      rackList: rackList,
      envList: envList,
      roleList: roleList,
      curServerItem: serverItem
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },
  /**
   * 根据服务器序列号获取服务器信息
   */
  getServerInfo: function (serialNumber) {
    return wx.getStorageSync("serverInfo") || {};
  },

  refreshAttrList: function (serverItem) {
    var attrList = [{
      key: '机房',
      logo: '/img/idc.png',
      index: 'idcName',
      List: 'idcList'
    }, {
      key: '机架',
      logo: '/img/rack.png',
      index: 'rack',
      List: 'rackList'
    }, {
      key: '部署链路',
      logo: '/img/signal.png',
      index: 'envName',
      List: 'envList'
    }, {
      key: '设备状态',
      logo: '/img/status.png',
      index: 'status',
      List: 'statusList'
    }, {
      key: '服务器角色',
      logo: '/img/role.png',
      index: 'role',
      List: 'roleList'
    }];
    attrList.map(function (d) {
      d.value = serverItem[d.index];
    });
    return attrList;
  },

  refreshAttrList2: function (serverItem) {
    var envNameList = [{
      key: 'env列表',
      index: 'envNameList'
    }];
    envNameList.map(function (d) {
      d.value = serverItem[d.index];
    })
    return envNameList;
  },

  clickToEdit: function (e) {
    var c = [];
    c = e.currentTarget.dataset.item.List;
    if (c === 'envList') {
      this.setData({
        modalTitle: '选择' + e.currentTarget.dataset.item.key,
        modalHidden: false,
        radioHidden: true,
        checkboxHidden: false,
        modalList: this.data[c]
      })
    } else {
      this.setData({
        modalTitle: '选择' + e.currentTarget.dataset.item.key,
        modalHidden: false,
        radioHidden: false,
        checkboxHidden: true,
        modalList: this.data[c]
      })
    }

  },

  confirm: function () {
    //demo中只能设置服务器状态字段
    var that = this;
    that.data.statusList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.status = d.name;
      }
    });
    that.data.idcList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.idcName = d.name;
      }
    });
    that.data.rackList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.rack = d.name;
      }
    });
    if (that.data.h == 1) {
      that.data.envList.forEach(function (d) {
        if (d.checkedNum == 1) {
          d.checked = true;
        } else {
          d.checked = false;
        }
        
      });
      that.data.curServerItem.envName = that.data.text;
      that.data.curServerItem.envNameList = that.data.envnamelist;
    } else {
      that.data.envList.map(function (d) {
        d.checked2 = 0;
        if (that.data.curServerItem.envNameList.length != 0) {
          for (var i = 0, len = that.data.curServerItem.envNameList.length; i < len; i++) {
            if (d.id === Number(that.data.curServerItem.envNameList[i])) {
              d.checked2 = d.checked2 + 1;
            }
          }
        }

        if (d.checked2 == 1) {
          d.checked = true;
        } else {
          d.checked = false;
        }

      })
      //console.log(that.data.curServerItem.envName);
      that.data.curServerItem.envName = that.data.curServerItem.envName;
      that.data.curServerItem.envNameList = that.data.curServerItem.envNameList;

    }


    that.data.roleList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.role = d.name;
      }
    });
    wx.setStorageSync("serverInfo", that.data.curServerItem);
    var attrList = that.refreshAttrList(that.data.curServerItem);
    var envNameList = that.refreshAttrList2(that.data.curServerItem);
    that.setData({
      modalHidden: true,
      attrList: attrList,
      envNameList: envNameList
    });
  },
  /**
   * 模态框取消按钮操作
   */
  cancel: function () {
    this.setData({
      modalHidden: true
    })
  },
  /**
   * 单选框选择操作
   */
  radioChange: function (e) {
    var that = this;
    if ((e.detail.value > 300) && (e.detail.value < 400)) {
      that.data.statusList.map(function (d) {
        d.checked = e.detail.value == d.id ? true : false;
      })
    }

    if ((e.detail.value > 100) && (e.detail.value < 200)) {
      that.data.idcList.map(function (d) {
        d.checked = e.detail.value == d.id ? true : false;
      })
    }

    if ((e.detail.value > 200) && (e.detail.value < 300)) {
      that.data.rackList.map(function (d) {
        d.checked = e.detail.value == d.id ? true : false;
      })
    }

    if ((e.detail.value >= 0) && (e.detail.value < 100)) {
      that.data.envList.map(function (d) {
        d.checked = e.detail.value == d.id ? true : false;
      })
    }

    if ((e.detail.value > 400) && (e.detail.value < 500)) {
      that.data.roleList.map(function (d) {
        d.checked = e.detail.value == d.id ? true : false;

      })
    }
  },
  /**
   * 多选框选择操作
   */
  checkboxgroupBindchange: function (e) {
    var that = this;
    var temp1 = e.detail.value
    var temp2 = ''
    that.data.envList.map(function (d) {
      d.checkedNum = 0;
      if (e.detail.value.length != 0) {
        that.data.h = 1;
        for (i = 0; i < e.detail.value.length; i++) {
          if (d.id == e.detail.value[i]) {
            d.checkedNum = d.checkedNum + 1;
          }
        }
      } else {
        d.checkedNum = 0;
      }

    })

    if (temp1.length != 0) {
      if (temp1.length < 3) {
        for (var i = 0, len = temp1.length; i < len; i++) {
          temp2 = temp2 + this.data.envList[temp1[i]].name + '  '
        }
        this.setData({
          text: temp2,
          envnamelist: e.detail.value
        })
      } else {
        temp2 = temp2 + this.data.envList[temp1[0]].name + '  ' + this.data.envList[temp1[1]].name + '等';
        this.setData({
          text: temp2,
          envnamelist: e.detail.value
        })
      }
    } else {
      this.setData({
        text: '',
        envnamelist: e.detail.value
      })
      
    }
  }

})

