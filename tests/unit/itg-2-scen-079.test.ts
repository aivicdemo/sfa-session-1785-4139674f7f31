import { validateMultipleRecords } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-079
  test('営業データが複数件の場合、全件に対する検証を実行する', async () => {
    const testData = [
      {
        recordId: 'REC001',
        salesEmployeeId: 'EMP001',
        revenue: 150000,
        customerName: '株式会社ABC',
      },
      {
        recordId: 'REC002',
        salesEmployeeId: 'EMP002',
        revenue: 250000,
        customerName: '株式会社DEF',
      },
      {
        recordId: 'REC003',
        salesEmployeeId: 'EMP003',
        revenue: 320000,
        customerName: '株式会社GHI',
      },
    ];

    const validationResults = await validateMultipleRecords(testData);

    expect(validationResults).toHaveLength(3);

    expect(validationResults[0]).toEqual({
      recordId: 'REC001',
      status: 'valid',
      errors: [],
    });

    expect(validationResults[1]).toEqual({
      recordId: 'REC002',
      status: 'valid',
      errors: [],
    });

    expect(validationResults[2]).toEqual({
      recordId: 'REC003',
      status: 'valid',
      errors: [],
    });

    validationResults.forEach((result) => {
      expect(result).toHaveProperty('recordId');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('errors');
      expect(['valid', 'invalid']).toContain(result.status);
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });
});