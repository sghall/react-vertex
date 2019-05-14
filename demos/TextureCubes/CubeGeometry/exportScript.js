/* eslint-disable no-undef */

const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const outputPath = `${path.resolve(__dirname)}/cube.json`
const nodeModulesPath = path.resolve(__dirname, '../../../node_modules')

puppeteer.launch().then(async browser => {
  const page = await browser.newPage()
  page.on('console', msg => console.log(msg.text)) // eslint-disable-line

  await page.addScriptTag({
    path: `${nodeModulesPath}/three/build/three.js`,
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

  await page.evaluate(async () => {
    const geom = new THREE.BoxBufferGeometry(1, 1, 1).toNonIndexed()

    const data = {
      positions: Array.from(geom.attributes.position.array),
      uvs: Array.from(geom.attributes.uv.array),
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
