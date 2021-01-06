var page_num = hexo.config.per_page
var record;
var archiveDir = hexo.config.archive_dir
var archiveDirRe = new RegExp(hexo.config.archive_dir + '(/([0-9])+)+(/)?')


hexo.extend.filter.register('template_locals', function(locals) {
    var posts = locals.site.posts
    var page = locals.page
    var real_posts = posts.filter(ele => !ele.record).sort('date', -1)
    var record_posts = posts.filter(ele => ele.record).sort('date', -1)
    var record_posts_length = record_posts.length;
    var archive_posts = posts.filter(ele => !ele.record || ele.layout === 'post').sort('date', -1)
    locals.site.posts = archive_posts
    var archive_posts_length = archive_posts.length
    
    if (page.base === '') {
        locals.page.posts = real_posts.slice(0, page_num)
    }
    if (page.base === archiveDir + '/') {  
        page.total = Math.ceil(archive_posts_length / page_num)
        locals.page.posts = archive_posts.slice((page.current - 1) * page_num, page.current * page_num)
    }
    if (archiveDirRe.test(page.base)) {
        locals.page.posts = page.posts.filter(ele => !ele.record || ele.layout === 'post').sort('date', -1)
        if (!page.posts.length) {
            delete locals[page]
        }
    }

    if (!record || record_posts_length > 0 && record_posts_length > record.length) {
        record = record_posts
    }

    locals.record = record

    return locals;
});

