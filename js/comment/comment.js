$(function () {
    let BASE_URL = 'https://' + window.location.host + '/api/'
    let matchPostId = window.location.pathname.match(/\D*(\d+)/)
    let postId = matchPostId && matchPostId[1]

    if (!postId) return
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

    const commentComponent = (username, createTime, content) => {
        return `
            <div class="comment-item">
            <picture>
                <source srcset="/img/default-avatar.png" type="image/webp">
                <source srcset="/img/default-avatar.png" type="image/png">
                <img src="/img/default-avatar.png">
            </picture>
            <div class="comment-data">
                <div class="comment-title">
                    <span class="comment-user-name">${username || 'Two Dog'}</span>
                    <span class="comment-user-date comment-text">
                        ${String.prototype.split.call(new Date(createTime), ' ').slice(1, 5).join(' ')}
                    </span>
                </div>
            <div class="comment-content">
                ${content}
            </div>
            </div>
            </div>
        `
    }

    fetch(`${BASE_URL}comment?pid=${postId}`)
    .then(res => res.json())
    .then(jsonData => {
        if (jsonData.status) {
            let dom = ''
            let data = jsonData.data
            data.forEach(ele => {
                dom += commentComponent(ele.username, ele.createTime, ele.content)
            })

            $('#comment-block').append($(dom))
        }
    })

    const getView = () => {
        fetch(`${BASE_URL}view?pid=${postId}`)
        .then(res => res.json())
        .then(jsonData => {
            if (jsonData.status) {
                document.getElementById('post-view').textContent = 'view ' + jsonData.data
            }
        })
    }

    requestIdleCallback ? requestIdleCallback(getView) : setTimeout(getView, 1000)

    const sendMsg = function() {
        let content = escape($('#comment-data').val().trim())
        let name = escape($('#user-name').val().trim())
        let contact = escape($('#user-contact').val().trim())
        if (!content) {
            $('#comment-data').css('border', 'solid 1.4px yellow')
            return
        }
        if (!name) {
            $('.user-name').css('border', 'solid 1.4px yellow')
            return
        }
        let formData = new FormData()
        let createTime = new Date()
        formData.append('postId', postId)
        formData.append('content', content)
        formData.append('username', name)
        formData.append('createTime', createTime)
        formData.append('contact', contact)
        fetch(`${BASE_URL}comment`, {
            method: 'POST',
            body: formData
        })

        $('#comment-block').append($(commentComponent(name, createTime, content)))
    
    }

    $('#send-comment').on('click', debounce(sendMsg))
})