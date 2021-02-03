/* eslint-disable no-undef */

const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const modelPath = `${path.resolve(__dirname)}/shark.obj`
const outputPath = `${path.resolve(__dirname)}/shark.json`
const nodeModulesPath = path.resolve(__dirname, '../../../node_modules')

puppeteer.launch().then(async browser => {
  const page = await browser.newPage()
  page.on('console', msg => console.log(msg.text)) // eslint-disable-line

  await page.addScriptTag({
    path: `${nodeModulesPath}/three/build/three.js`,
  })

  await page.addScriptTag({
    path: `${nodeModulesPath}/three/examples/js/loaders/OBJLoader.js`,
  })

  await page.exposeFunction('writeFile', async content => {
    return new Promise((resolve, reject) => {
      fs.writeFile(outputPath, content, 'utf8', err => {
        if (err) {
          reject(err)
        }

        resolve()
      })
    })
  })

  await page.exposeFunction('readFile', async () => {
    return new Promise((resolve, reject) => {
      fs.readFile(modelPath, 'utf8', (err, data) => {
        if (err) {
          reject(err)
        }

        resolve(data)
      })
    })
  })

  await page.evaluate(async () => {
    const model = await window.readFile()
    const loader = new THREE.OBJLoader()

    const obj = loader.parse(model)

    const data = {
      positions: Array.from(obj.children[0].geometry.attributes.position.array),
      normals: Array.from(obj.children[0].geometry.attributes.normal.array),
    }

    const PRECISION = 6

    function parseNumber(key, value) {
      return typeof value === 'number'
        ? parseFloat(value.toFixed(PRECISION))
        : value
    }

    await window.writeFile(JSON.stringify(data, parseNumber))
  })

  await browser.close()
})
