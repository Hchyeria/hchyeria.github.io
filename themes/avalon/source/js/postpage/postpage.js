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

    var sendComment = function() {
        var content = $('#comment-data').val().trim()
        var name = $('#user-name').val().trim()
        if (!name || !content) {
            return;
        }
        var contact = $('#user-contact').val().trim()
        var time = String.prototype.split.call(new Date(), ' ').slice(1, 5).join(' ')
        var item = `<div class="comment-item">
                        <img src="/img/default-avatar.png" class="">
                        <div class="comment-data">
                            <div class="comment-title">
                                <span class="comment-user-name">${name}</span>
                                <span class="comment-user-date comment-text">${time}</span>
                            </div>
                            <div class="comment-content">${content}</div>
                        </div>
                    </div>`
        $('#comment-block').append($(item))
    }

    $("#send-comment").on('click', debounce(sendComment))
});