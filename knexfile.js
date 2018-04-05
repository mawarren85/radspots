// Update with your config settings.
module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      database: 'radspots',
      user: 'thomaspalzkill',
      password: 'password'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      host: 'ec2-54-243-213-188.compute-1.amazonaws.com',
      database: 'dc0ah2gcsj62n4',
      user:     'kbmvmblzgvdzsk',
      password: 'c71a66d59fe427ce748992bca944beeeef0cf3a57a1c3449f5f0b030411bdc4b'
    },
    pool: {
      min: 2,
      max: 10
    }
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
