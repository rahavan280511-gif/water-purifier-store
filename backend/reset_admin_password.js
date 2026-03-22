const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const resetPassword = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB. Resetting admin password...");
        
        const username = 'admin';
        const newPassword = 'admin123';
        
        const user = await User.findOne({ username });
        if (!user) {
            console.error("Admin user not found!");
            process.exit(1);
        }
        
        user.password = newPassword;
        await user.save();
        
        console.log(`Password for user '${username}' has been reset to '${newPassword}'.`);
        process.exit(0);
    } catch (err) {
        console.error("Error resetting password:", err);
        process.exit(1);
    }
};

resetPassword();
