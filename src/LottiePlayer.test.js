const execa = require('execa');
const { toMatchImageSnapshot } = require('jest-image-snapshot');
const detectPort = require('detect-port');

beforeAll(() => {
  expect.extend({ toMatchImageSnapshot });
});

const port = 3001;
const baseUrl = `http://localhost:${port}`;

// `wait-on` doesn't seem to work on github actions https://github.com/jeffbski/wait-on/issues/86
async function waitOnPort() {
  // eslint-disable-next-line import/no-unresolved
  const { got } = await import('got');
  for (;;) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await got(`http://localhost:${port}/`);
      return;
    } catch (err) {
      console.error(err);
      // retry
      // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
}

describe('lottie player screenshots', () => {
  let craProcess;

  jest.setTimeout(60000);

  beforeAll(async () => {
    const detectedPort = await detectPort(port); // because react-scripts will ask interactive question if occupied
    if (detectedPort !== port) throw new Error('Port is in use');
    craProcess = execa('npm start', { cwd: 'example', shell: true, env: { BROWSER: 'none', PORT: port, CI: 'true' }, stderr: 'inherit', stdout: 'inherit' });
    await Promise.race([
      craProcess,
      waitOnPort(port),
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
