/**
 * 进度条的控制代码
 */
function watchProgress() {
    const progressBar = document.createElement('div')
    progressBar.className = 'progress-bar'

    const progress = document.createElement('div')
    progress.className = 'progress'

    progressBar.appendChild(progress)
    document.body.firstChild.before(progressBar)

    if (progress) {
        const scrollHandler = () => {
            const currentScrollTop = getScrollTop()
            const totalScrollTop = document.body.clientHeight - window.innerHeight
            const rate = currentScrollTop / totalScrollTop
            progress.style.width = rate * 100 + 'vw'
        }

        scrollHandler()

        window.addEventListener('scroll', scrollHandler)
        // window.addEventListener('touchmove', progressHandler)
    }
}

function getScrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop
}

export default watchProgress