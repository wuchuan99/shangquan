$(function(){
    var server = {
        selectBdApplyList: 'user/selectBdApplyList', //商圈消息列表
        selectMessage: 'user/select/message', //普通用户消息
        updateMessage: 'user/update/message', //修改消息状态
        countMessage: 'user/count/message' //查询消息数量
    }
    var allNum = 0;
    var untreatedNum = 0;
    var agreedNum = 0;
    var refusedNum = 0;
    var otherNum = 0;
    //初始化滑动控件
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 
    });

    $('.list').on('click', 'li', function(){
        var statu = $('.state').attr('data-statu');
        var stateApplication = $('.stateApplication').attr('data-statu');
        if(stateApplication == 'received') {
            if(statu != 'other') {
                var param = JSON.parse($(this).attr('data-param'));
                param.statu = 'received';
                localStorage.setItem('message', JSON.stringify(param));
                location.href = "../business/business_application.html";
            } else {
                var param = JSON.parse($(this).attr('data-param'));
                var userName = param.userName;
                var phone = param.phone;
                var message = param.message;
                $('#name').text(userName);
                $('#phone').text(phone);
                $('.info').text(message);
                if(param.messageStatus == 1){
                    var params = {
                        id: param.id,
                        messageStatus: 2
                    }
                    reqAjaxAsync(server.updateMessage, JSON.stringify(params)).done(function(res){
                        console.log(res)
                        if(res.code == 1){
                            getMessage('other');
                        }
                    })
                }
                mui("#popover").popover('toggle');
            }  
        } else if(stateApplication == 'issued') {
            var param = {};
            param.statu = 'issued'
            localStorage.setItem('message', JSON.stringify(param));
            location.href = "../business/business_application.html";
        }
    })

    var info = JSON.parse(localStorage.getItem('myDistrict'));
    console.log(info);
    getMessage('all');
    getNum();

    //获取消息数量
    function getNum(){
         //全部消息数量
        var params = {
            bdId: info.id,
            applyStatus: ''
        }
        reqAjaxAsync(server.selectBdApplyList, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                if(res.data.length < 100){
                    allNum = res.data.length;
                    $('.all').text(allNum);
                } else {
                    $('.all').text('99+');
                }
            }
        })

        //未处理消息数量
        var params = {
            bdId: info.id,
            applyStatus: 0
        }
        reqAjaxAsync(server.selectBdApplyList, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                if(res.data.length < 100){
                    untreatedNum = res.data.length;
                    $('.untreated').text(untreatedNum);
                } else {
                    $('.untreated').text('99+');
                } 
            }
        })

        //已同意消息数量
        var params = {
            bdId: info.id,
            applyStatus: 1
        }
        reqAjaxAsync(server.selectBdApplyList, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                if(res.data.length < 100){
                    agreedNum = res.data.length;
                    $('.agreed').text(agreedNum);
                }  else {
                    $('.agreed').text('99+'); 
                }
            }
        })

        //已拒绝消息数量
        var params = {
            bdId: info.id,
            applyStatus: 2
        }
        reqAjaxAsync(server.selectBdApplyList, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                if(res.data.length < 100){
                    refusedNum = res.data.length;
                    $('.refused').text(refusedNum);
                } else {
                    $('.refused').text('99+');
                }   
            }
        })

        //其他消息
        var params = {
            bdId: info.id
        }
        reqAjaxAsync(server.selectMessage, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                res.data = res.data || [];
                if(res.data.length < 100){
                    otherNum = res.data.length;
                    $('.other').text(otherNum);
                } else {
                    $('.other').text('99+');
                }  
            }
        })
    }
    
    //申请切换
    $('.applicationCategory').on('click', 'a', function(){
        $(this).addClass('applicationActive').siblings().removeClass('applicationActive');
        var status = $(this).attr('data-statu');
        $('.stateApplication').attr('data-statu', status);
        if(status == 'received') {
            $('.tab').show();
            $('.content').css('padding-top', '1.75rem');
            $('.zw').hide().css('top', '2.1rem');
            $('.tab a:first').addClass('active').siblings().removeClass('active');
            mui('.mui-scroll-wrapper').scroll().scrollTo(0,0,10);
            $('.mui-scrollbar').css('opacity', 0);
            getMessage('all');
        } else if(status == 'issued') {
            $('.tab').hide();
            $('.content').css('padding-top', '0.66rem');
            $('.zw').show().css('top', '1.1rem');
            mui('.mui-scroll-wrapper').scroll().scrollTo(0,0,10);
            $('.mui-scrollbar').css('opacity', 0);
            var params = {};
            var html = template('applicationIssued', params);
            $('.list').html(html);
        }
    })

    //tab栏切换
    $('.tab').on('click', 'a', function(){
        $(this).addClass('active').siblings().removeClass('active');
        mui('.mui-scroll-wrapper').scroll().scrollTo(0,0,10);
        $('.mui-scrollbar').css('opacity', 0);
        var status = $(this).attr('data-statu');
        $('.state').attr('data-statu', status);
        if(status == 'all'){
            getMessage('all');
        } else if(status == 'untreated'){
            getMessage('untreated');
        } else if(status == 'agreed'){
            getMessage('agreed');
        } else if(status == 'refused'){
            getMessage('refused');
        } else if(status == 'other'){
            getMessage('other');
        }
    })

    //清空
    $('.empty').on('click', function(){
        var status = $(this).attr('data-statu');
        if(status == 'all'){
            console.log('all')
        } else if(status == 'untreated'){
            console.log('untreated')
        } else if(status == 'agreed'){
            console.log('agreed')
        } else if(status == 'refused'){
            console.log('refused')
        }
    })

    //公用获取数据
    function getMessage(type){
        var params = {
            bdId: info.id
        };
        if(type == 'other') {
            reqAjaxAsync(server.selectMessage, JSON.stringify(params)).done(function(res){
                console.log(res)
                if(res.code == 1){
                    res.data = res.data || [];
                    if(res.data.length == 0){
                        $('.zw').show();
                        $('body').css('backgroundColor', '#fff');
                        var html = template('tem', res);
                        console.log(html)
                        $('.list').html(html);
                    } else {
                        $('.zw').hide();
                        $('body').css('backgroundColor', '#F0EEEE');
                        convert(res.data);
                        res.data.reverse();
                        var html = template('tem', res)
                        $('.list').html(html);
                    }  
                }
            })
            return;
        }
        if(type == 'all'){
            params.applyStatus = '';   
        } else if(type == 'untreated'){
            params.applyStatus = 0; 
        } else if(type == 'agreed'){
            params.applyStatus = 1;
        } else if(type == 'refused'){
            params.applyStatus = 2;
        }
        reqAjaxAsync(server.selectBdApplyList, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                if(res.data.length == 0){
                    var html = template('temp', res)
                    $('.list').html(html);
                    $('.zw').show();
                    $('body').css('backgroundColor', '#fff');    
                } else {
                    $('.zw').hide();
                    $('body').css('backgroundColor', '#F0EEEE');
                    convert(res.data);
                    res.data.reverse();
                    var html = template('temp', res)
                    $('.list').html(html);
                } 
            }
        })
    }

    //判断是否当天
    function convert(info){
        $(info).each(function(i, val){
            var currenTtime = new Date();
            var currenDate = currenTtime.getFullYear() + "-" + (currenTtime.getMonth()+1) + "-" + currenTtime.getDate();
            var createDate = val.createTime.split(' ')[0];
            var createTime = val.createTime.split(' ')[1];
            if(createDate == currenDate){
                val.time = createTime;
            } else {
                val.time = createDate;
            }
        })
    }
})
