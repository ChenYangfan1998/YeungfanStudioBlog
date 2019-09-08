const through = require('through2')
const PluginError = require('plugin-error')
const fs = require('fs')
const util = require('util')
const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)

const monthMap = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
const yearMap = {
    '2019': '二〇一九年',
    '2020': '二〇二〇年',
    '2021': '二〇二一年',
    '2022': '二〇二二年',
    '2023': '二〇二三年',
    '2024': '二〇二四年',
}

module.exports = function () {
    return through.obj(async (file, encoding, callback) => {
        if (file.isNull()) {
            callback(null, file)
            return
        }

        if (file.isStream()) {
            callback(new PluginError('config-to-home-page', 'Streaming not supported'))
            return
        }

        try {

            const monthConfigList = []
            const v2Path = __dirname + '/../src/blog/v2'

            let months = await readdir(v2Path)
            months.sort((a, b) => {
                const aStrList = a.split('-')
                const bStrList = b.split('-')
                if (aStrList[0] < bStrList[0]) {
                    return 1
                } else if (aStrList[0] > bStrList[0]) {
                    return -1
                } else {
                    return aStrList[1] < bStrList[1] ? 1 : -1
                }
            })
            for (const monthDir of months) {
                const monthPath = v2Path + '/' + monthDir
                if (fs.statSync(monthPath).isDirectory()) {
                    const blogs = await readdir(monthPath)

                    const configListPerMonth = []
                    for (const blogDir of blogs) {
                        const blogPath = monthPath + '/' + blogDir
                        const configPath = blogPath + '/blog.config.json'
                        const json = await readFile(configPath)
                        const config = JSON.parse(json.toString())
                        config.path = './blog/v2/' + monthDir + '/' + blogDir
                        configListPerMonth.push(config)
                    }
                    monthConfigList.push(configListPerMonth)
                }
            }

            const homePagePerMonthTemplate = await readFile(__dirname + '/../template/home-page-component/home-page-per-month.template.html')
            const homePagePerArticleTemplate = await readFile(__dirname + '/../template/home-page-component/home-page-per-article.template.html')
            const recommendedTodayTemplate = await readFile(__dirname + '/../template/home-page-component/recommended-today.template.html')

            let content = ''
            for (const configPerMonth of monthConfigList) {
                let articles = ''
                let date = ''
                configPerMonth.sort((a, b) => {
                    return new Date(a.date) < new Date(b.date) ? 1 : -1
                })
                configPerMonth.forEach(config => {
                    articles += homePagePerArticleTemplate.toString()
                        .replace('%href%', config.path)
                        .replace('%title%', config.title)
                        .replace('%description%', config.description)
                        .replace('%author%', config.author)
                        .replace('%date%', config.date)
                    date = config.date
                })

                content += homePagePerMonthTemplate.toString()
                    .replace('%month%', dateToChinese(date))
                    .replace('%articles%', articles)
            }

            const recommendedTodayConfigJson = await readFile(__dirname + '/../src/recommend.config.json')
            const recommendedTodayConfig = JSON.parse(recommendedTodayConfigJson.toString())
            const recommendedTodayContent = recommendedTodayTemplate.toString()
                .replace('%href%', recommendedTodayConfig.path)
                .replace('%title%', recommendedTodayConfig.title)
                .replace('%description%', recommendedTodayConfig.description)

            // eslint-disable-next-line require-atomic-updates
            file.contents = Buffer.from(
                file.contents.toString().replace('%content%', content)
                    .replace('%recommended-today%', recommendedTodayContent)
            )
            callback(null, file)
        } catch (error) {
            callback(new PluginError('config-to-home-page', error, {fileName: file.path}))
        }
    })
    function dateToChinese(date) {
        const str = date.split(' ')[0].split('/')
        return yearMap[str[0]] + monthMap[parseInt(str[1])]
    }
}
