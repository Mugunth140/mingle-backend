import { User } from 'src/user/entity/user.entity';

export const databaseConfig = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User],
  synchronize: true,
  logging: true,
  migrations: ['src/database/migration/*.ts'],
};
