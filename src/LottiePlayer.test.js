// eslint-disable-next-line @typescript-eslint/no-var-requires
const execa = require('execa');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { toMatchImageSnapshot } = require('jest-image-snapshot');

beforeAll(() => {
  expect.extend({ toMatchImageSnapshot });
});

const port = 5173;
const baseUrl = `http://localhost:${port}`;

// `wait-on` doesn't seem to work on github actions https://github.com/jeffbski/wait-on/issues/86
// also https://github.com/jeffbski/wait-on/issues/78
async function waitOnPort() {
  // eslint-disable-next-line import/no-unresolved
  const { got } = await import('got');
  for (;;) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await got(`${baseUrl}/`, { headers: { accept: 'text/html' } });
      return;
    // eslint-disable-next-line unicorn/prefer-optional-catch-binding
    } catch (err) {
      // console.error(err.message);
      // retry
      // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
}

describe('lottie player screenshots', () => {
  let viteProcess;

  jest.setTimeout(60000);

  beforeAll(async () => {
    viteProcess = execa('vite', { cwd: 'example', stderr: 'inherit', stdout: 'inherit' });
    await Promise.race([
      viteProcess,
      waitOnPort(),
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
    viteProcess?.kill?.('SIGINT');
    await viteProcess.catch(() => undefined);
  });
});
