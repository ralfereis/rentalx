import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (host = 'localhost'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();
  return createConnection(
    Object.assign(defaultOptions, {
      // process.env.NODE_ENV === 'test' ? 'localhost' : host
      host,
      database:
        process.env.NODE_ENV === 'test'
          ? 'rentalx_test'
          : defaultOptions.database,
    }),
  );
};
