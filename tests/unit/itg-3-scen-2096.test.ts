import { getRecommendedApproachFromDealPattern } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2096
  test('提案内容と顧客対応パターンの標準プロセス照合分析 - 提案アプローチテーブルの推奨内容が分析対象として正しく取得される', () => {
    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approachId: 'APP-001',
        approachName: '顧客課題ヒアリング型提案',
        dealPatternId: 'PATTERN-2024-Q3-001',
        confidenceScore: 0.87,
        successRateHistory: 0.76,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const deal_conditions = {
      customerIndustry: '製造業',
      issueArea: 'DX推進',
      budgetRange: '5000万円以上',
    };

    const result = getRecommendedApproachFromDealPattern(
      deal_conditions,
      mock_ai_engine
    );

    expect(result).toBeDefined();
    expect(result.approachId).toBe('APP-001');
    expect(result.dealPatternId).toBe('PATTERN-2024-Q3-001');
    expect(result.confidenceScore).toBe(0.87);
    expect(result.successRateHistory).toBe(0.76);

    expect(result.approachId).toMatch(/^APP-/);
    expect(result.dealPatternId).toMatch(/^PATTERN-/);

    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(1);

    expect(result.successRateHistory).toBeGreaterThanOrEqual(0);
    expect(result.successRateHistory).toBeLessThanOrEqual(1);

    expect(mock_ai_engine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mock_ai_engine.generateRecommendation).toHaveBeenCalledWith(
      deal_conditions
    );
  });
});