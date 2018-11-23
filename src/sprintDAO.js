const pool = require('./databaseDAO').pool;
const table = 'sprints';
const columns = 'name_sprint, state_sprint, id_project';

/**
 * Register a project into the database.
 * @param {string} nameSprint Names of the sprint.
 * @param {string} stateSprint Sprint state.
 * @param {int} idProject sprint's project id.
 */
async function createSprint(nameSprint, stateSprint, idProject) {
  const conn = await pool.getConnection();
  const rows = await conn.query(`SELECT * FROM projects WHERE id_project="${idProject}"`);
  if (rows[0] === undefined) {
    return false;
  }
  await conn.query(`INSERT INTO ${table} (${columns}) VALUES ('${nameSprint}', '${stateSprint}', '${idProject}');`);
  return true;
};

module.exports = {
  createSprint: createSprint,
};
