const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const User = require('./backend/models/User');

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        const users = await User.find({}, { password: 0 }); // Don't show password hashes
        console.log("Users in database:");
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error("Error checking users:", err);
        process.exit(1);
    }
};

checkUsers();
