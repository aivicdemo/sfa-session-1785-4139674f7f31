import { analyzeSellerBehaviorPattern } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-811
  test('特定のステップが営業活動ログに1件記録されている場合、そのステップの実行判定は完了とされる', () => {
    const seller_id = 'SELLER_001';
    const step_name = '初回訪問';
    const activity_log_count = 1;
    const expected_completion_status = '完了';

    const result = analyzeSellerBehaviorPattern({
      seller_id: seller_id,
      step_name: step_name,
      activity_log_count: activity_log_count
    });

    expect(result.step_name).toBe(step_name);
    expect(result.completion_status).toBe(expected_completion_status);
    expect(result.seller_id).toBe(seller_id);
    expect(result.record_count).toBe(1);
  });
});