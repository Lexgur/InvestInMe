import {getPool} from '../../middleware/databaseConnection.js';
import testConfig from '../../../config/testConfig.js';

let testPool;

beforeAll(() => {
  testPool = getPool(testConfig.db);
});

afterAll(async () => {
  await testPool.end();
});

// Test case to check if the database connection is established and a simple query can be executed

describe('MySQL Database Connection', () => {
  it('should connect and run a simple query', async () => {
    const [rows] = await testPool.query('SELECT 1 + 1 AS result');
    expect(rows[0].result).toBe(2);
  });
});

//Test for an invalid query

describe('MySQL Database Connection', () => {
  it('should throw an error on invalid query', async () => {
    try {
      await testPool.query('SELECT * FROM non_existing_table');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.code).toBe('ER_NO_SUCH_TABLE'); // MySQL error for a non-existing table
    }
  });
});

//Test for multilple queries

describe('MySQL Database Connection', () => {
  it('should handle multiple queries', async () => {
    const [rows1] = await testPool.query('SELECT 1 + 1 AS result');
    const [rows2] = await testPool.query('SELECT 2 + 2 AS result');
    expect(rows1[0].result).toBe(2);
    expect(rows2[0].result).toBe(4);
  });
});