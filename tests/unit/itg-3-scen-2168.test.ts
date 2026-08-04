import { calculateProposalProcessDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2168: [edge] 提案プロセス乖離度の数値化 - 標準プロセスからの乖離度がちょうど 100% のとき、乖離スコアが 100 で算出される
  test('標準プロセスから完全に逸脱した場合、乖離スコアが100で返却される', () => {
    const standardProcessDefinition = {
      recommendedStepCount: 10,
      recommendedItemCount: 50,
    };

    const actualProcessExecutionData = {
      executedRecommendedSteps: 0,
      executedRecommendedItems: 0,
      executedNonRecommendedSteps: 10,
      executedNonRecommendedItems: 0,
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        alignmentScore: 0,
        deviationPercentage: 100,
      }),
    };

    const result = calculateProposalProcessDeviation(
      actualProcessExecutionData,
      standardProcessDefinition,
      mockAIRecommendationEngine
    );

    expect(result.deviationScore).toBe(100);
    expect(result.calculationLog).toContain('標準プロセスとの一致度0%');
    expect(result.calculationLog).toContain('乖離度100%');
  });
});