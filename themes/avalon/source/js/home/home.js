removeHeaderShadow("#page-header")
$(function () {
    let maxWidth = 980
    if (window.matchMedia(`(max-width: ${maxWidth}px)`).matches) {
        $("#page-header").removeClass("home-page-header").addClass("page-header header-shadow")
    } else {
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
    }
    
})
