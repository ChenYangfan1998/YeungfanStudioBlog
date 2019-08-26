const articleClassName = 'output'
const scrollToOffset = 30
const scrollCheckPoints = []

/**
 * 左侧目录的生成代码
 */
function generateCatalog() {
    const article = document.getElementsByClassName(articleClassName)[0]
    const catalogNode = document.createElement('div')
    catalogNode.className = 'catalog'
    article.firstChild.before(catalogNode)
    for (let node of article.childNodes) {
        switch (node.nodeName) {
        case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6':
            insertCatalogItem(node)
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
                    if (!ifContentClass(checkPoint.catalogItem.classList, 'catalog-item-focuson')) {
                        focusonCatalogItem(checkPoint.catalogItem, 'catalog-item-focuson')
                    }
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

function ifContentClass(classList, className) {
    let result = false
    for (const classItem of classList) {
        if (className === classItem) {
            result = true
            break
        }
    }
    if (result) console.log(123)
    return result
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