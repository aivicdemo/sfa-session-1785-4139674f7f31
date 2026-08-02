import { determineDuplicateDetectionRulePriority } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-496: 重複検知ルール実行優先度決定機能 - 優先度スコアが小数点以下を含むときに期待通り四捨五入される', () => {
    const input_priority_score = 8.567;
    const expected_rounded_priority = 9;
    
    const result = determineDuplicateDetectionRulePriority({
      priority_score: input_priority_score,
    });
    
    expect(result.rounded_priority_score).toBe(expected_rounded_priority);
  });
});