import dotenv from 'dotenv';
dotenv.config();
const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];
for (const variableName of requiredEnv) {
    if (!process.env[variableName]) {
        throw new Error(`${variableName} is not defined`);
    }
}
export const env = {
    port: Number.parseInt(process.env.PORT ?? '5000', 10),
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    clientUrl: process.env.CLIENT_URL,
    admin: {
        email: process.env.ADMIN_EMAIL ?? 'admin@gigflow.com',
        password: process.env.ADMIN_PASSWORD ?? 'Admin12345!',
        name: process.env.ADMIN_NAME ?? 'GigFlow Admin',
    },
};
