document.addEventListener('DOMContentLoaded',function(){
    var packed = 'data-packed'
    var item = 'record-item'
    var container = '#record-content'
    function toArray(input) {
        return Array.prototype.slice.call(input)
    }

    function findChildrenByTag(dom, tag) {
        var children = toArray(dom.children)
        var length = children.length
        if(length){
            for(var i = 0; i < length; ++i){
                var ele = children[i]
                if(!ele.children.length){
                    if(ele.nodeName === tag){
                        return ele
                    }
                }
                else{
                    return findChildrenByTag(ele, tag)
                }
            }
        }
        else{
            if(dom.nodeName == tag){
                return dom;
            }
        }
    }

    function findParentByClass(dom, className) {
        var parent = dom.parentNode
        if (hasClass(parent, className)){
            return parent;
        }
        else{
            return findParentByClass(parent, className)
        }
    }

    var imgComplete = function(imgArray, callback, secondCallback) {
        var count = 0, length = imgArray ? imgArray.length : 0;
        if(!length) return;
        function foo(){
            function bar(){ 
                count++;
                if(count === length){
                    callback(secondCallback)
                    imgArray.forEach(ele =>{
                        var temp = findParentByClass(ele, item)
                        removeClass(temp, 'hidden')
                    })
                    
                }
            }
            imgArray.forEach(ele =>{
                if(ele.complete){
                    bar()
                }
                else{
                    ele.onload = bar
                    ele.onerror = bar
                }
                
            })
        }
        return foo;
    }

    function loadMore() {
        var num = document.querySelector(container).getAttribute("data-num")
        return function () {
            var unLoadImg = toArray(document.querySelectorAll(`.${item}:not([data-load=''])`)).slice(0, num)
            if(!unLoadImg.length) return;
            var temp = []
            unLoadImg.forEach(ele =>{
                ele.setAttribute("data-load", "")
                var imgDom = findChildrenByTag(ele, 'IMG')
                imgDom.setAttribute('src', imgDom.getAttribute('data-src'))
                temp.push(imgDom)
            })
            return temp
        }
        
    }

    var loadMoreCount = loadMore();

    function setup() {
        var nodeWidth = globalData.width
        var column1 = 1, column2 = 2, column3 = 4, gap = 10;
        var cases = [
            { mediaMaxWidth: '768', columns: column1, gap: gap },
            { mediaMaxWidth: '980', columns: column2, gap: gap },
            { mediaMaxWidth: '1024', columns: column3, gap: gap }
          ]
        
        var masonry = Masonry({
            container: container,
            packed: packed,
            blockLoad: 'data-load',
            cases: cases
        })

        var setHeight = function() {
            if(masonry.getMaxColumnHeight() - globalData.height < 0.5){

                loadMoreCount() && imgComplete(loadMoreCount(), masonry.update, setHeight)()
            }
        }

        function getRect(ele){
            var inHeight=window.innerHeight,
                rect=ele.getBoundingClientRect();
    
            rect.isVisible = rect.top-inHeight < 0
            rect.isBottom = rect.bottom-inHeight <= 0
            return rect
        }
    
        function reachBottomLoad() {
            if(getRect(document.body).isBottom){
                debounce(imgComplete(loadMoreCount(), masonry.update))()
            }
        }
    
        window.addEventListener("scroll" , debounce(reachBottomLoad), false) 

        masonry.initial(setHeight)

        
        
    }
    imgComplete(document.querySelectorAll(`.${item}[data-load=''] img`), setup)()
    
   

});


