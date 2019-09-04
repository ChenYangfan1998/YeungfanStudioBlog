export default function () {
    const header = document.createElement('header')
    header.innerHTML =
        '<div class=\'menu-wrapper\'>' +
        '   <span class=\'menu-icon\'></span>' +
        '</div>' +
        '<div class=\'home-page-clickable\'>' +
        '   <span class=\'home-page-strong\'>Yeungfan&nbsp;</span>Studio' +
        '</div>'
    document.body.firstChild.before(header)

    const menuWrapper = document.getElementsByClassName('menu-wrapper')[0]
    const sidebar = document.getElementsByClassName('sidebar')[0]
    const menuIcon = document.getElementsByClassName('menu-icon')[0]
    const backToHomeButton = document.getElementsByClassName('back-to-home-button')[0]
    const resizeHandler = () => {
        if (window.innerWidth < 1100) {
            menuWrapper.style.visibility = 'unset'
            sidebar.classList.add('sidebar-small-device')
            backToHomeButton.classList.add('back-to-home-button-show')
        } else {
            menuWrapper.style.visibility = 'hidden'
            sidebar.classList.remove('sidebar-small-device')
            backToHomeButton.classList.remove('back-to-home-button-show')
        }
    }

    resizeHandler()
    window.onresize = resizeHandler

    const changeMenuState = () => {
        sidebar.classList.toggle('sidebar-small-device-active')
        menuIcon.classList.toggle('menu-icon-active')
    }
    const closeMenuState = () => {
        sidebar.classList.remove('sidebar-small-device-active')
        menuIcon.classList.remove('menu-icon-active')
    }
    menuWrapper.addEventListener('click', changeMenuState)

    const article = document.getElementsByClassName('article')[0]
    article.addEventListener('click', closeMenuState)

}