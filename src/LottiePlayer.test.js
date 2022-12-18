const execa = require('execa');
const waitOn = require('wait-on');
const { toMatchImageSnapshot } = require('jest-image-snapshot');

beforeAll(() => {
  expect.extend({ toMatchImageSnapshot });
});

const baseUrl = 'http://localhost:3000';

describe('lottie player screenshots', () => {
  let craProcess;

  jest.setTimeout(60000);

  beforeAll(async () => {
    craProcess = execa('npm start', { cwd: 'example', shell: true, env: { BROWSER: 'none' } });
    await Promise.race([
      craProcess,
      waitOn({ resources: [baseUrl] }),
    ]);
  });

  beforeEach(async () => {
    await global.jestPuppeteer.resetPage();
  });

  async function runScreenshotTest(path) {
    await global.page.setViewport({ width: 150, height: 150 });
    await global.page.goto(`${baseUrl}${path}`);
    await global.page.waitForTimeout(500); // Sometimes global.page is white
    const image = await global.page.screenshot();

    expect(image).toMatchImageSnapshot();
  }

  describe('lottie player main', () => {
    it('renders with animationData', async () => {
      await runScreenshotTest('/test/1');
    });

    it('renders with path', async () => {
      await runScreenshotTest('/test/2');
    });
  });

  describe('lottie player light', () => {
    it('renders with animationData', async () => {
      await runScreenshotTest('/test/3');
    });

    it('renders with path', async () => {
      await runScreenshotTest('/test/4');
    });
  });

  afterAll(async () => {
    craProcess.kill();
  });
});
