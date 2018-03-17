console.log('Render Readme TOC...')

// Config
let defaults = {
    minimumHeaders: 2,

    title: '<h3>Readme TOC</h3>',
    listType: 'ul', // values: [ol|ul]
    listStyle: '', // `nav nav-pills nav-stacked`|`list-group`
    listItemStyle: '', // `nav nav-pills nav-stacked`|`list-group`

    headers: '#readme article h1, h2, h3, h4, h5, h6',
    container: '.container.new-discussion-timeline.experiment-repo-nav',
}
let options = {}
let settings = Object.assign(defaults, options) // use options > defaults

// 获得所有header和其对应的id
let headers = []
let ids = []
for (let header of document.querySelectorAll(settings.headers)) {
    let link = header.querySelector('a')
    if (link) {
        if (link.id) {
            headers.push(header)
            ids.push(link.id)
        }
    }
}

// 得到header的层级
function getLevel(ele) {
    return parseInt(ele.nodeName.replace("H", ""), 10)
}

// 根据headers和ids构建TOC
function buildTOC(headers, ids) {
    let toc = []
    toc.push(settings.title)
    toc.push(`<${settings.listType} class="${settings.listStyle}">`)

    let header = headers[0]
    let last_level = getLevel(header)
    toc.push(
        `<li class="${settings.listItemStyle}">
        <a href='#${ids[0]}'>${header.innerText}</a>`
    )
    for (let i = 1; i < headers.length; i++) {
        let [header, id] = [headers[i], ids[i]]

        let level = getLevel(header)

        if (level === last_level) {
            toc.push(
                `</li>
                <li class="${settings.listItemStyle}">
                <a href='#${id}'>${header.innerText}</a>`
            )
        } else if (level > last_level) {
            // for (let i = level; i > last_level; i--) {
            toc.push(`<${settings.listType} class="${settings.listStyle}">`)
            // }
            toc.push(
                `<li class="${settings.listItemStyle}">
                <a href='#${id}'>${header.innerText}</a>`
            )
        } else {  // level < last_level
            // for (let i = level; i < last_level; i++) {
            toc.push(`</li></${settings.listType}>`)
            // }
            toc.push(
                `</li><li class="${settings.listItemStyle}">
                <a href='#${id}'>${header.innerText}</a>`
            )
        }
        last_level = level // update for the next one
    }

    toc.push(`</li></${settings.listType}>`)
    return toc.join('')
}

// 展示TOC
function render() {
    if (!headers.length || headers.length < settings.minimumHeaders) {
        return
    }

    let toc = document.createElement('div')
    toc.classList.add('toc')
    toc.innerHTML = buildTOC(headers, ids)

    let container = document.querySelector(settings.container)
    container.appendChild(toc)
}
render()

console.log('Render TOC done.')
