getRem(750,100)
window.onresize = function(){
    getRem(750,100)
};
function getRem(pwidth,prem){
    var html = document.getElementsByTagName("html")[0];
    var oWidth = document.body.clientWidth || document.documentElement.clientWidth;
    console.log(oWidth)
    html.style.fontSize = oWidth/pwidth*prem + "px";
}