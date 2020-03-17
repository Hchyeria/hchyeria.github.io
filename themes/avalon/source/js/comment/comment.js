$(function () {
    let BASE_URL = 'https://' + window.location.host + '/api/'
    let matchPostId = window.location.pathname.match(/\D*(\d+)/)
    let postId = matchPostId && matchPostId[1]

    if (!postId) return
    
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

    let dom
    fetch(`${BASE_URL}comment?pid=${postId}`)
    .then(res => res.json())
    .then(jsonData => {
        if (jsonData.status) {
            jsonData.forEach(ele => {
                dom += commentComponent(jsonData.username, jsonData.createTime, jsonData.content)
            })

            document.getElementById('comment-block').appendChild(dom)
        }
    })

    const getView = () => {
        fetch(`${BASE_URL}view?pid=${postId}`)
        .then(res => res.json())
        .then(jsonData => {
            if (jsonData.status) {
                document.getElementById('post-view').textContent = jsonData.data
            }
        })
    }

    requestIdleCallback ? requestIdleCallback(getView) : setTimeout(getView, 1000)

    $('#send-comment').on('click', function(e) {
        e.preventDefault()
        let comment = $('#comment-data').trim()
        let name = $('#user-name').trim()
        let contact = $('#user-contact').trim()
        if (!comment) {
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

        document.getElementById('comment-block').appendChild(commentComponent(name, createTime, content))
    
    })
})