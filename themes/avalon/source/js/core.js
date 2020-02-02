document.addEventListener('DOMContentLoaded',function() {
    $("#loading").addClass('remove')
    $("#id-yer").text(new Date().getFullYear());
    $(".material-icons.toggle-menu").on("click", function(e){
        e.preventDefault();
        var yPosition = e.clientY
        var reHeight = document.body.clientHeight + scrollY
        var turnon = parseInt($(this).attr("aria-hidden"))
        if(turnon){
            $('body').append('<div id="overlay-menu"></div>')
            $("#overlay-menu").css({height: reHeight})
            $("#menu-mobile").appendTo("#content-inner").css({top: yPosition + 10}).removeClass("hidden")
        }
        else{
            $("#overlay-menu").remove()
            $("#menu-mobile").addClass("hidden")
        }
        $(this).attr("aria-hidden",turnon? "0" : "1")
        $(this).text(turnon? "close" : "menu")
    })
    function smoothscroll(){
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop
        if (currentScroll > 0) {
            window.requestAnimationFrame(smoothscroll);
            window.scrollTo(0, currentScroll - (currentScroll/8))
        }
    }
    $("#go-up").on("click",function(e){
        e.preventDefault();
        smoothscroll()
    })

    function upToTop(){
        if(document.documentElement.scrollTop >= 1112){
              $("#go-up").removeClass("hidden").addClass("right-show").removeClass("reserve-right-show")
        }else{
              $("#go-up").removeClass("right-show").addClass("reserve-right-show").addClass("hidden")
        }
    }
    window.addEventListener("scroll" , throttle(upToTop), false) 
    
    $('img').on('error', function(){
        $(this).unbind('error')
        $(this).attr('src', '/img/page-default.jpg')
    })
    $('img').on('load', function(){
        $(this).removeClass('bulr-img')
    })

    $('#menu-bottom-icon').on('change', function(e) {
        if (this.checked) {
            if ($('.menu-bottom').is(':hover') && $(".menu-bottom").height() >= window.innerHeight) {
                $('.menu-bottom').css({'height': '90%', 'overflow-y': 'scroll'})
            }
            $('.menu-bottom').css({'min-width': '44%', 'width': '44%'})
        } else {
            $('.menu-bottom').css({'height': '', 'overflow-y': '', 'min-width': '', 'width': 'fit-content'})
        }
    })

    function imageShowView(ele) {
        addClass(ele, 'img-animation-show')
        setTimeout(() => {
            var res = findChild(ele, 'img')
            res.forEach(img => {
                removeClass(img, 'blur-img')
            })
        }, 1000)
    }

    var lazyImgControl = LazyImage({
        selector: '.lazy-img'
    })
    lazyImgControl.initial()
    showViewControl('.img-animation', imageShowView).initial()
});


