var page_num = 10
var record;
hexo.extend.filter.register('template_locals', function(locals){
    var posts = locals.site.posts
    var page = locals.page
    var real_posts = posts.filter(ele => !ele.record).sort('date', -1)
    var record_posts = posts.filter(ele => ele.record)
    locals.site.posts = real_posts
    var real_length = real_posts.length
    var res = /archive(\/([0-9])+)+(\/)?/
    if (page.base === '') {
        locals.page.posts = real_posts.slice(0, page_num)
    }
    if (page.base === 'archive/') {  
        page.total = Math.ceil(real_length / page_num)
        locals.page.posts = real_posts.slice((page.current - 1) * page_num, page.current * page_num)
    }
    if (res.test(page.base)) {
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
