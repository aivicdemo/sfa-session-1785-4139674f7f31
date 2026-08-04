import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2184
  test('顧客対応パターンと成功パターンのマッチスコア算出 - 複数成功パターンに対して個別にスコアが算出される', async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn()
        .mockResolvedValueOnce({ patternId: 'SP-001', score: 0.92 })
        .mockResolvedValueOnce({ patternId: 'SP-002', score: 0.78 })
        .mockResolvedValueOnce({ patternId: 'SP-003', score: 0.65 })
    };

    const customerContactPattern = {
      industry: '製造業',
      scale: 'large',
      budgetConfidence: 0.80,
      description: '大規模製造業への初回提案、予算確度80%以上'
    };

    const successPatterns = [
      { patternId: 'SP-001', name: 'Pattern1', characteristics: {} },
      { patternId: 'SP-002', name: 'Pattern2', characteristics: {} },
      { patternId: 'SP-003', name: 'Pattern3', characteristics: {} }
    ];

    const result = await evaluatePatternRelevance(
      customerContactPattern,
      successPatterns,
      mockAIEngine
    );

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      1,
      customerContactPattern,
      successPatterns[0]
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      2,
      customerContactPattern,
      successPatterns[1]
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      3,
      customerContactPattern,
      successPatterns[2]
    );

    expect(result).toEqual([
      { patternId: 'SP-001', score: 0.92 },
      { patternId: 'SP-002', score: 0.78 },
      { patternId: 'SP-003', score: 0.65 }
    ]);

    const scores = result.map((item: { patternId: string; score: number }) => item.score);
    const sortedScores = [...scores].sort((a: number, b: number) => b - a);
    expect(scores).toEqual(sortedScores);
  });
});