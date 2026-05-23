import mongoose, { Connection } from 'mongoose';

let cached: { conn: Connection | null; promise: Promise<Connection> | null } = {
  conn: null,
  promise: null,
};

export async function connectDB(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }

    cached.promise = mongoose
      .connect(mongoUri)
      .then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
