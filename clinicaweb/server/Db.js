const { Pool } = require('pg');

class Db {
  constructor() {
    this.pool = new Pool({
      database: 'clinicawebII',
      user: 'postgres',
      password: 'DanielPC',
      host: 'localhost',
      port: 5432,
      ssl: false,
      max: 20,
      idleTimeoutMillis: 1000,
      connectionTimeoutMillis: 1000,
      maxUses: 7500,
    });
  }

  async execute(query, params) {
    let client;
    try {
      client = await this.pool.connect();
      return await client.query(query, params);
    } catch (error) {
      console.error('Se detectó el siguiente error en la Base de Datos:', error.message);
      return null;
    } finally {
      if (client) client.release();
    }
  }
}

module.exports = Db;
