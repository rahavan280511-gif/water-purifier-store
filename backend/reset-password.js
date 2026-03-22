const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const reset = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        
        const username = 'admin';
        const newPassword = 'admin123';
        
        console.log(`Resetting password for user: ${username}...`);
        
        const user = await User.findOne({ username });
        if (!user) {
            console.error(`User ${username} not found.`);
            process.exit(1);
        }
        
        user.password = newPassword;
        await user.save();
        
        console.log(`Password reset successfully for ${username}. New password is: ${newPassword}`);
        process.exit(0);
    } catch (err) {
        console.error("Reset failed:", err);
        process.exit(1);
    }
};

reset();
