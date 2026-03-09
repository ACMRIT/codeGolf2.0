import { MongoClient, MongoClientOptions } from "mongodb";

const options: MongoClientOptions = {
  maxPoolSize: 5,
};

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  const uri = process.env.MONGODB_URI;

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }

  return globalWithMongo._mongoClientPromise!;
}

export default getClientPromise;
