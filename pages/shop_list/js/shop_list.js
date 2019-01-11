$(function() {
  var server = {
    districtShopList: "user/districtShopList", //获取店铺列表
    updateDistrictDetail: "user/updateDistrictDetail", //设为圈委会
    deleteDistrictDetailShop: "user/deleteDistrictDetailShop", //删除店铺
    countMessage: 'user/count/message', //普通店铺消息列表
    selectBdApplyList: 'user/selectBdApplyList', //商圈消息列表
  };

  //初始化滑动控件
  mui(".mui-scroll-wrapper").scroll({
    deceleration: 0.0005
  });

  // $('.back').on('click', function(){
  //   location.href = `../business/business_circle.html?merchantId=${merchantId}&userId=${userId}`
  // })

  var info = JSON.parse(localStorage.getItem("myDistrict"));
  if (info.isLeader == 3) {
    $(".editBusiness").show();
    $(".message").show();
  } else if(info.isLeader == 2) {
    $(".editBusiness").hide();
    $(".message").show();
  } else {
    $(".editBusiness").hide();
    $(".message").hide();
  }
  $(".header").text(info.shopName);


  var params1 = {
    bdId: info.id
  }

  var params2 = {
    bdId: info.id,
    applyStatus: 0
  }

  Promise.all([
    reqAjaxAsync(server.countMessage, JSON.stringify(params1)),
    reqAjaxAsync(server.selectBdApplyList, JSON.stringify(params2))
  ]).then(function(res){
    console.log(res)
    if(res[0].dataExpansion > 0 || res[1].data.length > 0) {
      $('.message').find('span').show();
    }
  })

  mui.init({
    pullRefresh : {
      container: '#pullrefresh',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
      up : {
        height:50,//可选.默认50.触发上拉加载拖动距离
        auto:true,//可选,默认false.自动上拉加载一次
        contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
        contentnomore:'没有更多店铺了',//可选，请求完毕若没有更多数据时显示的提醒内容；
        callback: getShop //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      }
    }
  });

  var page = 1;
  var rows = 10;
  //获取店铺列表
  function getShop() {
    var params = {
      id: info.id,
      page: page,
      rows: rows
    };
    reqAjaxAsync(server.districtShopList, JSON.stringify(params)).done(function(res) {
      console.log(res);
      if (res.code == 1) {
        res.isLeader = info.isLeader;
        res.merchantId = info.merchantId;
        for (var i = 0; i < res.data.length; i++) {
          for (var j = 0; j < res.dataExpansion.length; j++) {
            if (res.data[i].id == res.dataExpansion[j].shopId) {
              res.dataExpansion[j].logoUrl = res.data[i].logoUrl;
              res.dataExpansion[j].phoneService = res.data[i].phoneService;
              res.dataExpansion[j].shopName = res.data[i].shopName;
              res.dataExpansion[j].detailedAddress = res.data[i].detailedAddress;
            }
          }
        }
        res.newData = [];
        var arr1 = [];
        var arr2 = [];
        var arr3 = [];
        var arr4 = [];
        for (var n = 0; n < 3; n++) {
          for (var m = 0; m < res.dataExpansion.length; m++) {
            if (n == 0 && res.dataExpansion[m].isLeader == 3) {
              res.newData.push(res.dataExpansion[m]);
            } else if (n == 1 && res.dataExpansion[m].isLeader == 2) {
              if(res.dataExpansion[m].merchantId == info.merchantId) {
                arr3.push(res.dataExpansion[m]);
              } else {
                arr4.push(res.dataExpansion[m]);
              }
            } else if (n == 2 && res.dataExpansion[m].isLeader == 0) {
              if(res.dataExpansion[m].merchantId == info.merchantId) {
                arr1.push(res.dataExpansion[m]);
              } else {
                arr2.push(res.dataExpansion[m]);
              }
            }
          }
        }

        //管理员排序
        for(var q = 0; q < arr3.length; q++){
          res.newData.push(arr3[q]);
        }
        for(var w = 0; w < arr4.length; w++){
          res.newData.push(arr4[w]);
        }

        //普通成员排序
        for(var k = 0; k < arr1.length; k++){
          res.newData.push(arr1[k]);
        }
        for(var p = 0; p < arr2.length; p++){
          res.newData.push(arr2[p]);
        }
        
        var html = template("temp", res);
        $(".list").html(html);
      }
    });
  }

  //设为圈委会
  $(".list").on("click", ".edit", function() {
    mui.confirm("确定要设为圈委会吗?", res => {
        var li = $(this).parent().parent();
        if (res.index) {
            var id = li.attr("data-id");
            var params = {
              id: id,
              isLeader: 2
            };
            console.log(params)
            reqAjaxAsync(server.updateDistrictDetail, JSON.stringify(params)).done(function(res) {
                console.log(res);
                if (res.code == 1) {
                    getShop();
                }
            });
        }
        mui.swipeoutClose(li[0]);
    });
  });

  //移出圈委会
  $('.list').on('click', '.editOut', function(){
    mui.confirm("确定要移出圈委会吗?", res => {
        var li = $(this).parent().parent();
        if(res.index){
            var id = li.attr("data-id");
            var params = {
              id: id,
              isLeader: 0
            };
            reqAjaxAsync(server.updateDistrictDetail, JSON.stringify(params)).done(
              function(res) {
                console.log(res);
                if (res.code == 1) {
                  getShop();
                }
              }
            )
        }
        mui.swipeoutClose(li[0]);
    })
  })

  //移除店铺
  $(".list").on("click", ".delete", function() {
    mui.confirm("确定移除吗?", res => {
        var li = $(this).parent().parent();
        if (res.index) {
          var id = li.attr("data-id");
          var params = {
              id: id
          };
          reqAjaxAsync(server.deleteDistrictDetailShop, JSON.stringify(params)).done(function(res) {
              console.log(res);
              if (res.code == 1) {
                  li.remove();
                  getShop();
              }
          });
        }
        mui.swipeoutClose(li[0]);
    });
  });

  //退出商圈
  $(".list").on("click", ".del", function() {
    mui.confirm("确定退出吗?", res => {
      var li = $(this).parent().parent();
      if (res.index) {
        var id = li.attr("data-id");
        var params = {
            id: id
        };
        reqAjaxAsync(server.deleteDistrictDetailShop, JSON.stringify(params)).done(function(res) {
            console.log(res);
            if (res.code == 1) {
              history.go(-1);
            }
        });
      }
      mui.swipeoutClose(li[0]);
    });
  });

  $(".editBusiness").on("click", function() {
    location.href = "../business/business_circle_edit.html";
  });

});
