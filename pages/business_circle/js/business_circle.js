$(function(){
    var server = {
        myDistrictList: 'user/myDistrictList'
    }

    var merchantId = GetQueryString('merchantId') || '';
    var userId = GetQueryString('userId') || '';
    localStorage.setItem('merchantId', merchantId);
    localStorage.setItem('userId', userId);


    //初始化滑动控件
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005
    });

    if(merchantId) {
        var params = {
            merchantId: merchantId,
            userId: userId
        };
        reqAjaxAsync(server.myDistrictList, JSON.stringify(params)).done(function(res){
            console.log(res);
            if(res.code == 1){
                if(res.data.length == 0){
                    $('.zw').show();
                    $('body').css('backgroundColor', '#fff');
                } else {
                    var html = template('temp', res);
                    $('.list').html(html);
                    $('.zw').hide();
                    $('body').css('backgroundColor', '#F0EEEE');
                }
            }
        })
    } else {
        $('.zw').show();
        $('body').css('backgroundColor', '#fff');
    }

    $('.list').on('click', 'li', function(){
        var shopName = $(this).find('span').eq(0).text();
        var id = $(this).attr('data-id');
        var bdPic = $(this).children('.left').children('img').attr('src');
        var bdRemark = $(this).attr('data-bdRemark');
        var isLeader = $(this).attr('data-isLeader');
        var params = {
            id: id,
            shopName: shopName,
            bdPic: bdPic,
            bdRemark: bdRemark,
            isLeader: isLeader,
            merchantId: merchantId
        }
        localStorage.setItem('myDistrict', JSON.stringify(params));
        location.href = '../business/shop_list.html';
    })      
})