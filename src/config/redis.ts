import { createClient } from 'redis';
import config from '.';

const redisClient = createClient({
    username: 'default',
    password: config.REDIS_PASSWORD,
    socket: {
        host: config.REDIS_HOST,
        port: Number(config.REDIS_PORT),
    }
});

export default redisClient;
