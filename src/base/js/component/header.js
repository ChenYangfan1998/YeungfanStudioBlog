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
    const resizeHandler = () => {
        if (window.innerWidth < 1100) {
            menuWrapper.style.visibility = 'unset'
            sidebar.style.display = 'none'
        } else {
            menuWrapper.style.visibility = 'hidden'
            sidebar.style.display = 'unset'
        }
    }

    resizeHandler()
    window.onresize = resizeHandler

    const menuWrapperClickHandler = () => {
        sidebar.style.display === 'unset' ? sidebar.style.display = 'none' : sidebar.style.display = 'unset'

    }

    menuWrapper.addEventListener('click', menuWrapperClickHandler)
}