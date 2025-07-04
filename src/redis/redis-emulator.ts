import { TransactionType } from '../transaction-api/transaction.entity';
import Redis from 'ioredis';
import configuration from '../config/configuration';

let redisConfig = configuration().redis;
let redisSubscriber = new Redis({ host: redisConfig.host, port: redisConfig.port });
let redisPublisher = new Redis({ host: redisConfig.host, port: redisConfig.port });
let RATE_LIMIT = redisConfig.rateLimit;
let callCount = 0;
let lastReset = Date.now();

const PERSON_COUNT = 20;
const userIds = Array.from({ length: PERSON_COUNT }, () => {
  const hex = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `USR-${hex}`;
});

function randomAmount(min = 1, max = 100) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomUserId() {
  return userIds[Math.floor(Math.random() * userIds.length)];
}

function randomTransactionType() {
  const types = [TransactionType.EARNED, TransactionType.SPENT, TransactionType.PAYOUT];
  return types[Math.floor(Math.random() * types.length)];
}

function generateUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateTransaction() {
  return {
    id: generateUUIDv4(),
    userId: randomUserId(),
    createdAt: new Date(),
    type: randomTransactionType(),
    amount: randomAmount(),
  };
}

async function emulateRemoteApiCall() {
  if (Date.now() - lastReset > 60 * 1000) {
    callCount = 0;
    lastReset = Date.now();
  }
  if (callCount >= RATE_LIMIT) {
    throw new Error('Rate limit exceeded');
  }
  callCount++;
  // emulate remote api delay
  await new Promise((res) => setTimeout(res, 500));
  // return array of transactions (like seed.ts structure)
  let count = Math.floor(Math.random() * 11) + 10; // 10 to 20
  return Array.from({ length: count }, generateTransaction);
}

dispatch();
function dispatch() {
  redisSubscriber.setMaxListeners(30); // added max listeners to avoid warnings
  redisSubscriber.subscribe('transaction:fetch', (err) => {
    if (err) console.error('Redis subscribe error:', err);
  });
  redisSubscriber.on('message', async (channel, message) => {
    if (channel === 'transaction:fetch') {
      try {
        let data = await emulateRemoteApiCall();
        await redisPublisher.publish('transaction:response', JSON.stringify(data));
      } catch (e) {
        await redisPublisher.publish('transaction:response', JSON.stringify({ error: e.message }));
      }
    }
  });
  console.log('Redis API emulator running.');
}
