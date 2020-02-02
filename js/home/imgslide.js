$(function (){
    $("#img-content").css({"height": globalData.height*0.80})
    var datas = []
    var fields = JSON.parse($('#field-source')[0].dataset.fields)
    fields.forEach(ele =>{
        datas.push({src: ele})
    })
    $("#img-slide").vegas({
        slides: datas,
        preload: true,
        timer: false,
        overlay: false,
        delay: 6000,
        transition: 'blur',
        animation: 'cutomkenburnsDown',
        animationRegister: ['vegas-animation-cutomkenburnsDown']
    })
    var s = skrollr.init();
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    var ele = $('.vegas-container')[0]
    function changeText() {
        var box = $('.vegas-slide-inner')
        var len = box.length
        var list = box[len - 1].style.backgroundImage.split('/')
        var ele = list[list.length - 1].match(/(.*)\.\w*/)[1]
        $('#img-text-bottom').text(ele)
    }
    var _debounceFn = debounce(changeText)
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function (mutation) {
            switch(mutation.type) {
              case 'attributes':
                _debounceFn()
                break;
            }
        })
    })
    observer.observe(ele, {
        attributes: true,
        subtree: true,
        characterData: true,
    });
})