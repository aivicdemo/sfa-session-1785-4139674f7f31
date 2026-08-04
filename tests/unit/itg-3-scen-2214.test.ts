import { calculateDeviationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 標準プロセス照合', () => {
  // SCEN-2214
  test('提案内容の標準プロセス照合データが欠けている場合の処理 - 標準プロセス定義がnullのとき、乖離度は計算されず、空の結果が返される', () => {
    const proposalContent = {
      proposalId: 'PROP-20240115-001',
      customerName: '顧客A',
      proposedApproach: 'アプローチ1',
      timeline: '2024-02-01',
      amount: 500000,
    };

    const standardProcessDefinition = null;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const result = calculateDeviationScore(
      proposalContent,
      standardProcessDefinition,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({});
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('標準プロセス定義が利用できないため乖離度計算をスキップしました')
    );

    consoleSpy.mockRestore();
  });
});