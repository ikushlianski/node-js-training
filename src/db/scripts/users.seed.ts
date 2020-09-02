import { sequelizeConnection } from '../connection';
import { TableNames } from '../constants';

sequelizeConnection
  .sync({ force: process.env.SEQUELIZE_FORCE_SYNC === 'true' })
  .then(async () => {
    await sequelizeConnection.query(`
      create extension if not exists "uuid-ossp";
    `);

    await sequelizeConnection.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        login varchar(250) not null,
        password varchar(250) not null,
        age smallint not null,
        is_deleted boolean DEFAULT false NOT NULL
      )
    `);

    await sequelizeConnection.query(`
  INSERT INTO ${TableNames.USERS}
  VALUES
  (uuid_generate_v4(), 'robertA', 'secret44', 25),
  (uuid_generate_v4(), 'robertWilliams355', 'qwerty33', 30),
  (uuid_generate_v4(), 'robertZ90', 'seCreT;123456', 19)
`);
  });
