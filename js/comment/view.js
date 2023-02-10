$(function () {
    let BASE_URL = 'https://' + window.location.host + '/api/'
    let matchPostId = window.location.pathname.match(/\D*(\d+)/)
    let postId = matchPostId && matchPostId[1]

    if (!postId) return
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
})

