export default () => {
  let nodeEnv = process.env.NODE_ENV || 'development';
  let runMigrations = process.env.RUN_MIGRATIONS ? process.env.RUN_MIGRATIONS : false;
  let app = {
    port: parseInt(process.env.APP_PORT_INTERNAL || '3000', 10),
  };
  let mongo = {
    host: process.env.MONGO_HOST || 'localhost',
    port: parseInt(process.env.MONGO_PORT_INTERNAL || '27017', 10),
    username: process.env.MONGO_INITDB_ROOT_USERNAME || 'root',
    password: process.env.MONGO_INITDB_ROOT_PASSWORD || 'example',
    database: process.env.MONGO_DATABASE || 'nest_test',
    connectionString: process.env.DATABASE_URL || '',
    authSource: 'admin',
  };
  return {
    nodeEnv,
    runMigrations,
    app,
    mongo,
  };
};