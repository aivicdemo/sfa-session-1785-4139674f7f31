import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-942
  test('改善優先度スコア算出機能 - 影響度が負の数のときエラーになる', () => {
    const invalidParams = {
      impact: -5,
      urgency: 8,
      improvementEffect: 7,
      frequency: 3,
    };

    expect(() => {
      calculateImprovementPriorityScore(invalidParams);
    }).toThrow(/INVALID_IMPACT_VALUE/);

    try {
      calculateImprovementPriorityScore(invalidParams);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch(/影響度は0以上の数値を指定してください/);
      }
    }
  });
});