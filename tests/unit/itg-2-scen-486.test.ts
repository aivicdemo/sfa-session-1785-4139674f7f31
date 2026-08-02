import { decideDuplicateDetectionRulePriority } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-486
  test('重複検知ルール実行優先度決定機能 - 品質リスク度合いがnullのときにエラーが発生する', () => {
    const input = {
      ruleId: 'RULE-001',
      qualityRiskDegree: null,
      detectionEfficiency: 0.85,
    };

    expect(() => decideDuplicateDetectionRulePriority(input)).toThrow(/品質リスク度合い/);
  });
});