import { detectDuplicateCustomers, mergeCustomerRecords } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-390
  test('[normal] 顧客データ重複検出と統合判定機能 - 重複候補に対して正規化ルールを適用し、統合判定が実行される', () => {
    // 重複候補レコードの準備
    const recordA = {
      customer_id: 'cust_001',
      customer_name: 'ヤマダ　タロウ',
      phone_number: '090-1234-5678',
      address: '東京都渋谷区道玄坂1-2-3',
    };

    const recordB = {
      customer_id: 'cust_002',
      customer_name: '山田太郎',
      phone_number: '09012345678',
      address: '東京都渋谷区道玄坂1丁目2番3号',
    };

    // 正規化ルール有効化状態での重複検出実行
    const duplicateDetectionResult = detectDuplicateCustomers({
      record_a: recordA,
      record_b: recordB,
      normalization_rules_enabled: true,
    });

    // 統合判定エンジンに正規化後のレコードペアを入力
    const mergeDecisionResult = mergeCustomerRecords({
      normalized_record_a: duplicateDetectionResult.normalized_record_a,
      normalized_record_b: duplicateDetectionResult.normalized_record_b,
      similarity_score: duplicateDetectionResult.similarity_score,
    });

    // 期待結果の検証
    expect(duplicateDetectionResult.is_duplicate).toBe(true);
    expect(mergeDecisionResult.is_mergeable).toBe(true);
    expect(mergeDecisionResult.similarity_score).toBeGreaterThanOrEqual(0.95);
    expect(typeof mergeDecisionResult.merged_customer_id).toBe('string');
    expect(mergeDecisionResult.merge_timestamp).toBeDefined();
  });
});