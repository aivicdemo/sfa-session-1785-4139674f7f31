import { calculateSuccessPatternApplicability } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-407
  test('成功パターン適用判定機能 - 顧客属性の一致度が許容範囲の下限未満の場合、パターン適用の根拠から除外される', () => {
    const successPatternApplicabilityResult = calculateSuccessPatternApplicability({
      customerAttributeMatchThresholdMin: 0.70,
      customerAttributeMatchDegree: 0.69,
      businessChallengeMatchDegree: 0.85,
      productCategoryAlignmentDegree: 0.80,
      proposalTimingOptimalityDegree: 0.75,
    });

    expect(successPatternApplicabilityResult.customerAttributeMatchExcluded).toBe(true);
    expect(successPatternApplicabilityResult.reasoning).toEqual({
      customerAttributeMatchIncluded: false,
      businessChallengeMatchIncluded: true,
      productCategoryAlignmentIncluded: true,
      proposalTimingOptimalityIncluded: true,
    });
    expect(successPatternApplicabilityResult.applicableBasisCount).toBe(3);
    expect(successPatternApplicabilityResult.isApplicableForGuidance).toBe(true);
  });
});