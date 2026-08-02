import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateDuplicateJudgmentScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複判定・統合エンジン', () => {
  // SCEN-1107
  test('データ不整合ログが存在する顧客ペアについて、不整合内容が判定スコア計算に考慮される', () => {
    const customer_pair_a = {
      customer_id_1: 'CUST-001',
      customer_id_2: 'CUST-002',
    };

    const data_inconsistency_logs = [
      {
        log_id: 'LOG-001',
        field_name: '電話番号',
        value_1: '090-1234-5678',
        value_2: '090-1234-5679',
        detected_at: '2024-01-15T10:00:00Z',
      },
    ];

    const result = calculateDuplicateJudgmentScore(
      customer_pair_a,
      data_inconsistency_logs
    );

    expect(result.duplicate_judgment_score).toBeLessThan(95);
    expect(result.duplicate_judgment_score).toBeGreaterThanOrEqual(90);
    expect(result.score_calculation_details).toContainEqual(
      expect.objectContaining({
        deduction_reason: '電話番号不整合',
        deduction_points: -4,
      })
    );
    expect(result.inconsistency_factors_applied).toBe(true);
  });
});