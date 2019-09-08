export default function () {
    const imgList = document.getElementsByClassName('welcome-page-background')[0].children

    const title = document.getElementsByClassName('welcome-page-title')[0]
    const backgroundWrapper = document.getElementsByClassName('welcome-page-background-wrapper')[0]

    const scrollHandler = () => {
        const windowInnerHeight = window.innerHeight
        const windowInnerWidth = window.innerWidth
        const scrollTop = getScrollTop()

        if (scrollTop < windowInnerHeight) {
            if (windowInnerHeight < windowInnerWidth) {
                backgroundWrapper.style.transform = `translateY(${ 2 * scrollTop / 10}px)`
            }
            title.style.transform = `translateY(${ 2 * scrollTop / 10}px)`
            imgList[0].style.transform = `translateY(${ 5 * scrollTop / 10}px)`
            imgList[1].style.transform = `translateY(${ 4 * scrollTop / 10}px)`
            imgList[2].style.transform = `translateY(${ 3 * scrollTop / 10}px)`
            imgList[3].style.transform = `translateY(${ 2 * scrollTop / 10}px)`
            imgList[4].style.transform = `translateY(${ 1 * scrollTop / 10}px)`
            imgList[5].style.transform = `translateY(${ 3 * scrollTop / 10}px) translateX(${ 1 * scrollTop / 10}px)`
            imgList[6].style.transform = `translateY(${ 2 * scrollTop / 10}px) translateX(-${ 1 * scrollTop / 10}px)`
        }
    }

    scrollHandler()
    window.addEventListener('scroll', scrollHandler)

    function getScrollTop() {
        return document.documentElement.scrollTop || document.body.scrollTop
    }
}