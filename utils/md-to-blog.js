const through = require('through2')
const PluginError = require('plugin-error')
const fs = require('fs')

module.exports = function () {
    return through.obj(async (file, encoding, callback) => {
        if (file.isNull()) {
            callback(null, file)
            return
        }

        if (file.isStream()) {
            callback(new PluginError('md-to-blog', 'Streaming not supported'))
            return
        }

        try {
            fs.readFile(__dirname + '/../template/blog.template.html', function (err, data) {
                if (err) {
                    console.log(err)
                } else {
                    const path = file.path.substr(0, file.path.lastIndexOf('/'))
                    fs.readFile(path + '/blog.config.json', function (err, configJson) {
                        if (err) {
                            console.log(err)
                        } else {
                            const config = JSON.parse(configJson.toString())
                            const article = file.contents.toString()
                            file.contents = Buffer.from(data.toString().replace('%article%', article).replace('%title%', config.title))
                            callback(null, file)
                        }
                    })
                }
            })
        } catch (error) {
            callback(new PluginError('md-to-blog', error, {fileName: file.path}))
        }
    })
}