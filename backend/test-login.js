const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const username = 'admin';
        const passwordToTest = 'admin123';
        
        const user = await User.findOne({ username });
        if (!user) {
            console.log("User not found in DB");
            process.exit(1);
        }
        
        console.log("User found. Hashed password in DB:", user.password);
        const isMatch = await bcrypt.compare(passwordToTest, user.password);
        console.log("Password match result:", isMatch);
        
        // Also test the schema method
        const isMatchMethod = await user.comparePassword(passwordToTest);
        console.log("Schema method match result:", isMatchMethod);
        
        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
};

testLogin();
