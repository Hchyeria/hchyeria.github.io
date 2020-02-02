---
title: Hello World
abbrlink: 16107
hascode: true
hasmath: false
author: Hchyeria
description: 第一篇博客，记录搭建历程。
tags:
    - 技术
    - 感想
photos: ["/main.jpg", "/1.png"]
hasMusic: true
music: [
    {
        name: 'décalcomanie noise＊',
        artist: '牛尾憲輔',
        url: '/music/décalcomanie noise＊.mp3',
        cover: '/music/reflexion,allegretto,you.jpg'
    }
]
---

# Causation

早就想建个人博客写点什么了，选择了Hexo。可惜找了半天没找到自己想要的主题，无奈只好自己写一个。在网上搜罗了教程，看了文档，开始陆陆续续写。先出了些设计图，再开始动工。写的过程中也是觉得不满意然后再重新设计，或者直接写出来看效果。总之，我感觉设计图真不该一开始做的特别认真，一些细节能省就省，能快速出效果就好。最终的效果和设计图相差甚多。
<div align=center><img class="post-img-middle" src="/posts/16107/1.png" />
<div align=center class="img-undertext">初版设计图<div class="img-undertext-divi">

从零开始写一个主题，工程量真的很庞大。我断断续续写了快一年，上学的时间没写，也就一个寒暑假时间，但是相当折磨人。还好坚持写完了。
本次主题最大的挑战是增加了<span class="text-highlight">Record</span>板块，因为我想记录一些生活上值得记录的事，比如参加的比赛，做过的海报等。这是不足以写一篇博客文章来记录，于是索性新开了一个板块。具体实现是从Post文章里面筛选一部分出来，本质上是Post的子集。

但是这么瞎操作就会导致站内一些变量的inconsistence，比如文章返回的应该是不包括Record的内容，但是实际上会全部返回。这会连带其他页面也会出现相应的问题。我找了半天解决办法，最终写了一个脚本利用Hexo的<span class="text-highlight">template_locals</span>钩子，更新相应的变量。使他们保持一致。

```javascript
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

```

这样就好了。
接下来打算再随缘增加一些功能，现阶段没有需求就不改了。

# Feeling

累死我了呜呜呜