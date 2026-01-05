removeHeaderShadow("#page-header")

$(function (){
    $("#page-header").removeClass("header-shadow")
    $("#title-data").css({top: -($("#title-data").height()-2) + 'px'});
    $(".article-date").css({'margin-top': -$("#title-data").height()+5 + 'px'});
    var handleShadow = function() {
        if(document.documentElement.scrollTop >= 500){
              $("#page-header").addClass("header-shadow") 
        } else {
              $("#page-header").removeClass("header-shadow")
        }
    }

    window.addEventListener("scroll" , throttle(handleShadow), false)

});