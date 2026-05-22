import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
const bootstrap = async () => {
    await connectDatabase();
    const app = createApp();
    app.listen(env.port, () => {
        console.log(`GigFlow backend running on port ${env.port}`);
    });
};
void bootstrap();
