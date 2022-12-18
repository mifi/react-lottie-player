const execa = require('execa');
const waitOn = require('wait-on');
const { toMatchImageSnapshot } = require('jest-image-snapshot');
const detectPort = require('detect-port');

beforeAll(() => {
  expect.extend({ toMatchImageSnapshot });
});

const port = 3001;
const baseUrl = `http://localhost:${port}`;

describe('lottie player screenshots', () => {
  let craProcess;

  jest.setTimeout(60000);

  beforeAll(async () => {
    const detectedPort = await detectPort(port); // because react-scripts will ask interactive question if occupied
    if (detectedPort !== port) throw new Error('Port is in use');
    craProcess = execa('npm start', { cwd: 'example', shell: true, env: { BROWSER: 'none', PORT: port, CI: 'true' }, stderr: 'inherit', stdout: 'inherit' });
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

  afterAll(() => {
    craProcess?.kill?.('SIGINT'); // todo doesn't seem to work
  });
});
