/*
 * v1.0.0
 * Masonry layouts library
 * 
 * base on https://github.com/callmecavs/bricks.js/blob/master/src/bricks.js
 * MIT License
 * by Hchyeria
 */

function Masonry(options) {
    var persist // packing new elements, or all elements?
    var isResize
    var chooseCaseIndex,
        chooseCaseDetail,
        columnHeights,
        currentIndex,
        nodes,
        nodeHeights,
        nodeTop,
        nodeWidth,
        nodeLeft;

    var options = options || {}
    var cases = options.cases.slice()
    var container = options.container.nodeType
            ? options.container
            : document.querySelector(options.container)
    var packed = options.packed.indexOf('data-') === 0 ? options.packed : `data-${options.packed}`
    var blockLoad = options.blockLoad && (options.blockLoad.indexOf('data-') === 0 ? options.blockLoad : `data-${options.blockLoad}`)
    var selectors = {
        all: () => blockLoad
            ? toArray(container.children).filter(node => node.hasAttribute(`${blockLoad}`))
            : toArray(container.children),
        new: () => blockLoad
            ? toArray(container.children).filter(node => node.hasAttribute(`${blockLoad}`) && !node.hasAttribute(`${packed}`))
            : toArray(container.children).filter(node => !node.hasAttribute(`${packed}`))
    }
    var screenWidth
    
    var setup = [
        setChooseCaseIndex,
        setChooseCaseDetail,
        setColumnHeights
    ]

    var run = [
        setNodes,
        setNodeWidth,
        setNodeHeights,
        setNodePosition,
        setContainerStyles
    ]

    function toArray(input, scope = document) {
        return Array.prototype.slice.call(input)
    }

    function fillArray(length) {
        return Array.apply(null, Array(length)).map(() => 0)
    }

    function getChooseCaseIndex() {
        return cases
            .map(ele => ele.mediaMaxWidth && window.matchMedia(`(max-width: ${ele.mediaMaxWidth}px)`).matches)
            .indexOf(true)
    }
    function setChooseCaseIndex() {
        chooseCaseIndex = getChooseCaseIndex()
    }

    function setChooseCaseDetail() {
        chooseCaseDetail = chooseCaseIndex === -1
            ? cases[cases.length -1]
            : cases[chooseCaseIndex]
    }

    function setColumnHeights() {
        columnHeights = fillArray(chooseCaseDetail.columns)
    }

    function setNodeWidth (){
        nodeWidth = nodes[0].clientWidth
    }

    function setNodes() {
        nodes = selectors[persist ? 'new' : 'all']()
    }

    function setNodeHeights() {
        if (!nodes.length) return;
        nodeHeights = nodes.map(element => element.clientHeight)
    }
    
    function getMaxColumnHeight(){
        return Math.max.apply(Math, columnHeights)
    }

    function getMixColumnHeight(){
        return Math.min.apply(Math, columnHeights)
    }

    function setContainerStyles() {
        container.style.position = 'relative'
        container.style.width = chooseCaseDetail.columns == 1
            ? ''
            : (chooseCaseDetail.columns*(nodeWidth + chooseCaseDetail.gap) + chooseCaseDetail.gap) + 'px'
        container.style.height = getMaxColumnHeight() + 'px'
        
    }

    function setNodePosition(){
        nodes.forEach((element, index) => {
            element.style.position = 'absolute'
            currentIndex = columnHeights.indexOf(getMixColumnHeight())
            nodeTop = (columnHeights[currentIndex] + chooseCaseDetail.gap) + 'px'
            nodeLeft = currentIndex*(nodeWidth + chooseCaseDetail.gap)+ 'px' 
            element.style.transform = `translate3d(${nodeLeft}, ${nodeTop}, 0)`
            element.setAttribute(packed, '')
            nodeHeight = nodeHeights[index]
            if(nodeHeight){
                columnHeights[currentIndex] += nodeHeight + chooseCaseDetail.gap
            }
        });
    }

    function runSeries(functions) {
        functions.forEach(func => func())
    }

    function initial(callback) {
        persist = false
        runSeries(setup.concat(run));
        callback && callback()
    }

    function update(callback) {
        persist = true
        runSeries(run)
        callback && callback()
    }

    var setIsResize = function() {
        isResize = false
    }

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

    var resizeFrame = function() {
        isResize = true
        screenWidth = document.body.clientWidth || document.documentElement.clientWidth

        if (chooseCaseIndex !== getChooseCaseIndex()) {
            initial()
        }
        
    }
    window.addEventListener('resize', debounce(resizeFrame), false)

    var masonry = {
        initial: initial,
        update: update,
        getMaxColumnHeight: getMaxColumnHeight
    }

    return masonry;

}