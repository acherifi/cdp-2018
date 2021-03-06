let pool = require('./databaseDAO').pool;

/**
 * Create a new user.
 * @param {string} name The username
 * @param {string} psw The password of the user
 * @param {string} mail The email address of the user
 */
async function createUser(name, psw, mail) {
  const conn = await pool.getConnection();
  await conn.query(`INSERT INTO users(username, password, email) VALUE ('${name}', '${psw}', '${mail}')`);
  conn.end();
}
/**
 * Log the user into the app
 * @param {string} name The username.
 * @param {string} pass the password.
 * @return {boolean} true if user is connected.
 */
async function logUser(name, pass) {
  const conn = await pool.getConnection();
  const rows = await conn.query(`SELECT * FROM users where username='${name}'`);
  conn.end();
  return verifyCredentials(rows, name, pass);
}

/**
 * Verify that the provided credentials are correct.
 * @param {object} rows Row extracted from database.
 * @param {string} name The username.
 * @param {string} pass the password.
 * @return {boolean} true if the credentials are correct else otherwise.
 */
function verifyCredentials(rows, name, pass) {
  if (rows[0] !== undefined && rows[0].username === name && rows[0].password === pass) {
    return true;
  }
  return false;
}

/**
 * Verify that the account name doesn't exists in the Data Base
 * @param {string} accountName name of the account te user wants
 * @return {boolean} true if the user exists false otherwise.
 */
async function userAlreadyExists(accountName) {
  const conn = await pool.getConnection();
  const rows = await conn.query(`SELECT username FROM users where username = '${accountName}'`);
  conn.end();
  if (rows[0] === undefined) {
    return false;
  }
  return true;
}

/**
 * Verify that the account name doesn't exists in the Data Base
 * @param {string} accountName name of the account te user wants
 * @return {boolean} true if the user exists false otherwise.
 */
async function getUsers() {
  const conn = await pool.getConnection();
  const rows = await conn.query(`SELECT * FROM users`);
  conn.end();
  if (rows[0] === undefined) {
    return false;
  }
  return rows;
}

/**
 * Parse the rawdata from the database and returns a simpler JSON array.
 * @param {JSON[]} users raw array of users coming fromt the DB.
 * @return {JSON[]} a simpler array with only two fields id and name.
 */
function toSimplerObject(users) {
  const parsedProjects = [];
  for (let i = 0; i < users.length; i++) {
    const project = {
      id: users[i].id,
      name: users[i].username,
    };
    parsedProjects.push(project);
  }
  return parsedProjects;
}

/**
 * Overrides the default pool.
 * Used for testing puposes
 * @param {Pool} newpool the new pool to be used
 */
function setPool(newpool) {
  pool = newpool;
}

module.exports = {
  userAlreadyExists: userAlreadyExists,
  createUser: createUser,
  logUser: logUser,
  verifyCredentials: verifyCredentials,
  setPool: setPool,
  getUsers: getUsers,
  toSimplerObject: toSimplerObject,
};
