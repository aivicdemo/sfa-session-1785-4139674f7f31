import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2205
  test('顧客対応の接触パターンの分析 - 接触回数が1回のとき、その1回の接触内容が成功パターンと個別に照合される', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'SP-001',
          patternDescription: '初回面談で課題ヒアリングを完了し、提案日程を確定させるパターン',
          relevanceScore: 0.85,
        },
      ]),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerContactData = {
      customerId: 'C001',
      contactDateTime: '2026-08-01T10:30:00Z',
      contactContent: '初回面談、課題ヒアリング完了、提案日程確定',
      contactType: 'success_pattern_match',
      contactCount: 1,
    };

    const result = evaluatePatternRelevance(
      customerContactData,
      mockAIRecommendationEngine,
    );

    expect(result).toBeDefined();
    expect(result.matchedPatternId).toBe('SP-001');
    expect(typeof result.relevanceScore).toBe('number');
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0.75);
    expect(result.relevanceScore).toBeLessThanOrEqual(1.0);
    expect(result.patternDescription).toContain('初回面談');
    expect(result.patternDescription).toContain('課題ヒアリング');
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      customerContactData,
    );
  });
});