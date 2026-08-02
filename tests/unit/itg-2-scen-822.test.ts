import { detectDuplicateCustomersAcrossYearBoundary } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-822
  test('年の区切りを含む期間（2023年12月25日～2024年1月5日）の顧客重複・不整合検出対象レコードがすべて処理される', () => {
    const processStartDate = new Date('2023-12-25T00:00:00Z');
    const processEndDate = new Date('2024-01-05T23:59:59Z');

    const testCustomerRecords = [
      {
        customer_id: 'CUST001',
        customer_name: '太郎商事',
        email: 'taro@example.com',
        created_at: new Date('2023-12-20T10:00:00Z'),
        detection_date: new Date('2023-12-25T08:30:00Z'),
      },
      {
        customer_id: 'CUST002',
        customer_name: 'Taro Shouten',
        email: 'taro@example.com',
        created_at: new Date('2023-12-28T14:00:00Z'),
        detection_date: new Date('2023-12-31T16:45:00Z'),
      },
      {
        customer_id: 'CUST003',
        customer_name: '太郎商事',
        email: 'info@taro.jp',
        created_at: new Date('2024-01-01T09:00:00Z'),
        detection_date: new Date('2024-01-01T11:20:00Z'),
      },
      {
        customer_id: 'CUST004',
        customer_name: '花子販売',
        email: 'hanako@example.com',
        created_at: new Date('2024-01-02T13:00:00Z'),
        detection_date: new Date('2024-01-02T15:10:00Z'),
      },
      {
        customer_id: 'CUST005',
        customer_name: 'HANAKO SALES',
        email: 'hanako@example.com',
        created_at: new Date('2024-01-04T10:30:00Z'),
        detection_date: new Date('2024-01-05T12:00:00Z'),
      },
    ];

    const result = detectDuplicateCustomersAcrossYearBoundary({
      processStartDate,
      processEndDate,
      customerRecords: testCustomerRecords,
    });

    expect(result.processStartDate).toEqual(new Date('2023-12-25T00:00:00Z'));
    expect(result.processEndDate).toEqual(new Date('2024-01-05T23:59:59Z'));
    expect(result.totalProcessedRecords).toBe(5);
    expect(result.duplicateGroupsDetected).toBe(2);
    expect(result.processingLog.startDateTime).toEqual(
      new Date('2023-12-25T00:00:00Z')
    );
    expect(result.processingLog.endDateTime).toEqual(
      new Date('2024-01-05T23:59:59Z')
    );
    expect(result.processingLog.targetRecordCount).toBe(5);
    expect(result.integrationJudgmentResults.length).toBe(5);
    expect(
      result.integrationJudgmentResults.every(
        (record) =>
          record.detectionDate >= processStartDate &&
          record.detectionDate <= processEndDate
      )
    ).toBe(true);
    expect(result.crossYearBoundaryRecords.length).toBeGreaterThan(0);
    expect(result.integrationJudgmentResults[0]).toHaveProperty('customer_id');
    expect(result.integrationJudgmentResults[0]).toHaveProperty('detection_date');
    expect(result.integrationJudgmentResults[0]).toHaveProperty(
      'integration_judgment_result'
    );
  });
});