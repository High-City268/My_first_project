// Database abstraction layer for local (SQLite) and production (PostgreSQL) use
const isLocal = !process.env.DATABASE_URL;

let db;

if (isLocal) {
  // Use SQLite for local development
  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  const dbPath = path.join(process.cwd(), 'meep.db');
  db = new sqlite3.Database(dbPath);
  
  db.runAsync = function(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.run(sql, params, function(err) {
        if (err) return reject(err);
        resolve(this);
      });
    });
  };
  
  db.allAsync = function(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  };
  
  db.getAsync = function(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  };
} else {
  // Use PostgreSQL for production (Vercel)
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  db = {
    runAsync: async (sql, params = []) => {
      const client = await pool.connect();
      try {
        return await client.query(sql, params);
      } finally {
        client.release();
      }
    },
    allAsync: async (sql, params = []) => {
      const client = await pool.connect();
      try {
        const result = await client.query(sql, params);
        return result.rows;
      } finally {
        client.release();
      }
    },
    getAsync: async (sql, params = []) => {
      const client = await pool.connect();
      try {
        const result = await client.query(sql, params);
        return result.rows[0];
      } finally {
        client.release();
      }
    }
  };
}

module.exports = db;
