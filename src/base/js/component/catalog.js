const articleClassName = 'article'
const targetHostClassName = 'sidebar'
const scrollToOffset = 30
const scrollCheckPoints = []

/**
 * 左侧目录的生成代码
 */
function generateCatalog() {
    const article = document.getElementsByClassName(articleClassName)[0]
    const targetHost = document.getElementsByClassName(targetHostClassName)[0]
    const catalogNode = document.createElement('div')

    const backToHome = document.createElement('a')
    backToHome.className = 'back-to-home-button'
    backToHome.innerText = '回到博客主页'
    backToHome.href = '/'
    targetHost.append(backToHome)

    catalogNode.className = 'catalog'
    targetHost.append(catalogNode)
    for (let node of article.childNodes) {
        switch (node.nodeName) {
        case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6':
            insertCatalogItem(node)
            setLinkNode(node)
            break

        default:
            break
        }
    }

    const scrollHandler = () => {
        const currentScrollTop = getScrollTop()
        const totalScrollTop = document.body.clientHeight - window.innerHeight

        // 20: 贴到底部的判定范围
        if (totalScrollTop - currentScrollTop < 20) {
            focusonCatalogItem(scrollCheckPoints[scrollCheckPoints.length - 1].catalogItem, 'catalog-item-focuson')
        } else {
            scrollCheckPoints.some(checkPoint => {
                // 2: 避免临界值浮点数比较等情况
                if (currentScrollTop + scrollToOffset + 2 > checkPoint.top) {
                    focusonCatalogItem(checkPoint.catalogItem, 'catalog-item-focuson')
                    return false
                }
            })
        }
    }

    scrollHandler()

    window.addEventListener('scroll', scrollHandler)

    function insertCatalogItem(node) {
        const catalogItem = document.createElement('div')
        catalogItem.className = 'catalog-' + node.nodeName.toLowerCase()
        catalogItem.innerHTML = node.textContent
        catalogNode.appendChild(catalogItem)

        const nodeTop = getNodeTop(node)
        scrollCheckPoints.push({
            top: nodeTop,
            catalogItem: catalogItem
        })
        catalogItem.addEventListener('click', () => {
            window.scrollTo(0, nodeTop - scrollToOffset)
        })
    }

    function setLinkNode(node) {
        // <h1><a></a></h1?
        const content = document.createElement('a')
        content.innerHTML = node.innerHTML
        content.href = '#' + node.id
        node.innerHTML = ''
        node.append(content)
    }
}


function getNodeTop(node) {
    let actualTop = node.offsetTop
    let parentNode = node.offsetParent

    while (parentNode !== null) {
        actualTop += parentNode.offsetTop
        parentNode = parentNode.offsetParent
    }

    return actualTop
}

function focusonCatalogItem(node, className) {
    scrollCheckPoints.forEach(checkPoint => {
        if (checkPoint.catalogItem === node) {
            checkPoint.catalogItem.classList.add(className)
        } else {
            checkPoint.catalogItem.classList.remove(className)
        }
    })
}

function getScrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop
}

export default generateCatalog