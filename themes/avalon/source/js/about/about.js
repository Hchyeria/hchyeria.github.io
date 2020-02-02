removeHeaderShadow("#page-header")

$(function (){
    function headerShadowControl(){
        if(document.documentElement.scrollTop - (globalData.height*0.80) > 0){
            $("#page-header").addClass("header-shadow")
        }
        else{
            $("#page-header").removeClass("header-shadow")
        }
    }
    window.addEventListener("scroll" , throttle(headerShadowControl), false) 
});
