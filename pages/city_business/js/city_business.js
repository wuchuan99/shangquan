$(function(){
    document.body.addEventListener('touchmove', function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
    }, {passive: false}); //passive 参数不能省略，用来兼容ios和android
    //接口
    var server = {
        selectDistrictByCity: 'user/selectDistrictByCity', //查询商户同城商圈
        cityDistrictByC: 'user/cityDistrictByC', //查询普通用户商圈
        insertMessage: 'user/insert/message' //发送消息
    }
    var merchantId = localStorage.getItem('merchantId') || '';
    var userId = localStorage.getItem('userId') || '';
    //初始化滑动控件
    mui('.mui-scroll-wrapper').scroll({
        dseceleration: 0.0005 
    });
    
    // $('.back').on('click', function(){
    //    location.href = `../business/business_circle.html?merchantId=${merchantId}&userId=${userId}`;
    // })

    if(merchantId) {
        var params = {
            userId: merchantId
        }
        reqAjaxAsync(server.selectDistrictByCity, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                if(res.data.length == 0){
                    $('.zw').show();
                    $('body').css('backgroundColor', '#fff');
                } else {
                    var html = template('temp', res);
                    $('.list').html(html);
                    $('.zw').hide();
                    $('body').css('backgroundColor', '##F0EEEE');
                }   
            }
        })  
    } else {
        var params = {
            userId: userId
        }
        reqAjaxAsync(server.cityDistrictByC, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                if(res.data.length == 0){
                    $('.zw').show();
                    $('body').css('backgroundColor', '#fff');
                } else {
                    var html = template('temp', res);
                    $('.list').html(html);
                    $('.zw').hide();
                    $('body').css('backgroundColor', '##F0EEEE');
                }
            }
        }) 
    }

    $('.list').on('click', '.btn', function(){
        var id = $(this).parent().attr('data-id');
        if(merchantId){
            location.href = `../business/choos_business.html?bdId=${id}`;
        } else {
            $('#name').val('');
            $('#phone').val('');
            $('#message').val('');
            $('#confirm').attr('data-id', id);
            mui("#popover").popover('toggle'); 
        }
    })

    $('#cancel').on('click', function(){
        //关闭弹出层
        $("#popover").removeClass("mui-active");
        $("#popover").hide();
        $(".mui-backdrop.mui-active").hide();
    })

    $('#confirm').on('click', function(){
        var userName = $('#name').val();
        var phone = $('#phone').val();
        var message = $('#message').val();
        var bdId = $('#confirm').attr('data-id');
        const mobileRule = /(?:^1[3456789]|^9[28])\d{9}$/;
        console.log(bdId, phone,message); 
        if(!$.trim(userName)){
            mui.toast('请输入昵称');
            return;
        }
        if(!mobileRule.test(phone)){
            mui.toast('请输入正确的手机号');
            return;
        }
        if(!$.trim(message)){
            mui.toast('请输入申请信息');
            return;
        }
        var params = {
            userId: userId,
            bdId: bdId,
            userName: userName,
            phone: phone,
            message: message
        }
        reqAjaxAsync(server.insertMessage, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                mui.toast('发送成功');
            }
        })
        //关闭弹出层
        $("#popover").removeClass("mui-active");
        $("#popover").hide();
        $(".mui-backdrop.mui-active").hide();
    })
})