import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンの適用可能性評価機能', () => {
  // SCEN-251
  test('外部APIエラー時に指数バックオフ再試行と代替パターンマスタ動作を実行する', async () => {
    const dealCondition = {
      customerIndustry: 'manufacturing',
      budgetRange: 'medium',
      purchaseCycle: 'quarterly',
      dealSize: 500000,
    };
    const successPatternId = 'pattern-001';

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    const startTime = Date.now();
    let callCount = 0;

    mockAIEngine.evaluatePatternRelevance.mockImplementation(async () => {
      callCount++;
      throw new Error('503 Service Unavailable');
    });

    const result = await evaluatePatternRelevance(
      dealCondition,
      successPatternId,
      mockAIEngine
    );

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    expect(callCount).toBe(3);
    expect(elapsedTime).toBeLessThan(30000);

    expect(result).toHaveProperty('relevanceScore');
    expect(typeof result.relevanceScore).toBe('number');
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0);
    expect(result.relevanceScore).toBeLessThanOrEqual(1.0);

    expect(result).toHaveProperty('source');
    expect(result.source).toBe('fallback_pattern_master');

    expect(result).toHaveProperty('reasoning');
    expect(typeof result.reasoning).toBe('string');
    expect(result.reasoning.length).toBeLessThanOrEqual(200);

    expect(result).toHaveProperty('pattern');
    expect(result.pattern).toBeDefined();
  });
});