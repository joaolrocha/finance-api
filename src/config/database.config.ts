import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => {
  const port = parseInt(process.env.DATABASE_PORT || '5432', 10);

  console.log('Database config:', {
    host: process.env.DATABASE_HOST || 'localhost',
    port: port,
    username: process.env.DATABASE_USER || 'admin',
    database: process.env.DATABASE_NAME || 'finance_db',
    portType: typeof port,
  });

  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: port,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: true,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
  };
});
