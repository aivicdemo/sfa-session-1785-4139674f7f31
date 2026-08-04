import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2456
  test('推奨精度スコア算出機能 - AIエージェント外部API呼び出し失敗時に代替の信頼度スコアが返却される', async () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn()
        .mockRejectedValueOnce(new Error('network timeout'))
        .mockRejectedValueOnce(new Error('network timeout'))
        .mockRejectedValueOnce(new Error('network timeout')),
    };

    const mockPatternMaster = [
      { patternId: 'PAT001', successRate: 0.78, patternRank: 3 },
      { patternId: 'PAT002', successRate: 0.85, patternRank: 1 },
      { patternId: 'PAT003', successRate: 0.72, patternRank: 4 },
    ];

    const newCaseData = {
      customerId: 'CUST12345',
      customerScale: '中堅企業',
      industry: '製造業',
      budget: 5000000,
      caseName: 'Test Case for Pattern Relevance',
    };

    const result = await evaluatePatternRelevance(
      newCaseData,
      mockAIRecommendationEngine,
      mockPatternMaster,
    );

    expect(result).toBe(0.85);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
  });
});