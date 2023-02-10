removeHeaderShadow("#page-header")
$(function () {
    if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        function headerControl() {
            if (document.documentElement.scrollTop - 60 > 0) {
                $("#page-header").removeClass("home-page-header").addClass("page-header header-shadow")
            }
            else{
                $("#page-header").addClass("home-page-header").removeClass('page-header header-shadow')
            }
        }
        headerControl()
        window.addEventListener("scroll" , throttle(headerControl), false) 
    } else {
        $("#page-header").removeClass("home-page-header").addClass("page-header header-shadow")
    }
})
