// Fixture app: talks to its own compose-declared Postgres on every request.
const { Client } = require('pg');
const http = require('node:http');
const server = http.createServer(async (req, res) => {
  try {
    const c = new Client({ connectionString: process.env.DATABASE_URL });
    await c.connect();
    // Insert and read back: proves the app really writes to the database.
    await c.query("CREATE TABLE IF NOT EXISTS hits (id bigserial, at timestamptz default now())");
    await c.query("INSERT INTO hits DEFAULT VALUES");
    const n = await c.query("SELECT count(*) AS n FROM hits");
    await c.end();
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ db: 'postgres', hits: n.rows[0].n }));
  } catch (e) {
    res.writeHead(500); res.end('db error: ' + e.message);
  }
});
server.listen(3000, () => console.log('app with db on 3000'));
