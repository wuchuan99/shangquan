$(function(){
    var server = {
        sendDistrictApply: 'user/sendDistrictApply'// 加入商圈
    }
    // $('.back').on('click', function(){
    //     history.go(-1);
    // })

    $('.submit').on('click', function(){
        var params = JSON.parse(localStorage.getItem('sendDistrictApply'));
        var content = $('textarea').val();
        params.content = content;
        reqAjaxAsync(server.sendDistrictApply, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                mui.toast('申请成功');
                setTimeout(function(){
                    history.go(-2);
                }, 1000)
            }
        })
    })
})