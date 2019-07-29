const fs = require('fs')
const path = require('path')
const sass = require('node-sass')

module.exports = {
  versionCode: function (app) {
    return `$${app.get('params').css.versionFile.varName}: '${app.get('appVersion')}';\n`
  },

  parse: function (app, fileName) {
    return new Promise((resolve, reject) => {
      const params = app.get('params').css.compiler.params
      const options = params || {}

      options.data = fs.readFileSync(path.join(app.get('cssPath'), fileName), 'utf8')
      options.includePaths = [app.get('cssPath')]

      // disable minify if minify param is false in roosevelt
      if (!app.get('params').minify) {
        options.outputStyle = 'nested'
      }

      // add the sourceMap param to option if the env is in development
      if (app.settings.env === 'development' && params.sourceMap !== null && params.sourceMap !== undefined) {
        options.sourceMap = params.sourceMap
        options.outFile = params.outFile
        options.sourceMapEmbed = params.sourceMapEmbed
        options.omitSourceMapUrl = params.omitSourceMapUrl
        options.sourceMapRoot = params.sourceMapRoot
      } else if (app.settings.env === 'development') {
        options.sourceMap = true
        options.sourceMapEmbed = true
        options.sourceMapContents = true
      } else {
        options.sourceMap = undefined
        options.outFile = undefined
        options.sourceMapEmbed = undefined
        options.omitSourceMapUrl = undefined
        options.sourceMapRoot = undefined
      }

      sass.render(options, (err, output) => {
        if (err) {
          reject(err)
          return
        }

        const newCSS = output.css
        const newFile = fileName.replace('.scss', '.css')

        resolve([newFile, newCSS])
      })
    })
  }
}
