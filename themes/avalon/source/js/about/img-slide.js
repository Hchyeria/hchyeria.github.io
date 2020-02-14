$(function (){
    $("#img-content").css({"height": globalData.height*0.80})
    var datas = []
    var fields = JSON.parse($('#field-source')[0].dataset.fields)
    var size = +$('#field-source')[0].dataset.size
    for (var i = 0; i < size; i++) {
        var indexTemp = Math.floor(Math.random() * (fields.length - i) + i)
        var temp = fields[indexTemp]
        fields[indexTemp] = fields[i]
        fields[i] = temp
        fields = fields.slice(0, size)
    }
    
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
    $('#field-source').remove()
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