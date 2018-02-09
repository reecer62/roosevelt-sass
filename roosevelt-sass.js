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

      // add the sourceMap param to option if the env is in development
      if (app.settings.env === 'development') {
        options.sourceMap = params.sourceMap
        options.outFile = params.outFile
      } else {
        options.sourceMap = undefined
        options.outFile = undefined
      }

      sass.render(options, (err, output) => {
        if (err) {
          reject(err)
          return
        }
        /*
        console.log(output.map.toString())
        console.log(output.css.toString())
        */
        let newCSS = output.css
        let newFile = fileName.replace('.scss', '.css')

        resolve([newFile, newCSS])
      })
    })
  }
}
