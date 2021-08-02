import puppeteer from 'puppeteer'
import execa from 'execa'
import waitOn from 'wait-on'

import { toMatchImageSnapshot } from 'jest-image-snapshot'

beforeAll(() => {
  expect.extend({ toMatchImageSnapshot })
})

const baseUrl = 'http://localhost:3000'

describe('lottie player light screenshots', () => {
  let browser
  let craProcess

  jest.setTimeout(60000)

  beforeAll(async () => {
    browser = await puppeteer.launch()
    craProcess = execa('npm start', { cwd: 'example', shell: true, env: { BROWSER: 'none' } })
    await waitOn({ resources: [baseUrl] })
  })

  it('renders with animationData', async () => {
    const page = await browser.newPage()
    await page.setViewport({ width: 150, height: 150 })
    await page.goto(`${baseUrl}/test/3`)
    await page.waitForTimeout(500) // Sometimes page is white
    const image = await page.screenshot()

    expect(image).toMatchImageSnapshot()
  })

  it('renders with path', async () => {
    const page = await browser.newPage()
    await page.setViewport({ width: 150, height: 150 })
    await page.goto(`${baseUrl}/test/4`)
    await page.waitForTimeout(500) // Sometimes page is white
    const image = await page.screenshot()

    expect(image).toMatchImageSnapshot()
  })

  afterAll(async () => {
    await browser.close()
    craProcess.kill()
  })
})
