import { calculateDuplicateDetectionRulePriority } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-492: [normal] 重複検知ルール実行優先度決定機能 - 優先度スコア計算式に品質リスク度合いの重み付けが反映される
  test('should calculate duplicate detection rule priority scores with quality risk weighting', () => {
    const quality_risk_weights = {
      high: 0.8,
      medium: 0.5,
      low: 0.2,
    };

    const duplicate_detection_rules = [
      {
        rule_id: 'rule_a',
        match_score: 80,
        risk_level: 'high',
      },
      {
        rule_id: 'rule_b',
        match_score: 75,
        risk_level: 'medium',
      },
      {
        rule_id: 'rule_c',
        match_score: 70,
        risk_level: 'low',
      },
    ];

    const result = calculateDuplicateDetectionRulePriority(
      duplicate_detection_rules,
      quality_risk_weights
    );

    expect(result).toEqual([
      {
        rule_id: 'rule_a',
        match_score: 80,
        risk_level: 'high',
        priority_score: 64.0,
        execution_order: 1,
      },
      {
        rule_id: 'rule_b',
        match_score: 75,
        risk_level: 'medium',
        priority_score: 37.5,
        execution_order: 2,
      },
      {
        rule_id: 'rule_c',
        match_score: 70,
        risk_level: 'low',
        priority_score: 14.0,
        execution_order: 3,
      },
    ]);
  });
});