import { detectDuplicateSalesData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 重複検出', () => {
  // SCEN-082
  test('完全に同一の営業データを検出する', () => {
    const salesData = [
      {
        recordId: 'REC-001',
        customerId: 'CUST-12345',
        salesPersonId: 'SP-001',
        transactionAmount: 500000,
        transactionDateTime: '2024-01-15T10:30:00Z',
        productCategory: 'SoftwareService',
      },
      {
        recordId: 'REC-002',
        customerId: 'CUST-12345',
        salesPersonId: 'SP-001',
        transactionAmount: 500000,
        transactionDateTime: '2024-01-15T10:30:00Z',
        productCategory: 'SoftwareService',
      },
    ];

    const result = detectDuplicateSalesData(salesData);

    expect(result.duplicateGroups).toEqual([
      {
        groupId: 'DUP-001',
        recordIds: ['REC-001', 'REC-002'],
        duplicateScore: 100,
        matchedElements: [
          'customerId',
          'salesPersonId',
          'transactionAmount',
          'transactionDateTime',
          'productCategory',
        ],
      },
    ]);
  });
});