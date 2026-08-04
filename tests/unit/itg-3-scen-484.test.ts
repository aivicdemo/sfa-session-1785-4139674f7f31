import { calculateImprovementPriorityRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質レポート確認', () => {
  // SCEN-484: [error] 改善優先度ランク算出機能 - 改善対象項目リストが null のとき、エラーが発生する
  test('should throw error when improvementItems is null', () => {
    const dataQualityScore = 85;
    const improvementItems = null;
    const validationRules = [
      {
        ruleId: 'rule-001',
        ruleName: '顧客名必須チェック',
        severity: 'high',
        detectionCount: 5,
      },
    ];

    expect(() =>
      calculateImprovementPriorityRank(
        dataQualityScore,
        improvementItems,
        validationRules
      )
    ).toThrow(/改善対象項目リスト/);
  });
});