$(function(){
    var server = {
        updateDistrict: 'user/updateDistrict', //修改商圈信息
        deleteDistrictAll : 'user/deleteDistrictAll' //解散商圈
    }

    // $('.back').on('click', function(){
    //     history.go(-1);
    // })

    var info = JSON.parse(localStorage.getItem('myDistrict'));
    console.log(info)
    $('#img').attr('src', info.bdPic);
    $('.upload').find('p').text(info.shopName);
    $('.right').val(info.shopName);
    if(!info.bdRemark){
        $('textarea').val('暂无')
    } else {
        $('textarea').val(info.bdRemark);
    }

    $('.edit').on('click', function(){
        var id = info.id;
        var bdName = $('.right').val();
        var bdPic = $('#img').attr('src');
        var bdRemark = $('textarea').val();
        var params = {
            id: id,
            bdName: bdName,
            bdPic: bdPic,
            bdRemark: bdRemark
        }
        reqAjaxAsync(server.updateDistrict, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                history.go(-2);
            }
        })
    })

    $('.btn').on('click', function(){
        var id = info.id;
        var params = {
            id: id
        }
        reqAjaxAsync(server.deleteDistrictAll, JSON.stringify(params)).done(function(res){
            console.log(res)
            if(res.code == 1){
                history.go(-2);
            }
        })
    })
})
    $('.img').click(function () {
        try {
            // 判断为android
            if (navigator.userAgent.match(/android/i)) {
                window.android.shareToPlatform('upload');
            } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
                window.webkit.messageHandlers.shareToPlatform.postMessage({ "upload": 'upload' });
            }
        } catch (e) {
            console.log(e);
        }
    })
    function getImgUrl(url){
        $("#img").attr('src',url) 
    }

//上传图片
uploadOss({
    btn: "img",
    flag: "img",
    size: "5mb"
},"img");

