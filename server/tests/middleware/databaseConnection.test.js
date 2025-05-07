import {getPool} from '../../middleware/databaseConnection.js';
import testConfig from '../../../config/testConfig.js';

let testPool;

beforeAll(() => {
  testPool = getPool(testConfig.db);
});

afterAll(async () => {
  await testPool.end();
});

describe('MySQL Database Connection', () => {
  it('should connect and run a simple query', async () => {
    const [rows] = await testPool.query('SELECT 1 + 1 AS result');
    expect(rows[0].result).toBe(2);
  });
});
  