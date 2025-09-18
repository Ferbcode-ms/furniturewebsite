import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
if (!uri) {
  // Intentionally not throwing to avoid crashing dev; APIs will 500 with clear message
  // when connection is attempted without proper env.
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (client) return client;
  if (clientPromise) return clientPromise;
  client = new MongoClient(uri);
  clientPromise = client.connect();
  await clientPromise;
  return client as MongoClient;
}

export async function getDb(dbName = process.env.MONGODB_DB || "furniture") {
  const cli = await getMongoClient();
  return cli.db(dbName);
}
