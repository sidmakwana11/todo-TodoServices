const db = require('mern-db-layer');

const connectDB = async () => {
  await db.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB (todo-service)");
};

module.exports = connectDB;
