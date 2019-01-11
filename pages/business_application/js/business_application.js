$(function(){
    var server = {
        agreeDistrict: 'user/agreeDistrict', //同意
        refuseDistrict: 'user/refuseDistrict' //拒绝
    }
    $('.back').on('click', function(){
        history.go(-1);
    })

    var info = JSON.parse(localStorage.getItem('message'));
    console.log(info);
    if(info.statu == 'received') {
        $('.issued').hide();
        if(info.type == 2){
            $('.left').children().attr('src', info.bdPic);
            $('.right').find('h4').text(info.applyName + (info.applyCount == 1 ? '' : '等') + '的入圈申请');
            $('.bottom').find('.message').text(info.content);
            $('.count').text(info.applyCount);
            $('.business').show();
            $('.shop').hide();
        } else if(info.type == 1){
            $('.left').children().attr('src', info.bdPic);
            $('.left').css('border-radius', '50%');
            $('.shop p').text(info.applyName + (info.applyCount == 1 ? '' : '等') +'的入圈申请');
            $('.bottom').find('.message').text(info.content);
            $('.business').hide();
            $('.shop').show();
        }
    
        if(info.applyStatus == 0){
            $('.received').show();
            $('.msg_agree').hide();
            $('.msg_refuse').hide();
        } else if(info.applyStatus == 1){
            $('.received').hide();
            $('.msg_agree').show();
            $('.msg_refuse').hide();
        } else if(info.applyStatus == 2){
            $('.received').hide();
            $('.msg_agree').hide();
            $('.msg_refuse').show();
        }
    } else if(info.statu == 'issued') {
        $('.received').hide(); 
    }
    
    $('.agree').on('click', function(){
        var params = {
            applyId: info.id
        }
        reqAjaxAsync(server.agreeDistrict, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                mui.toast('操作成功');
                setTimeout(function(){
                    history.go(-1);
                }, 1000)
            }
        })
    })

    $('.refuse').on('click', function(){
        var params = {
            applyId: info.id
        }
        reqAjaxAsync(server.refuseDistrict, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                mui.toast('操作成功');
                setTimeout(function(){
                    history.go(-1);
                }, 1000)
            }
        })
    })
   
})