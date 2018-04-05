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
      // dasdasd
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: 'ec2-54-163-240-54.compute-1.amazonaws.com',
      database: 'd6umk7tiftmv6s',
      user:     'sppvgmqyyvuzcu',
      password: '0575393ced059f2070d083014954fb9cfea91b2e07b6f0c551f358b3da79420c'
    },
    pool: {
      min: 0,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
