


var page_num = hexo.config.per_page
var record;
var archiveDir = hexo.config.archive_dir
var archiveDirRe = new RegExp(hexo.config.archive_dir + '(/([0-9])+)+(/)?')

hexo.extend.filter.register('template_locals', function(locals) {
    var posts = locals.site.posts
    var page = locals.page
    var real_posts = posts.filter(ele => !ele.record).sort('date', -1)
    var record_posts = posts.filter(ele => ele.record)
    locals.site.posts = real_posts
    var real_length = real_posts.length
    
    if (page.base === '') {
        locals.page.posts = real_posts.slice(0, page_num)
    }
    if (page.base === archiveDir + '/') {  
        page.total = Math.ceil(real_length / page_num)
        locals.page.posts = real_posts.slice((page.current - 1) * page_num, page.current * page_num)
    }
    if (archiveDirRe.test(page.base)) {
        locals.page.posts = page.posts.filter(ele => !ele.record).sort('date', -1)
        if (!page.posts.length) {
            delete locals[page]
        }
    }

    if (record_posts.length > 0) {
        locals.record = record_posts
        record = record_posts
    } else {
        locals.record = record
    }
    return locals;
});


// -
// function binarySearch(array, left, right, target) {
//   var mid = left + ((right - left) >> 1)
//   while (left <= right) {
//     if (array[mid].date.millisecond() === target..millisecond()) {
//       return mid
//     } else if (array[mid].date.millisecond() > target.millisecond()) {
//       left = mid + 1
//     } else {
//       right = mid - 1
//     }
//   }
//   return -1
// }
// var posts = site.posts.toArray()
// var indexPost = binarySearch(posts, 0, posts.length - 1, page.date)
// var isPrev = indexPost !== -1 && indexPost !== 0 ? posts[indexPost - 1] : false
// var isNext = indexPost !== -1 && indexPost !== posts.length - 1 ? posts[indexPost + 1] : false
