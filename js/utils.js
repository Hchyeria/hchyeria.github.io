var throttle = function(callback) {
    var isRunning = false
    return function foo(e) {
        if (isRunning) return;
        isRunning = true
        window.requestAnimationFrame(function(timestamp) {
            callback(e)
            isRunning = false
        })
    }
}
// based on http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html
var debounce = function(func) {
    var timeout, timestamp
    var wait = 99;
    var run = function(){
        timeout = null
        func && func()
    };
    var later = function() {
        var last = Date.now() - timestamp
        if (last < wait) {
            setTimeout(later, wait - last)
        } else {
            (requestIdleCallback || run)(run)
        }
    };

    return function() {
        timestamp = Date.now()
        if (!timeout) {
            timeout = setTimeout(later, wait)
        } else {
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    };
};

var regClassCache = {};
var _getAttribute = 'getAttribute';
var hasClass = function(ele, cls) {
    if (!regClassCache[cls]) {
        regClassCache[cls] = new RegExp('(\\s|^)'+ cls +'(\\s|$)');
    }
    return regClassCache[cls].test(ele[_getAttribute]('class') || '') && regClassCache[cls];
};

var addClass = function(ele, cls) {
    if (!hasClass(ele, cls)) {
        ele.setAttribute('class', (ele[_getAttribute]('class') || '').trim() + ' ' + cls);
    }
};

var removeClass = function(ele, cls) {
    var reg;
    if ((reg = hasClass(ele, cls))) {
        ele.setAttribute('class', (ele[_getAttribute]('class') || '').replace(reg, ' '));
    }
};

var findChild = function(ele, selector) {
    var res = []
    function foo(ele, selector) {
        if (!ele) {
            return;
        }
        if (ele.matches(selector)) {
            res.push(ele);
        }
        if (ele.children.length > 0) {
            var len = ele.children.length
            for (let i = 0; i < len; ++i) {
                foo(ele.children[i], selector)
            }
        }
    }
    foo(ele, selector)
    return res;
}

var globalData = {}
function getViewport(){
    if (document.compatMode == "BackCompat") {
        globalData.width = document.body.clientWidth,
        globalData.height = document.body.clientHeight　
    } else {　　　
        globalData.width = document.documentElement.clientWidth,
        globalData.height = document.documentElement.clientHeight
    }
}
getViewport();
window.addEventListener('resize', debounce(getViewport), false)

function removeHeaderShadow(header){
    document.addEventListener('DOMContentLoaded',function() {
        removeClass(document.querySelector(header), 'header-shadow')
    })
}

function showViewControl(selector, fn) {
    var elements = document.querySelectorAll(selector)
    var _throttleFn
    function showView() {
        var len = elements.length
        for (var i = 0; i < len; ++i) {
            var ele = elements[i]
            const rect = ele.getBoundingClientRect()
            if (rect.top - document.documentElement.clientHeight <= 0) {
                typeof fn === 'function' && fn(ele)
                elements.splice(i, 1)
                len--
                i--
                if (elements.length == 0) {
                    document.removeEcentListener('scroll', _throttleFn)
                }
            }
        }
    }

    function init() {
        if ('IntersectionObserver' in window) {
            var lazyImgObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        var ele = entry.target
                        typeof fn === 'function' && fn(ele)
                        lazyImgObserver.unobserve(ele)
                    }
                });
            })
            elements.forEach(element => {
                lazyImgObserver.observe(element)
            })
        } else {
            showView()
            _throttleFn = throttle(showView)
            document.addEventListener('scroll', _throttleFn)   
        }
    }
    
    var instance = {
        initial: init
    }

    return instance;
}

function escape(str) {
    str = str.replace(/&/g, '&amp;')
    str = str.replace(/</g, '&lt;')
    str = str.replace(/>/g, '&gt;')
    str = str.replace(/"/g, '&quto;')
    str = str.replace(/'/g, '&#39;')
    str = str.replace(/`/g, '&#96;')
    str = str.replace(/\//g, '&#x2F;')
    return str
  }
