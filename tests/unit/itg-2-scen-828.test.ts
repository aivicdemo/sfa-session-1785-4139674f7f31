import { detectDuplicateAndMergeDecision } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-828: 統合判定結果が「統合可」の場合、統合判定履歴に「実行待機」が記録される', () => {
    const input = {
      customer_id_1: 'CUST001',
      customer_id_2: 'CUST002',
      duplicate_detection_rule_id: 'RULE_DUP_001',
      normalization_rule_id: 'RULE_NORM_001',
      detected_duplicates: [
        {
          field_name: 'customer_name',
          value_1: '株式会社テスト',
          value_2: '株式会社テスト',
          match_score: 1.0,
        },
        {
          field_name: 'phone_number',
          value_1: '03-1234-5678',
          value_2: '03-1234-5678',
          match_score: 1.0,
        },
      ],
      integration_approval_status: 'approved',
    };

    const result = detectDuplicateAndMergeDecision(input);

    expect(result).toHaveProperty('merge_decision_history');
    expect(result.merge_decision_history).toHaveProperty('merge_decision_id');
    expect(result.merge_decision_history.merge_decision_id).toMatch(/^[A-Z0-9_]+$/);
    expect(result.merge_decision_history).toHaveProperty('merge_status');
    expect(result.merge_decision_history.merge_status).toBe('実行待機');
    expect(result.merge_decision_history).toHaveProperty('customer_id_1');
    expect(result.merge_decision_history.customer_id_1).toBe('CUST001');
    expect(result.merge_decision_history).toHaveProperty('customer_id_2');
    expect(result.merge_decision_history.customer_id_2).toBe('CUST002');
    expect(result.merge_decision_history).toHaveProperty('decision_timestamp');
    expect(typeof result.merge_decision_history.decision_timestamp).toBe('string');
    expect(result.merge_decision_history).toHaveProperty('duplicate_detection_rule_id');
    expect(result.merge_decision_history.duplicate_detection_rule_id).toBe('RULE_DUP_001');
    expect(result.merge_decision_history).toHaveProperty('normalization_rule_id');
    expect(result.merge_decision_history.normalization_rule_id).toBe('RULE_NORM_001');
    expect(result.merge_decision_history).toHaveProperty('merge_result');
    expect(result.merge_decision_history.merge_result).toBe('統合可');
    expect(result).toHaveProperty('integration_decision_confirmed');
    expect(result.integration_decision_confirmed).toBe(true);
  });
});