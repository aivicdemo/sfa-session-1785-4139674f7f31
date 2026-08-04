import { extractSuccessPatternsAndGenerateWeights } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けルール生成機能', () => {
  // SCEN-2770
  test('複数の特徴量を組み合わせた相関分析で、各特徴量の個別重み付けが生成される', () => {
    // Arrange: スタブの設定
    const mockSimilarPatterns = [
      {
        patternId: 'pattern_001',
        successRate: 0.92,
        features: {
          customerSize: 'large',
          industry: 'IT',
          dealDuration: 90,
          budgetSize: 5000000,
          decisionMakerCount: 3,
        },
      },
      {
        patternId: 'pattern_002',
        successRate: 0.88,
        features: {
          customerSize: 'medium',
          industry: 'Finance',
          dealDuration: 60,
          budgetSize: 2000000,
          decisionMakerCount: 2,
        },
      },
      {
        patternId: 'pattern_003',
        successRate: 0.81,
        features: {
          customerSize: 'large',
          industry: 'Manufacturing',
          dealDuration: 120,
          budgetSize: 8000000,
          decisionMakerCount: 5,
        },
      },
    ];

    const patternRelevanceScores = [0.85, 0.72, 0.68];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(mockSimilarPatterns),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((pattern) => {
          const index = mockSimilarPatterns.findIndex(
            (p) => p.patternId === pattern.patternId
          );
          return patternRelevanceScores[index];
        }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const newProjectInput = {
      customerSize: 'large',
      industry: 'IT',
      dealDuration: 75,
      budgetSize: 4500000,
      decisionMakerCount: 3,
    };

    // Act
    const result = extractSuccessPatternsAndGenerateWeights(
      newProjectInput,
      mockAIEngine
    );

    // Assert: 重み付けルールが生成されたことを確認
    expect(result).toBeDefined();
    expect(result.weights).toBeDefined();

    // 各特徴量の重み値が0～1の範囲であることを確認
    expect(result.weights.customerSize).toBeGreaterThanOrEqual(0);
    expect(result.weights.customerSize).toBeLessThanOrEqual(1);
    expect(result.weights.industry).toBeGreaterThanOrEqual(0);
    expect(result.weights.industry).toBeLessThanOrEqual(1);
    expect(result.weights.dealDuration).toBeGreaterThanOrEqual(0);
    expect(result.weights.dealDuration).toBeLessThanOrEqual(1);
    expect(result.weights.budgetSize).toBeGreaterThanOrEqual(0);
    expect(result.weights.budgetSize).toBeLessThanOrEqual(1);
    expect(result.weights.decisionMakerCount).toBeGreaterThanOrEqual(0);
    expect(result.weights.decisionMakerCount).toBeLessThanOrEqual(1);

    // 重み値の合計が1.0であることを確認
    const weightsSum =
      result.weights.customerSize +
      result.weights.industry +
      result.weights.dealDuration +
      result.weights.budgetSize +
      result.weights.decisionMakerCount;
    expect(weightsSum).toBeCloseTo(1.0, 5);

    // 具体的な重み値を検証
    // relevanceScores: [0.85, 0.72, 0.68], 合計 = 2.25
    // 正規化: 0.85/2.25 ≈ 0.378, 0.72/2.25 ≈ 0.320, 0.68/2.25 ≈ 0.302
    // customerSizeは3パターン中2つがlarge (relevance 0.85 + 0.68 = 1.53)
    // 計算: (0.85 + 0.68) / 2.25 ≈ 0.68 → 正規化で各特徴量への寄与度を計算
    expect(result.weights.customerSize).toBeCloseTo(0.28, 2);
    expect(result.weights.industry).toBeCloseTo(0.24, 2);
    expect(result.weights.dealDuration).toBeCloseTo(0.22, 2);
    expect(result.weights.budgetSize).toBeCloseTo(0.18, 2);
    expect(result.weights.decisionMakerCount).toBeCloseTo(0.08, 2);

    // 根拠情報が記録されていることを確認
    expect(result.rationale).toBeDefined();
    expect(Array.isArray(result.rationale)).toBe(true);
    expect(result.rationale.length).toBeGreaterThan(0);

    // 根拠情報に特徴量と成功パターンの関連性が記録されていることを確認
    const hasCustomerSizeRationale = result.rationale.some(
      (r) =>
        r.featureName === 'customerSize' &&
        r.contributingPatternId &&
        typeof r.contributionScore === 'number'
    );
    expect(hasCustomerSizeRationale).toBe(true);

    const hasIndustryRationale = result.rationale.some(
      (r) =>
        r.featureName === 'industry' &&
        r.contributingPatternId &&
        typeof r.contributionScore === 'number'
    );
    expect(hasIndustryRationale).toBe(true);

    // AIエンジンのメソッドが呼び出されたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newProjectInput
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});