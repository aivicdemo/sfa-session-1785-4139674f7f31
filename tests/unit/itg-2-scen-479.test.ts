import { decideDuplicateDetectionRulePriority } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-479
  test('重複検知ルール実行優先度決定機能 - 品質リスク度合いが0のときに優先度スコアに反映されない', () => {
    const input = {
      qualityRiskDegree: 0,
      duplicateCountScore: 80,
      ruleImportance: 'high',
    };

    const result = decideDuplicateDetectionRulePriority(input);

    expect(result.priorityScore).toBe(100);
  });
});