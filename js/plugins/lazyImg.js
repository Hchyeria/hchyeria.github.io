function LazyImage(option) {
    var selector = option.selector || '.lazy-img'
    var callFn = option.complete
    var imageList = Array.prototype.slice.call(document.querySelectorAll(selector))

    function lazyImg(imgElement) {
        imgElement.src = imgElement.dataset.src
        imgElement.classList.remove('lazy-img')
    }

    var lazyImageInstance = {
        initial: showViewControl(selector, lazyImg).initial
    }

    return lazyImageInstance;
}