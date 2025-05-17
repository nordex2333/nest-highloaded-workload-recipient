export default () => {
    console.log('Environment JWT_SECRET:', process.env.JWT_SECRET); // Debug log
    return {
      nodeEnv: process.env.NODE_ENV || 'development',
      app: {
        port: parseInt(process.env.APP_PORT_INTERNAL || '3000', 10),
      },
      mongo: {
        host: process.env.MONGO_HOST || 'localhost',
        port: parseInt(process.env.MONGO_PORT_INTERNAL || '27017', 10),
        username: process.env.MONGO_INITDB_ROOT_USERNAME || 'root',
        password: process.env.MONGO_INITDB_ROOT_PASSWORD || 'example',
        database: process.env.MONGO_DATABASE || 'nest_test',
        connectionString: process.env.DATABASE_URL || '',
      },
    };
  };