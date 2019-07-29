/* eslint-env mocha */

const assert = require('assert')
const fs = require('fs-extra')
const path = require('path')
const cleanupTestApp = require('../../node_modules/roosevelt/test/util/cleanupTestApp')
const generateTestApp = require('../../node_modules/roosevelt/test/util/generateTestApp')
const fork = require('child_process').fork
const sass = require('node-sass')

describe('Roosevelt Sass Section Test', function () {
  // location of the test app
  const appDir = path.join(__dirname, '../app/sassJSTest')

  // sample CSS source string to test the compiler with
  const cssStaticFile = `
  $widthSize: 100px;
  body {
    height: 100%;
    width: $widthSize;
  }
  h1 {
    font-size: 10px;
    width: $widthSize;
  }
  `
  // path to where the file with the Sass source string written on it will be
  const pathOfStaticSass = path.join(appDir, 'statics', 'css', 'a.scss')

  // path to where the compiled CSS file will be written to
  const pathOfcompiledCSS = path.join(appDir, 'statics', '.build', 'css', 'a.css')

  // options that would be passed to generateTestApp
  const sOptions = { rooseveltPath: 'roosevelt', method: 'initServer' }

  beforeEach(function () {
    // start by generating a statics folder in the roosevelt test app directory
    fs.ensureDirSync(path.join(appDir, 'statics', 'css'))
    // generate sample js files in statics with JS source string from cssStaticFile
    fs.writeFileSync(pathOfStaticSass, cssStaticFile)
  })

  afterEach(function (done) {
    // delete the generated test folder once we are done so that we do not have conflicting data
    cleanupTestApp(appDir, (err) => {
      if (err) {
        throw err
      } else {
        done()
      }
    })
  })

  it('should make a compiled CSS file that is the same as the compiled CSS string I have generated from using sass', function (done) {
    // Sass string that represents the CSS file that was compiled with no params set
    const options = { file: pathOfStaticSass }
    const noParamResult = sass.renderSync(options)

    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-sass',
          params: {
            cleanCSS: {
              advanced: true,
              aggressiveMerging: true
            },
            sourceMap: null
          }
        }
      }
    }, sOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })

    // grab the string data from the compiled css file and compare that to the string of what a normal uglified looks like
    testApp.on('message', () => {
      const contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      const test = contentsOfCompiledCSS === noParamResult.css.toString()
      assert.strictEqual(test, true)
    })

    testApp.on('exit', () => {
      done()
    })
  })

  it('should make the same compiled css file if a param is passed to Roosevelt-Sass as to if the file and params were passed to sass', function (done) {
    // Sass string that represents the css file that was compiled with the compress set to false
    const options = { file: pathOfStaticSass, indentType: 'tab' }
    const paramResult = sass.renderSync(options)

    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-sass',
          params: {
            cleanCSS: {
              advanced: true,
              aggressiveMerging: true
            },
            sourceMap: null,
            indentType: 'tab'
          }
        }
      }
    }, sOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })

    // grab the string data from the compiled css file and compare that to the string of what a normal uglified looks like
    testApp.on('message', (app) => {
      const contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      const test = contentsOfCompiledCSS === paramResult.css.toString()
      assert.strictEqual(test, true)
    })

    testApp.on('exit', () => {
      done()
    })
  })

  it('should make the a CSS compiled file that has a output style of nested if minify is false, regardless of what is put in outputStyle', function (done) {
    // Sass string that represents the css file that was compiled with the compress set to false
    const options = { file: pathOfStaticSass, outputStyle: 'nested' }
    const paramResult = sass.renderSync(options)

    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      minify: false,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-sass',
          params: {
            cleanCSS: {
              advanced: true,
              aggressiveMerging: true
            },
            sourceMap: null,
            outputStyle: 'compressed'
          }
        }
      }
    }, sOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })

    // grab the string data from the compiled css file and compare that to the string of what a normal uglified looks like
    testApp.on('message', (app) => {
      const contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      const test = contentsOfCompiledCSS === paramResult.css.toString()
      assert.strictEqual(test, true)
    })

    testApp.on('exit', () => {
      done()
    })
  })

  it('should make the a CSS compiled file that has a output style of something other than nested if noMinify is false and something else is put into outputStyle', function (done) {
    // Sass string that represents the css file that was compiled with the compress set to false
    const options = { file: pathOfStaticSass, outputStyle: 'nested' }
    const paramResult = sass.renderSync(options)

    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      noMinify: false,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-sass',
          params: {
            cleanCSS: {
              advanced: true,
              aggressiveMerging: true
            },
            sourceMap: null,
            outputStyle: 'compressed'
          }
        }
      }
    }, sOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })

    // grab the string data from the compiled css file and compare that to the string of what a normal uglified looks like
    testApp.on('message', (app) => {
      const contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      const test = contentsOfCompiledCSS === paramResult.css.toString()
      assert.strictEqual(test, false)
    })

    testApp.on('exit', () => {
      done()
    })
  })

  it('make a CSS file that declares a CSS variable that contains the app version number from package.js', function (done) {
    // contents of sample package.json file to use for testing css versionFile
    const packageJSON = {
      version: '0.3.1',
      rooseveltConfig: {}
    }

    // generate the package json file with basic data
    fs.ensureDirSync(path.join(appDir))
    fs.writeFileSync(path.join(appDir, 'package.json'), JSON.stringify(packageJSON))

    // create the app.js file
    generateTestApp({
      appDir: appDir,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-sass',
          params: {
            cleanCSS: {
              advanced: true,
              aggressiveMerging: true
            },
            sourceMap: null
          }
        },
        versionFile: {
          fileName: '_version.sass',
          varName: 'appVersion'
        }
      },
      generateFolderStructure: true
    }, sOptions)

    // fork the app.js file and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })

    // wait for the app to be finished initialized
    testApp.on('message', () => {
      // see if the file exist inside the css folder
      const versionFilePath = path.join(appDir, 'statics', 'css', '_version.sass')
      const test1 = fs.existsSync(versionFilePath)
      assert.strictEqual(test1, true)
      // see that the value in the css version file is correct
      const versionFileString = fs.readFileSync(path.join(appDir, 'statics', 'css', '_version.sass'), 'utf8')
      const versionFileNum = versionFileString.split(`'`)
      const test2 = packageJSON.version === versionFileNum[1]
      assert.strictEqual(test2, true)
    })

    testApp.on('exit', () => {
      done()
    })
  })

  it('should give a "error" string if there is a massive problem with the code that the program is trying to parse (typo)', function (done) {
    // Sass source script that has a error in it (typo)
    const errorTest = `body { widthy: 300 pax`
    // path of where the file with this script will be located
    const pathOfErrorStaticSass = path.join(appDir, 'statics', 'css', 'b.scss')
    // make this file before the test
    fs.writeFileSync(pathOfErrorStaticSass, errorTest)
    // variable to hold whater or not an error had occured
    let error = false
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-sass',
          params: {
            cleanCSS: {
              advanced: true,
              aggressiveMerging: true
            },
            sourceMap: null
          }
        }
      }
    }, sOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })

    // see that the app throws an error
    testApp.stderr.on('data', (data) => {
      if (data.includes('failed to parse')) {
        error = true
      }
    })

    // It should not compiled, meaning that if it did, something is off with the error system
    testApp.on('message', () => {
      if (!error) {
        assert.fail('the app was able to initialize, meaning that roosevelt-sass was not able to detect the error')
      }
    })

    testApp.on('exit', () => {
      done()
    })
  })

  it('should be able to compile a sourceMap and put it as a comment in the css file while the app is in Dev mode', function (done) {
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-sass',
          params: {
            cleanCSS: {
              advanced: true,
              aggressiveMerging: true
            },
            sourceMap: true,
            outFile: path.join(appDir, 'static', 'css', 'map.css'),
            sourceMapContents: true,
            sourceMapEmbed: true
          }
        }
      }
    }, sOptions)

    // fork the app and run it as a child process in dev mode
    const testApp = fork(path.join(appDir, 'app.js'), ['--dev'], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })

    // when the server started, read the file of the build css file and see if the inline source map comment is there
    testApp.on('message', () => {
      // read the file
      const cssFileData = fs.readFileSync(path.join(appDir, 'statics', '.build', 'css', 'a.css'))
      // test whether or not the text includes the unique text that is found within a source map
      const test = cssFileData.includes('/*# sourceMappingURL=data:application/json;base64')
      assert.strictEqual(test, true)
    })

    testApp.on('exit', () => {
      done()
    })
  })

  it('should not compile a sourceMap and put it as a comment in the css file while the app is in Prod mode', function (done) {
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      nodeEnv: 'production',
      css: {
        compiler: {
          nodeModule: '../../roosevelt-sass',
          params: {
            cleanCSS: {
              advanced: true,
              aggressiveMerging: true
            },
            sourceMap: true,
            outFile: path.join(appDir, 'static', 'css', 'map.css'),
            sourceMapContents: true,
            sourceMapEmbed: true
          }
        }
      }
    }, sOptions)

    // fork the app and run it as a child process in prod mode
    const testApp = fork(path.join(appDir, 'app.js'), { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })

    // when the server started, read the file of the build css file and see if the inline source map comment is there
    testApp.on('message', () => {
      // read the file
      const cssFileData = fs.readFileSync(path.join(appDir, 'statics', '.build', 'css', 'a.css'))
      // test whether or not the text includes the unique text that is found within a source map
      const test = cssFileData.includes('/*# sourceMappingURL=data:application/json;base64')
      assert.strictEqual(test, false)
    })

    testApp.on('exit', () => {
      done()
    })
  })

  it('should be able to make a compiled css file even when the params of the css compilers is undefined', function (done) {
    // Sass string that represents the css file that was compiled with the compress set to false
    const options = { file: pathOfStaticSass }
    const paramResult = sass.renderSync(options)

    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      noMinify: false,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-sass'
        }
      }
    }, sOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })

    // grab the string data from the compiled css file and compare that to the string of what a normal uglified looks like
    testApp.on('message', (app) => {
      const contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      const test = contentsOfCompiledCSS === paramResult.css.toString()
      assert.strictEqual(test, true)
    })

    testApp.on('exit', () => {
      done()
    })
  })

  it('should enable source mapping by default in dev mode when "sourceMap" param is not defined', function (done) {
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-sass',
          params: {
            sourceMap: null
          }
        }
      }
    }, sOptions)

    // fork the app and run it as a child process in dev mode
    const testApp = fork(path.join(appDir, 'app.js'), ['--dev'], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })

    // when the server started, read the file of the build css file and see if the inline source map comment is there
    testApp.on('message', () => {
      // read the file
      const cssFileData = fs.readFileSync(path.join(appDir, 'statics', '.build', 'css', 'a.css'))
      // test whether or not the text includes the unique text that is found within a source map
      const test = cssFileData.includes('/*# sourceMappingURL=data:application/json;base64')
      assert.strictEqual(test, true)
    })

    testApp.on('exit', () => {
      done()
    })
  })
})
