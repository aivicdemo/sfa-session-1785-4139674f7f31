import { detectDataQualityIssues } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-1198
  test('不整合エラーの件数が2件の場合、件数が正確に集計される', () => {
    const inconsistencyErrors = [
      {
        id: 'error_001',
        type: 'inconsistency',
        field: 'customer_name',
        description: '顧客名が重複レコード間で不一致',
        severity: 'high',
        timestamp: '2024-01-15T10:30:00Z',
      },
      {
        id: 'error_002',
        type: 'inconsistency',
        field: 'contact_phone',
        description: '電話番号形式が統一されていない',
        severity: 'medium',
        timestamp: '2024-01-15T10:31:00Z',
      },
    ];

    const result = detectDataQualityIssues(inconsistencyErrors);

    expect(result.inconsistency_count).toBe(2);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'error_001',
          type: 'inconsistency',
        }),
        expect.objectContaining({
          id: 'error_002',
          type: 'inconsistency',
        }),
      ])
    );
    expect(result.issues.length).toBe(2);
    expect(result.pattern_summary).toEqual(
      expect.objectContaining({
        inconsistency_errors: 2,
      })
    );
  });
});