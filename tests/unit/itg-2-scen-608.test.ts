import { validateQualityEngineDataset } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-608
  test('品質検証結果レポートに各データの合格/不合格ステータスが記載される', () => {
    const testDataset = [
      {
        recordId: 'REC-001',
        customerName: '顧客A',
        salesAmount: 100000,
        transactionDate: '2024-01-15',
        productCode: 'PROD-001',
      },
      {
        recordId: 'REC-002',
        customerName: '顧客B',
        salesAmount: 250000,
        transactionDate: '2024-01-20',
        productCode: 'PROD-002',
      },
      {
        recordId: 'REC-003',
        customerName: '顧客C',
        salesAmount: 50000,
        transactionDate: '2024-02-01',
        productCode: 'PROD-003',
      },
      {
        recordId: 'REC-004',
        customerName: '',
        salesAmount: 150000,
        transactionDate: '2024-02-10',
        productCode: 'PROD-004',
      },
      {
        recordId: 'REC-005',
        customerName: '顧客E',
        salesAmount: -50000,
        transactionDate: '2024-02-15',
        productCode: 'PROD-005',
      },
    ];

    const validationRules = {
      customerNameRequired: true,
      salesAmountNumeric: true,
      salesAmountNonNegative: true,
      transactionDateFormat: 'YYYY-MM-DD',
      productCodeExistsInMaster: true,
    };

    const masterProductCodes = ['PROD-001', 'PROD-002', 'PROD-003', 'PROD-004', 'PROD-005'];

    const report = validateQualityEngineDataset(
      testDataset,
      validationRules,
      masterProductCodes,
    );

    expect(report.totalRecords).toBe(5);
    expect(report.passedRecords).toBe(3);
    expect(report.failedRecords).toBe(2);

    expect(report.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          recordId: 'REC-001',
          status: 'PASS',
          failureReasons: [],
        }),
        expect.objectContaining({
          recordId: 'REC-002',
          status: 'PASS',
          failureReasons: [],
        }),
        expect.objectContaining({
          recordId: 'REC-003',
          status: 'PASS',
          failureReasons: [],
        }),
        expect.objectContaining({
          recordId: 'REC-004',
          status: 'FAIL',
          failureReasons: expect.arrayContaining(['顧客名が空白']),
        }),
        expect.objectContaining({
          recordId: 'REC-005',
          status: 'FAIL',
          failureReasons: expect.arrayContaining(['売上金額が負数']),
        }),
      ]),
    );
  });
});