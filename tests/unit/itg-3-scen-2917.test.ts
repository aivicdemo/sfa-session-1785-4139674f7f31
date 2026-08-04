import { evaluatePatternRelevanceWithFallback } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2917
  test('[edge] OpenAI API連携 - evaluatePatternRelevance呼び出しが想定外の値を返した場合、スコア値が検証される', () => {
    const newDealCondition = {
      customerIndustry: 'IT',
      dealAmount: 5000000,
      contractPeriodMonths: 12,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const successPatternMaster = [
      {
        patternId: 'pat_001',
        frequency: 85,
        description: 'Top success pattern',
      },
      {
        patternId: 'pat_002',
        frequency: 72,
        description: 'Second success pattern',
      },
      {
        patternId: 'pat_003',
        frequency: 60,
        description: 'Third success pattern',
      },
    ];

    // Test Case 1: evaluatePatternRelevance returns null
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce(null);

    const resultNull = evaluatePatternRelevanceWithFallback(
      newDealCondition,
      mockAIEngine,
      successPatternMaster
    );

    expect(resultNull).toHaveProperty('normalizedScore', 0.0);
    expect(resultNull).toHaveProperty('fallbackPattern');
    expect(resultNull.fallbackPattern.patternId).toBe('pat_001');
    expect(resultNull).toHaveProperty('errorLog');
    expect(resultNull.errorLog).toMatch(/無効なスコア値/);

    // Test Case 2: evaluatePatternRelevance returns undefined
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce(undefined);

    const resultUndefined = evaluatePatternRelevanceWithFallback(
      newDealCondition,
      mockAIEngine,
      successPatternMaster
    );

    expect(resultUndefined).toHaveProperty('normalizedScore', 0.0);
    expect(resultUndefined).toHaveProperty('fallbackPattern');
    expect(resultUndefined.fallbackPattern.patternId).toBe('pat_001');
    expect(resultUndefined).toHaveProperty('errorLog');

    // Test Case 3: evaluatePatternRelevance returns negative number
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce(-0.5);

    const resultNegative = evaluatePatternRelevanceWithFallback(
      newDealCondition,
      mockAIEngine,
      successPatternMaster
    );

    expect(resultNegative).toHaveProperty('normalizedScore', 0.0);
    expect(resultNegative).toHaveProperty('fallbackPattern');
    expect(resultNegative.fallbackPattern.patternId).toBe('pat_001');

    // Test Case 4: evaluatePatternRelevance returns value > 1
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce(1.5);

    const resultExceeds = evaluatePatternRelevanceWithFallback(
      newDealCondition,
      mockAIEngine,
      successPatternMaster
    );

    expect(resultExceeds).toHaveProperty('normalizedScore', 1.0);
    expect(resultExceeds).toHaveProperty('fallbackPattern');
    expect(resultExceeds.fallbackPattern.patternId).toBe('pat_001');

    // Test Case 5: evaluatePatternRelevance returns non-numeric type (string)
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce('invalid');

    const resultString = evaluatePatternRelevanceWithFallback(
      newDealCondition,
      mockAIEngine,
      successPatternMaster
    );

    expect(resultString).toHaveProperty('normalizedScore', 0.0);
    expect(resultString).toHaveProperty('fallbackPattern');
    expect(resultString.fallbackPattern.patternId).toBe('pat_001');
    expect(resultString).toHaveProperty('errorLog');

    // Test Case 6: evaluatePatternRelevance returns NaN
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce(NaN);

    const resultNaN = evaluatePatternRelevanceWithFallback(
      newDealCondition,
      mockAIEngine,
      successPatternMaster
    );

    expect(resultNaN).toHaveProperty('normalizedScore', 0.0);
    expect(resultNaN).toHaveProperty('fallbackPattern');
    expect(resultNaN.fallbackPattern.patternId).toBe('pat_001');
    expect(resultNaN).toHaveProperty('errorLog');

    // Test Case 7: Valid score within range [0, 1]
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce(0.75);

    const resultValid = evaluatePatternRelevanceWithFallback(
      newDealCondition,
      mockAIEngine,
      successPatternMaster
    );

    expect(resultValid).toHaveProperty('normalizedScore', 0.75);
    expect(resultValid).not.toHaveProperty('fallbackPattern');
    expect(resultValid).not.toHaveProperty('errorLog');

    // Verify error log message format when fallback is used
    expect(resultNull.errorLog).toContain('evaluatePatternRelevance');
    expect(resultNull.errorLog).toContain('代替パターン');
  });
});