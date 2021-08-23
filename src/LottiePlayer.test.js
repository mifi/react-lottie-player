import puppeteer from 'puppeteer'
import execa from 'execa'
import waitOn from 'wait-on'

import { toMatchImageSnapshot } from 'jest-image-snapshot'

beforeAll(() => {
  expect.extend({ toMatchImageSnapshot })
})

const baseUrl = 'http://localhost:3000'

describe('lottie player screenshots', () => {
  let browser
  let craProcess

  jest.setTimeout(60000)

  beforeAll(async () => {
    browser = await puppeteer.launch()
    craProcess = execa('npm start', { cwd: 'example', shell: true, env: { BROWSER: 'none' } })
    await waitOn({ resources: [baseUrl] })
  })

  async function runScreenshotTest(path) {
    const page = await browser.newPage()
    await page.setViewport({ width: 150, height: 150 })
    await page.goto(`${baseUrl}${path}`)
    await page.waitForTimeout(500) // Sometimes page is white
    const image = await page.screenshot()

    expect(image).toMatchImageSnapshot()
  }

  describe('lottie player main', () => {
    it('renders with animationData', async () => {
      await runScreenshotTest('/test/1')
    })

    it('renders with path', async () => {
      await runScreenshotTest('/test/2')
    })
  })

  describe('lottie player light', () => {
    it('renders with animationData', async () => {
      await runScreenshotTest('/test/3')
    })

    it('renders with path', async () => {
      await runScreenshotTest('/test/4')
    })
  })

  afterAll(async () => {
    await browser.close()
    craProcess.kill()
  })
})
