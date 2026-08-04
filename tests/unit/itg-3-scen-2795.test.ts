import { extractAndWeightSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック', () => {
  // SCEN-2795
  test('生成された重み付けルールが不正な形式のとき、エラーを返す', () => {
    // Arrange
    const invalidWeightingRuleWithMissingField = {
      feature_weights: [
        {
          feature_name: 'customer_industry',
          // pattern_id が欠落（必須フィールド）
          weight: 0.8
        }
      ]
    };

    const invalidWeightingRuleWithOutOfRangeWeight = {
      pattern_id: 'pat_001',
      feature_weights: [
        {
          feature_name: 'customer_industry',
          pattern_id: 'pat_001',
          weight: 1.5 // 0～1 の範囲外
        }
      ]
    };

    const invalidWeightingRuleWithMalformedJSON = 'not_a_valid_json_object';

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue(invalidWeightingRuleWithMissingField),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // Act & Assert - 必須フィールド欠落の場合
    expect(() => {
      extractAndWeightSuccessPatterns(
        {
          customer_id: 'cust_001',
          industry: 'IT',
          company_size: 'large',
          deal_stage: 'proposal'
        },
        mockAIEngine
      );
    }).toThrow(/重み付けルール/);

    // Arrange - 範囲外の重み付け値の場合
    mockAIEngine.generateRecommendation.mockReturnValue(invalidWeightingRuleWithOutOfRangeWeight);

    expect(() => {
      extractAndWeightSuccessPatterns(
        {
          customer_id: 'cust_002',
          industry: 'Finance',
          company_size: 'medium',
          deal_stage: 'negotiation'
        },
        mockAIEngine
      );
    }).toThrow(/重み付け値/);

    // Arrange - 不正な JSON 文字列の場合
    mockAIEngine.generateRecommendation.mockReturnValue(invalidWeightingRuleWithMalformedJSON);

    expect(() => {
      extractAndWeightSuccessPatterns(
        {
          customer_id: 'cust_003',
          industry: 'Manufacturing',
          company_size: 'small',
          deal_stage: 'initial_contact'
        },
        mockAIEngine
      );
    }).toThrow(/形式/);
  });
});