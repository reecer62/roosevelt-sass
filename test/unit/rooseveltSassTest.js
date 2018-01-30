/* eslint-env mocha */

const assert = require('assert')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const cleanupTestApp = require('../util/cleanupTestApp')
const generateTestApp = require('../util/generateTestApp')
const fork = require('child_process').fork
const sass = require('node-sass')

describe('Roosevelt Sass Section Test', function () {
  // location of the test app
  const appDir = path.join(__dirname, '../app/sassJSTest')

  // sample CSS source string to test the compiler with
  const test1 = `body {
    height: 100%;
  }
  h1 {
    font-size: 10px;
  }
  `
  // path to where the file with the CSS source string written on it will be
  const pathOfStaticCSS = path.join(appDir, 'statics', 'css', 'a.js')

  // path to where the compiled CSS file will be written to
  const pathOfcompiledCSS = path.join(appDir, 'statics', '.build', 'css', 'a.js')

  beforeEach(function () {
    // start by generating a statics folder in the roosevelt test app directory
    fse.ensureDirSync(path.join(appDir, 'statics', 'css'))
    // generate sample js files in statics with JS source string from test1
    fs.writeFileSync(pathOfStaticCSS, test1)
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
    // CSS string that represents the CSS file that was compiled with no params set
    const options = {file: pathOfStaticCSS}
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
    }, 'initServer')

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), {'stdio': ['pipe', 'pipe', 'pipe', 'ipc']})

    // grab the string data from the compiled js file and compare that to the string of what a normal uglified looks like
    testApp.on('message', () => {
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      let test = contentsOfCompiledCSS === noParamResult.css.toString()
      assert.equal(test, true)
      testApp.kill()
      done()
    })
  })

  it('should make the same compiled js file if a param is passed to Roosevelt-Sass as to if the file and params were passed to Sass', function (done) {
    // JS string that represents the js file that was compiled with the compress set to false
    const options = {file: pathOfStaticCSS, indentType: 'tab'}
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
    }, 'initServer')

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), {'stdio': ['pipe', 'pipe', 'pipe', 'ipc']})

    // grab the string data from the compiled js file and compare that to the string of what a normal uglified looks like
    testApp.on('message', (app) => {
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      let test = contentsOfCompiledCSS === paramResult.css.toString()
      assert.equal(test, true)
      testApp.kill()
      done()
    })
  })
})
