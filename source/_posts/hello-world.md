---
title: Hello World
abbrlink: 16107
hascode: true
hasmath: false
author: Hchyeria
description: 第一篇博客，记录搭建历程。
tags:
    - Tech
    - Feeling
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
date: August 7, 2018
---

# Causation

早就想建个人博客写点什么了，选择了Hexo。可惜找了半天没找到自己想要的主题，无奈只好自己写一个。在网上搜罗了教程，看了文档，开始陆陆续续写。先出了些设计图，再开始动工。写的过程中也是觉得不满意然后再重新设计，或者直接写出来看效果。总之，我感觉设计图真不该一开始做的特别认真，一些细节能省就省，能快速出效果就好。最终的效果和设计图相差甚多。
<div align=center><img class="post-img-middle" src="/posts/16107/1.png" />
<div align=center class="img-undertext">初版设计图<div class="img-undertext-divi">

从零开始写一个主题，工程量真的很庞大。我断断续续写了快一年，上学的时间没写，也就一个寒暑假时间，但是相当折磨人。还好坚持写完了。
本次主题最大的挑战是增加了<span class="text-highlight">Record</span>板块，因为我想记录一些生活上值得记录的事，比如参加的比赛，做过的海报等。这些不足以写一篇博客文章来记录，而且我希望博客文章最好全是关于学习的记录总结。于是索性新开了一个板块。具体实现是从 Post 文章里面筛选一部分出来，本质上是 Post 的子集。

但是这么瞎操作就会导致站内一些变量的 inconsistence，比如文章返回的应该是不包括 Record 的内容，但是实际上会全部返回。这会连带其他页面也会出现相应的问题。我找了半天解决办法，最终写了一个脚本利用 Hexo 的<span class="text-highlight">template_locals</span>钩子，更新相应的变量。使他们保持一致。

```javascript
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

```
这样就好了。
# FrontEnd
本次开发的经历，我学到了不少知识。这次目的本来就是想提升自己的水平。从一开始学习 Stylus, Pug, Node.js，到开发过程中学到了一些原生 JS 替代 jQuery 的方法，手动实现了 throttle，debounce 等 helper 函数，一些 CSS 的神奇操作，尝试着写 polyfill，还有一些插件比如图片懒加载，瀑布流也是我自己实现的。在原来功能上，还增加定制了我需要的一些功能，比如基于瀑布流的触底加载更多，而且是图片分块加载。怎么实现的呢，当然参考了不少源码，在阅读源码过程中，一边是真的能感觉自己进步飞速，另一边是自己真的是菜的不行的事实。顺便因为读源码常常遇到正则表达式，便狠下心好好的学了正则表达式（真香）。这里推荐一本 JavaScript 版的正则入门教程 ->[《JS正则迷你书》)](https://github.com/qdlaoyao/js-regex-mini-book)，这里面还讲了正则的原理和性能优化，令人恍然大悟的感觉。

# BackEnd
后端的部分主要是评论系统和数据统计。这里我没有选择第三方的服务，而是自己用 Spring Boot 搭建的一个后台系统。虽然功能不是很强大，已经满足我的需求了。为什么自己写后台呢？主要是我没发现，样式跟整个网站风格比较搭的库。并不是想要很强大的功能，够用就行。还有一些服务可能要收费，搭建起来麻烦，不如自己写一个快。

接下来打算再随缘增加一些功能，现阶段没有需求就不改了。

# Feeling

累死我了呜呜呜