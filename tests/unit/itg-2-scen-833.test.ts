import { extractFailurePatterns } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-833
  test('行動ログデータが1件のとき、失敗パターン抽出が1件の結果で返される', () => {
    const behavioral_logs = [
      {
        employee_id: 'EMP001',
        activity_type: '初回訪問',
        result: '失敗',
        failure_reason: '顧客都合',
        timestamp: '2024-01-15T10:30:00Z'
      }
    ];

    const result = extractFailurePatterns(behavioral_logs);

    expect(result).toHaveLength(1);
    expect(result[0].failure_pattern_id).toBe('FAIL_PATTERN_001');
    expect(result[0].activity_type).toBe('初回訪問');
    expect(result[0].failure_reason).toBe('顧客都合');
    expect(result[0].occurrence_count).toBe(1);
    expect(result[0].employee_id).toBe('EMP001');
  });
});