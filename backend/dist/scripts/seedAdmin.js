import { connectDatabase } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
const seedAdmin = async () => {
    await connectDatabase();
    const existingAdmin = await User.findOne({ email: env.admin.email });
    if (existingAdmin) {
        console.log('Admin user already exists');
        process.exit(0);
    }
    await User.create({
        name: env.admin.name,
        email: env.admin.email,
        password: env.admin.password,
        role: 'Admin',
    });
    console.log('Admin user created');
    process.exit(0);
};
void seedAdmin();
