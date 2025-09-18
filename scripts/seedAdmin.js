// Usage:
//   MONGODB_URI="your_uri" MONGODB_DB="furniture" node scripts/seedAdmin.js admin@example.com mypassword
// The script will create/update an admin with plaintext password (temporary for development).

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const crypto = require("crypto");
require("dotenv").config({
  path: fs.existsSync(path.resolve(process.cwd(), ".env.local"))
    ? ".env.local"
    : ".env",
});

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    console.error(
      "Provide email and password: node scripts/seedAdmin.js <email> <password>"
    );
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "furniture";
  if (!uri) {
    console.error("MONGODB_URI is required in env (.env.local or .env)");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const admins = db.collection("admins");

    const existing = await admins.findOne({ email });
    if (existing) {
      await admins.updateOne(
        { _id: existing._id },
        { $set: { password: hash(password) } }
      );
      console.log(`Updated admin ${email}`);
    } else {
      await admins.insertOne({
        email,
        password: hash(password),
        createdAt: new Date(),
      });
      console.log(`Created admin ${email}`);
    }
  } catch (err) {
    console.error("Failed:", err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

function hash(pw) {
  const secret = process.env.SESSION_SECRET || "dev-secret-change-me";
  return crypto
    .createHash("sha256")
    .update(pw + secret)
    .digest("hex");
}

main();
