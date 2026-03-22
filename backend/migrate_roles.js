const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const migrate = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected. Updating user roles...");
        const result = await User.updateMany({ role: { $exists: false } }, { $set: { role: 'admin' } });
        console.log(`Update complete. Matched ${result.matchedCount || 0} and modified ${result.modifiedCount || 0} users.`);
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
};

migrate();
