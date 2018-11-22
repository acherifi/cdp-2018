jest.setTimeout(30000);

describe('Login user', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000');
  });

  it('should log the user correctly', async () => {
    await page.click('input#name');
    await page.keyboard.type('admin');
    await page.click('input#psw');
    await page.keyboard.type('pass');
    await waitForPage('button#sub');
    const url = page.url();
    expect(url).toBe('http://localhost:3000/home');
  });
});

describe('Project creation successful', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/home');
  });

  it('should log the user correctly', async () => {
    await waitForPage('a#createProject');
    await page.click('input#name');
    await page.keyboard.type('Mon projet');
    await waitForPage('button#sendProject');
    const url = page.url();
    expect(url).toBe('http://localhost:3000/project/add');
  });
});

describe('Sprint creation successful', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/home');
  });

  it('should log the user correctly', async () => {
    await waitForPage('a#createSprint');
    await page.click('input#name');
    await page.keyboard.type('Mon sprint');
    await page.click('input#projectId');
    await page.keyboard.type('1');
    await waitForPage('button#sendSprint');
    const url = page.url();
    expect(url).toBe('http://localhost:3000/sprint/add');
  });
});

/**
 * Click on a page element that redirects and wait for the
 * redirection to be completed.
 * @param {string} domElement
 */
async function waitForPage(domElement) {
  return Promise.all([
    page.click(domElement),
    page.waitForNavigation({waitUntil: 'load'}),
    page.waitForNavigation({waitUntil: 'networkidle0'}),
  ]);
}
