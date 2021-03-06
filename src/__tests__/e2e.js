jest.setTimeout(30000);
const puppeteer = require('puppeteer');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  port: '3001',
  password: 'example',
  database: 'cdp',
  connectionLimit: 5});

let browser; let page;

/**
 * Prepare the browser for the test
 */
async function prep() {
  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ], headless: true});
  page = await browser.newPage();
}

describe('Login user', () => {
  beforeAll(async () => {
    await prep();
    const conn = await pool.getConnection();
    await conn.query('SET FOREIGN_KEY_CHECKS = 0; ');
    await conn.query(`TRUNCATE TABLE tasks;`);
    await conn.query(`TRUNCATE TABLE issues;`);
    await conn.query(`TRUNCATE TABLE sprints;`);
    await conn.query(`TRUNCATE TABLE projects;`);
    await conn.query(`DELETE FROM users WHERE username <>'admin';`);
    conn.end();
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
    browser.close();
  });
});

describe('Project creation successful', () => {
  beforeAll(async () => {
    await prep();
    await page.goto('http://localhost:3000/home');
  });

  it('should create a project', async () => {
    await waitForPage('a#projects');
    await waitForPage('.btn');
    await page.click('input#name');
    await page.keyboard.type('Mon projet');
    await page.click('input#weeks2');
    await waitForPage('button#sendProject');
    const url = page.url();
    expect(url).toBe('http://localhost:3000/projects');
    browser.close();
  });
});

describe('Sprint creation successful', () => {
  beforeAll(async () => {
    await prep();
    await page.goto('http://localhost:3000/home');
  });

  it('should Create a sprint', async () => {
    await waitForPage('a#sprints');
    await page.click('input#name');
    await page.keyboard.type('Mon sprint');
    await page.click('input#complete');
    await page.select('#projectid', '1');
    await waitForPage('button#sendSprint');
    const url = page.url();
    expect(url).toBe('http://localhost:3000/sprint/add');
    browser.close();
  });
});

describe('Account creation successful', () => {
  beforeAll(async () => {
    await prep();
    await page.goto('http://localhost:3000/');
  });

  it('should create an account and be logged', async () => {
    await waitForPage('a#new');
    await page.click('input#name');
    await page.keyboard.type('jean');
    await page.click('input#psw');
    await page.keyboard.type('pass');
    await page.click('input#psw2');
    await page.keyboard.type('pass');
    await page.click('input#email');
    await page.keyboard.type('a@a.com');
    await waitForPage('button#sub');
    const url = page.url();
    expect(url).toBe('http://localhost:3000/home');
    browser.close();
  });
});

describe('Issue creation successful', () => {
  beforeAll(async () => {
    await prep();
    await page.goto('http://localhost:3000/home');
  });

  it('should create an issue', async () => {
    await waitForPage('a#issues');
    await page.click('input#description');
    await page.keyboard.type('desc');
    await page.click('input#difficulty');
    await page.keyboard.type('1');
    await page.click('input#state');
    await page.keyboard.type('todo');
    await page.click('input#priority');
    await page.keyboard.type('1');
    await page.select('#projectid', '1');
    await waitForPage('button#sendIssue');
    const url = page.url();
    expect(url).toBe('http://localhost:3000/issues/add');
    browser.close();
  });
});

describe('Task creation successful', () => {
  beforeAll(async () => {
    await prep();
    await page.goto('http://localhost:3000/home');
  });

  it('should create a task', async () => {
    await waitForPage('a#tasks');
    await page.click('input#name');
    await page.keyboard.type('task1');
    await page.click('input#state');
    await page.keyboard.type('TODO');
    await page.select('#userid', '1');
    await page.select('#sprintid', '1');
    await page.select('#issueid', '1');
    await waitForPage('button#sendTask');
    const url = page.url();
    expect(url).toBe('http://localhost:3000/tasks/add');
    browser.close();
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
