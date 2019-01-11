$(function(){
    var server = {
        findShopAndDistrict: 'user/findShopAndDistrict' //查询商户下的商圈和店铺
    }
    var bdId = GetQueryString('bdId');
    var merchantId = localStorage.getItem('merchantId');

    //初始化滑动控件
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005
    });

    getShopAndDistrict();
    
    function getShopAndDistrict(){
        var params = {
            merchantId: merchantId,
            bdId: bdId
        }
        reqAjaxAsync(server.findShopAndDistrict, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                if($('#shop').hasClass('active')){
                    if(res.data.length == 0){
                        console.log(10)
                        $('.zw_shop').show();
                        $('.zw_business').hide();
                        $('body').css('backgroundColor', '#fff');
                        $('.mui-content').css('backgroundColor', '#fff');
                    } else {
                        var html = template('temp', res);
                        $('.list').html(html);
                        $('.zw_shop').hide();
                        $('.zw_business').hide();
                        $('body').css('backgroundColor', '#F0EEEE');
                        $('.mui-content').css('backgroundColor', '#F0EEEE');
                        $('.left').css('border-radius', '50%');
                    } 
                } else {
                    if(res.dataExpansion.length == 0){
                        $('.zw_shop').hide();
                        $('.zw_business').show();
                        $('body').css('backgroundColor', '#fff');
                        $('.mui-content').css('backgroundColor', '#fff');
                    } else {
                        var html = template('tem', res);
                        $('.list').html(html);
                        $('.zw_shop').hide();
                        $('.zw_business').hide();
                        $('body').css('backgroundColor', '#F0EEEE');
                        $('.mui-content').css('backgroundColor', '#F0EEEE');
                    }
                }
            }
        })
    }
    
    //返回上一页
    $('.back').on('click', function(){
        history.go(-1);
    })

    //tab栏切换
    $('#shop').on('click', function(){
        $(this).addClass('active').siblings().removeClass('active');
        num = 0;
        $('.footer').find('i').text(num);
        $('.btn').attr('data-type', 1)
        $('.list').html('');
        mui('.mui-scroll-wrapper').scroll().scrollTo(0,0,100);
        getShopAndDistrict();
    })
    $('#business').on('click', function(){
        $(this).addClass('active').siblings().removeClass('active');
        num = 0;
        $('.footer').find('i').text(num);
        $('.btn').attr('data-type', 2)
        $('.list').html('');
        mui('.mui-scroll-wrapper').scroll().scrollTo(0,0,100);
        $('.left').css('border-radius', 0);
        getShopAndDistrict();
    })

    //添加
    var num = 0
    mui(".mui-table-view").on('tap','.mui-table-view-cell',function(){
        console.log($(this).attr('data-checked'));
        if($(this).attr('data-checked') == 0){
            num++;
            $(this).children('img').eq(0).show();
            $(this).children('img').eq(1).hide();
            $(this).attr('data-checked', 1);
            $('.footer').find('i').text(num);
        } else {
            num--;
            $(this).children('img').eq(0).hide();
            $(this).children('img').eq(1).show();
            $(this).attr('data-checked', 0);
            $('.footer').find('i').text(num);
        }
    })

    //提交
    $('.btn').on('click', function(){
        var list = [];
        var type = $(this).attr('data-type');
        $('.selected').each(function(index, item){
            if($(item).css('display') != 'none'){
                var obj = {};
                var id = $(item).parent().attr('data-id');
                var applyName = $(item).parent().children('.right').text();
                obj.applyTypeId = id;
                obj.applyName = applyName;
                list.push(obj);
            }
        })
        console.log(list);
        if(list.length == 0){
            mui.toast('请选择商圈或店铺');
            return
        }
        var params = {
            bdId: bdId,
            applyMerchantId: merchantId,
            applyStatus: 0,
            type: type,
            detailList: list
        }
        console.log(params);
        localStorage.setItem('sendDistrictApply', JSON.stringify(params));
        location.href = '../business/application_verification.html';
    })

    // mui.init({
    //     pullRefresh : {
    //         container: '#pullRefresh',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
    //         up : {
    //             height:50,//可选.默认50.触发上拉加载拖动距离
    //             auto:true,//可选,默认false.自动上拉加载一次
    //             contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
    //             contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
    //             callback : gt //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
    //         },
    //         down : {
    //             height:50,//可选,默认50.触发下拉刷新拖动距离,
    //             // auto: true,//可选,默认false.首次加载自动下拉刷新一次
    //             contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
    //             contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
    //             contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
    //             callback : fn //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
    //         }
    //     }
    // });

    // mui('#pullRefresh').pullRefresh().disablePullupToRefresh();
})