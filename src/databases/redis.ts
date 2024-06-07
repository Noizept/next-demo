import Redis from 'ioredis';

let redis: Redis = new Redis(process.env.REDIS_URL!);

export default redis;
