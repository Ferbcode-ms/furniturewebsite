const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error(
    "MONGODB_URI not found in environment variables. Please set it in .env.local or .env"
  );
  console.log("Example: MONGODB_URI=mongodb://localhost:27017/furniture");
  process.exit(1);
}

async function createIndexes() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    console.log("Creating MongoDB indexes...");

    // Products collection indexes
    await db.collection("products").createIndex({ category: 1 });
    console.log("✓ Created index on products.category");

    await db.collection("products").createIndex({ tags: 1 });
    console.log("✓ Created index on products.tags");

    await db.collection("products").createIndex({ createdAt: -1 });
    console.log("✓ Created index on products.createdAt");

    // Compound index for common queries
    await db.collection("products").createIndex({ category: 1, createdAt: -1 });
    console.log("✓ Created compound index on products.category + createdAt");

    // Categories collection indexes
    await db
      .collection("categories")
      .createIndex({ name: 1 }, { unique: true });
    console.log("✓ Created unique index on categories.name");

    // Orders collection indexes
    await db.collection("orders").createIndex({ status: 1 });
    console.log("✓ Created index on orders.status");

    await db.collection("orders").createIndex({ createdAt: -1 });
    console.log("✓ Created index on orders.createdAt");

    // Compound index for order filtering
    await db.collection("orders").createIndex({ status: 1, createdAt: -1 });
    console.log("✓ Created compound index on orders.status + createdAt");

    console.log("\nAll indexes created successfully!");
  } catch (error) {
    console.error("Error creating indexes:", error);
  } finally {
    await client.close();
  }
}

createIndexes();
