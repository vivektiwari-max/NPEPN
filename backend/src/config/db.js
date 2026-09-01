const { Pool } = require("pg");
const config = require("./config");

const pool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.database,
  password: config.database.password,
  port: config.database.port,
});

pool
  .connect()
  .then(() => {
    console.log("✅ PostgreSQL connected successfully!");
  })
  .catch((error) => {
    console.error("❌ PostgreSQL connection failed:", error.message);
    process.exit(1);
  });

// Handle connection errors
pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
});

module.exports = pool;
