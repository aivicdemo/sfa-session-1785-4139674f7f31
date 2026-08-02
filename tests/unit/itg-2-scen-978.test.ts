import { evaluateMultipleDuplicateCandidates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-978
  test('購買結果記録・営業データ統合機能 - 顧客の重複候補が複数件存在する場合に全ての統合判定が考慮される', () => {
    const duplicate_candidate_1 = {
      duplicate_candidate_id: 'dup_001',
      customer_master_id_1: 'cust_100',
      customer_master_id_2: 'cust_101',
      merge_flag: 1,
      created_at: new Date('2024-01-15T10:00:00Z'),
      updated_at: new Date('2024-01-15T10:00:00Z'),
    };

    const duplicate_candidate_2 = {
      duplicate_candidate_id: 'dup_002',
      customer_master_id_1: 'cust_100',
      customer_master_id_2: 'cust_102',
      merge_flag: 0,
      created_at: new Date('2024-01-15T10:05:00Z'),
      updated_at: new Date('2024-01-15T10:05:00Z'),
    };

    const duplicate_candidate_3 = {
      duplicate_candidate_id: 'dup_003',
      customer_master_id_1: 'cust_100',
      customer_master_id_2: 'cust_103',
      merge_flag: 1,
      created_at: new Date('2024-01-15T10:10:00Z'),
      updated_at: new Date('2024-01-15T10:10:00Z'),
    };

    const result = evaluateMultipleDuplicateCandidates([
      duplicate_candidate_1,
      duplicate_candidate_2,
      duplicate_candidate_3,
    ]);

    expect(result.total_candidates_evaluated).toBe(3);
    expect(result.merge_target_count).toBe(2);
    expect(result.exclude_from_merge_count).toBe(1);
    expect(result.merge_targets).toEqual(['dup_001', 'dup_003']);
    expect(result.excluded_candidates).toEqual(['dup_002']);
    expect(result.integration_decision_reflected).toBe(true);
    expect(result.evaluation_status).toBe('completed');
  });
});