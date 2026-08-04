import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 成功パターン適用可能性評価', () => {
  // SCEN-2917
  test('evaluatePatternRelevance が想定外の値を返した場合、スコア値が0～1の範囲に正規化され、範囲外は代替パターンを返却する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    const dealCondition = {
      industry: '製造業',
      dealAmount: 5000000,
      contractPeriodMonths: 24,
    };

    const successPatternMaster = [
      {
        patternId: 'PATTERN_001',
        industry: '製造業',
        minAmount: 1000000,
        maxAmount: 10000000,
        successRate: 0.92,
        frequency: 45,
      },
      {
        patternId: 'PATTERN_002',
        industry: '製造業',
        minAmount: 500000,
        maxAmount: 5000000,
        successRate: 0.85,
        frequency: 32,
      },
    ];

    // ケース1: evaluatePatternRelevance が1を超える値を返す
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce(1.5);

    const result1 = evaluatePatternRelevance(
      dealCondition,
      successPatternMaster,
      mockAIEngine.evaluatePatternRelevance
    );

    expect(result1).toEqual({
      normalizedScore: 1.0,
      recommendedPattern: {
        patternId: 'PATTERN_001',
        industry: '製造業',
        minAmount: 1000000,
        maxAmount: 10000000,
        successRate: 0.92,
        frequency: 45,
      },
      fallbackReason: 'スコア値が無効な範囲',
      errorLog: expect.stringContaining('evaluatePatternRelevance が無効なスコア値を返却したため、代替パターンを使用'),
    });

    // ケース2: evaluatePatternRelevance が負の数を返す
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce(-0.5);

    const result2 = evaluatePatternRelevance(
      dealCondition,
      successPatternMaster,
      mockAIEngine.evaluatePatternRelevance
    );

    expect(result2.normalizedScore).toBe(0.0);
    expect(result2.recommendedPattern.patternId).toBe('PATTERN_001');
    expect(result2.errorLog).toContain('evaluatePatternRelevance が無効なスコア値を返却したため、代替パターンを使用');

    // ケース3: evaluatePatternRelevance が null を返す
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce(null);

    const result3 = evaluatePatternRelevance(
      dealCondition,
      successPatternMaster,
      mockAIEngine.evaluatePatternRelevance
    );

    expect(result3.normalizedScore).toBe(0.0);
    expect(result3.recommendedPattern.successRate).toBe(0.92);

    // ケース4: evaluatePatternRelevance が undefined を返す
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce(undefined);

    const result4 = evaluatePatternRelevance(
      dealCondition,
      successPatternMaster,
      mockAIEngine.evaluatePatternRelevance
    );

    expect(result4.normalizedScore).toBe(0.0);
    expect(result4.recommendedPattern.patternId).toBe('PATTERN_001');

    // ケース5: evaluatePatternRelevance が文字列を返す
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce('invalid_string');

    const result5 = evaluatePatternRelevance(
      dealCondition,
      successPatternMaster,
      mockAIEngine.evaluatePatternRelevance
    );

    expect(result5.normalizedScore).toBe(0.0);
    expect(Array.isArray(result5.recommendedPattern) || typeof result5.recommendedPattern === 'object').toBe(true);
    expect(result5.errorLog).toContain('evaluatePatternRelevance が無効なスコア値を返却したため、代替パターンを使用');

    // ケース6: evaluatePatternRelevance が NaN を返す
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce(NaN);

    const result6 = evaluatePatternRelevance(
      dealCondition,
      successPatternMaster,
      mockAIEngine.evaluatePatternRelevance
    );

    expect(result6.normalizedScore).toBe(0.0);
    expect(result6.recommendedPattern.frequency).toBe(45);

    // ケース7: evaluatePatternRelevance が有効な値を返す（正規ケース）
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce(0.65);

    const result7 = evaluatePatternRelevance(
      dealCondition,
      successPatternMaster,
      mockAIEngine.evaluatePatternRelevance
    );

    expect(result7.normalizedScore).toBe(0.65);
    expect(result7.fallbackReason).toBeUndefined();
    expect(result7.errorLog).toBeUndefined();
  });
});