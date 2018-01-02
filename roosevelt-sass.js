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
      let options = params || {}

      options.data = fs.readFileSync(path.join(app.get('cssPath'), fileName), 'utf8')
      options.includePaths = [app.get('cssPath')]

      // disable minify if noMinify param is present in roosevelt
      if (app.get('params').noMinify) {
        options.outputStyle = 'nested'
      }

      sass.render(options, (err, output) => {
        if (err) {
          reject(err)
          return
        }

        let newCSS = output.css
        let newFile = fileName.replace('.scss', '.css')

        resolve([newFile, newCSS])
      })
    })
  }
}
